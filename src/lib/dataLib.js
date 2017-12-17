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

const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

const areLoaded = (data, zone) => {
    return data.filter(d => d.zone === zone).length > 0 &&
        data.filter(d => d.zone === zone)[0].statements.results !== undefined &&
        data.filter(d => d.zone === zone)[0].statements.results.bindings.length > 0
}

const getPropList = (configs, propIndex) => {
    return configs.matches.map(config => {
        return {
            path: config.properties[propIndex].path,
            selected: config.selected
        }
    }).reduce((configAcc, config) => {
        const exists = configAcc.filter(c => c.path === config.path).length > 0
        if (!exists) {
            configAcc.push(config)
        }
        return configAcc
    }, [])
}

const getLegend = (nestedProps, colors, category) => {
    return {
        info: nestedProps.map((p, i) => {
            return {
                key: p.key,
                color: colors[i],
                propName: 'prop2',
                label: p.values[0].labelprop2 ? p.values[0].labelprop2.value : p.key,
                category
            }
        })
    }
}

const getAxis = (nestedProps, propName, category) => {
    return {
        info: nestedProps.map(p => {
            let values
            if (p.values.length === 0) { // last value for scale only
                values = null
            } else if (category === 'datetime') {
                values = [d3.min(p.values, d => Number(d.year)), d3.max(p.values, d => Number(d.year))]
            } else if (category === 'text' || category === 'uri') {
                values = p.key
            } else if (category === 'number') {
                values = [d3.min(p.values, d => Number(d.prop1.value)), d3.max(p.values, d => Number(d.prop1.value))]
            }
            return {
                key: p.key,
                propName: 'prop1',
                values,
                category
            }
        }),
        category
    }
}

const groupTimeData = (data, propName, format, max, propsToAdd = []) => {
    //console.log(data, propName, format, max, propsToAdd)
    let dataToNest = data.map(d => {
        let dateProp = moment(d[propName].value, format)
        if (!dateProp.isValid()) throw 'Cannot use time format'
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
    // console.log(yearNest.length, decadeNest.length, centuryNest.length)
    let nest
    let additionalValue
    let keyFormat
    if (yearNest.length < max) {
        nest = yearNest
        additionalValue = Number(yearNest[yearNest.length - 1].key) + 1
    } else if (decadeNest.length < max) {
        nest = decadeNest
        additionalValue = Number(decadeNest[decadeNest.length - 1].key) + 10
    } else {
        nest = centuryNest
        additionalValue = Number(centuryNest[centuryNest.length - 1].key) + 100
    }
    return [...nest.map(group => {
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
    }), { key: additionalValue, values: [] }]
}

exports.areLoaded = areLoaded
exports.getAxis = getAxis
exports.getHeadings = getHeadings
exports.getLegend = getLegend
exports.getPropList = getPropList
exports.getResults = getResults
exports.groupTimeData = groupTimeData
exports.guid = guid
