import * as d3 from 'd3'
import moment from 'moment'

const getResults = (data, zone) => {
    return (areLoaded(data, zone))
        ? data.filter(d => d.zone === zone)[0].statements.results.bindings : []
}

const getHeadings = (data, zone) => {
    return (areLoaded(data, zone))
        ? data.filter(d => d.zone === zone)[0].statements.head.vars : []
}

const areLoaded = (data, zone) => {
    return data.filter(d => d.zone === zone).length > 0 &&
        data.filter(d => d.zone === zone)[0].statements.results !== undefined &&
        data.filter(d => d.zone === zone)[0].statements.results.bindings.length > 0
}

const groupTimeData = (data, propName, format, max, propsToAdd = []) => {
    let dataToNest = data.map(d => {
        let dateProp = moment(d[propName].value, format)
        if (! dateProp.isValid()) throw 'Cannot use time format'

        return {
            ...d,
            dateProp,
            year: dateProp.format('Y'),
            decade: Math.floor(Number(dateProp.format('Y')) / 10) * 10,
            century: Math.floor(Number(dateProp.format('Y')) / 100) * 100
        }
    }).sort((a, b) => a.year - b.year)
    let yearNest = d3.nest().key(prop => prop.year).entries(dataToNest)
    let decadeNest = d3.nest().key(prop => prop.decade).entries(dataToNest)
    let centuryNest = d3.nest().key(prop => prop.century).entries(dataToNest)
    // console.log(yearNest.length)
    let nest
    if (yearNest.length < max) {
        nest = yearNest
    } else if (decadeNest.length < max) {
        nest = decadeNest
    } else {
        nest = centuryNest
    }
    return nest.map(group => {
        let groupWithAdd = { 
            ...group,
            values: group.values.sort((a, b) => b.prop2.value.localeCompare(a.prop2.value))
        }
        propsToAdd.forEach(prop => {
            groupWithAdd[prop] = 0
            group.values.forEach(val => {
                groupWithAdd[prop] += Number(val[prop]) || 1
            })
        })
        return groupWithAdd
    })
}

const makeQuery = (entrypoint, config) => {
    let propList = (config.entrypoint === undefined) ? `` : `?entrypoint `
    let groupList = (config.entrypoint === undefined) ? `` : `?entrypoint `
    let defList = ``
    let orderList = ``
    config.selectedMatch.properties.forEach((prop, index) => {
        index ++
        propList = propList.concat(`?prop${index} `)
        orderList = orderList.concat(`?prop${index} `)
        if (config.entrypoint === undefined) {
            propList = propList.concat(`(COUNT(?prop${index}) as ?countprop${index}) `)
            orderList = orderList.concat(`?countprop${index} `)
            groupList = groupList.concat(`?prop${index} `)
        } else {
            groupList = groupList.concat(`?prop${index} `)
        }
        defList = defList.concat(FSL2SPARQL(prop.path, `prop${index}`))
    })
    return `SELECT DISTINCT ${propList}
WHERE { ?entrypoint rdf:type ${entrypoint} . 
${defList}
} GROUP BY ${groupList}ORDER BY ${orderList}`

}

const FSL2SPARQL = (FSLpath, propName = 'prop1') => {
    const entrypointName = 'entrypoint'
    let pathParts = FSLpath.split('/')
    let query = ``
    let levels = Math.floor(pathParts.length / 2)
    for (let index = 1; index < pathParts.length; index += 2) {
        let predicate = pathParts[index]
        let objectType = pathParts[index + 1]
        let level = Math.ceil(index / 2)
        let thisSubject = (level === 1) ? entrypointName : `${propName}inter${(level - 1)}`
        let thisObject = (level === levels) ? propName : `${propName}inter${level}`
        query = query.concat(`?${thisSubject} ${predicate} ?${thisObject} . `)
        if (objectType !== '*') {
            query = query.concat(`?${thisObject} rdf:type ${objectType} . `)
        }        
    }
    return query
}

exports.areLoaded = areLoaded
exports.FSL2SPARQL = FSL2SPARQL
exports.getHeadings = getHeadings
exports.getResults = getResults
exports.groupTimeData = groupTimeData
exports.makeQuery = makeQuery
