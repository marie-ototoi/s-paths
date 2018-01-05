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

const getPropList = (configs, propIndex, labels) => {
    return configs.matches.map(config => {
        return {
            path: config.properties[propIndex].path,
            readablePath: getReadablePathsParts(config.properties[propIndex].path, labels),
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
        }).sort((a, b) => { return a.label.localeCompare(b.label) })
    }
}

const getReadablePathsParts = (path, labels) => {
    const parts = path.split('/')
    if (!labels) return parts.map(part => { return { label: part } })
    return parts
        .filter((part, index) => index !== 0 && part !== '*')
        .map(part => {
            let prop = labels.filter(l => l.prefUri === part)
            return {
                label: prop[0].label || part,
                comment: prop[0].comment || undefined
            }
        })
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

const groupTimeData = (data, propName, format, max, propsToAdd = [], forceGroup) => {
    // console.log(data, propName, format, max)
    let group
    let dataToNest = data.map(d => {
        let dateProp = moment(d[propName].value, format)
        if (!dateProp.isValid()) throw new Error('Cannot use time format')
        return {
            ...d,
            dateProp,
            year: dateProp.format('Y'),
            decade: Math.floor(Number(dateProp.format('Y')) / 10) * 10,
            century: Math.floor(Number(dateProp.format('Y')) / 100) * 100
        }
    }).sort((a, b) => a.year - b.year)
    let yearNest = d3.nest().key(prop => prop.year).entries(dataToNest)
    let yearNumber = Number(yearNest[yearNest.length - 1].key) - Number(yearNest[0].key)
    let decadeNest = d3.nest().key(prop => prop.decade).entries(dataToNest)
    let decadeNumber = (Number(decadeNest[decadeNest.length - 1].key) - Number(decadeNest[0].key)) / 10
    let centuryNest = d3.nest().key(prop => prop.century).entries(dataToNest)
    let centuryNumber = (Number(centuryNest[centuryNest.length - 1].key) - Number(centuryNest[0].key)) / 100
    // console.log(yearNest.length, yearNumber, decadeNest.length, decadeNumber, centuryNest.length, centuryNumber)
    let nest
    let additionalValue
    let keyFormat
    if (forceGroup === 'year' || yearNumber < max) {
        nest = yearNest
        group = 'year'
        additionalValue = Number(yearNest[yearNest.length - 1].key) + 1
    } else if (forceGroup === 'decade' || (!forceGroup && decadeNumber < max)) {
        nest = decadeNest
        group = 'decade'
        additionalValue = Number(decadeNest[decadeNest.length - 1].key) + 10
    } else {
        nest = centuryNest
        group = 'century'
        additionalValue = Number(centuryNest[centuryNest.length - 1].key) + 100
    }
    return [...nest.map(keygroup => {
        let groupWithAdd = {
            ...keygroup,
            values: keygroup.values.sort((a, b) => b.prop2.value.localeCompare(a.prop2.value))
        }
        propsToAdd.forEach(prop => {
            groupWithAdd[prop] = 0
            keygroup.values.forEach(val => {
                groupWithAdd[prop] += Number(val[prop]) || 1
            })
        })
        return groupWithAdd
    }), { key: additionalValue, values: [], group }]
}

exports.areLoaded = areLoaded
exports.getAxis = getAxis
exports.getHeadings = getHeadings
exports.getLegend = getLegend
exports.getPropList = getPropList
exports.getResults = getResults
exports.groupTimeData = groupTimeData
exports.guid = guid
