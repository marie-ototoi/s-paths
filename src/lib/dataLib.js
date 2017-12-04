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

exports.areLoaded = areLoaded
exports.getHeadings = getHeadings
exports.getResults = getResults
exports.groupTimeData = groupTimeData