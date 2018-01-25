import * as d3 from 'd3'
import moment from 'moment'
import { isNumber } from 'util';

const areLoaded = (data, zone, status) => {
    data = getCurrentData(data, status)
    const filtered = data.filter(d => (d.zone === zone && d.status === status))
    return filtered.length > 0 &&
        filtered[0].statements.results !== undefined &&
        filtered[0].statements.results.bindings.length > 0
}

const getCurrentState = (data, zone) => {
    const filtered = data.present.filter(d => (d.zone === zone))
    if (filtered[0].statements.length === 0) {
        return 'loading'
    } else {
        return filtered[0].status
    }
}

const getThresholdsForLegend = (nestedProps, propName, category, nbOfRanges) => {
    const values = nestedProps.reduce((acc, curr) => {
        curr.values.forEach(val => {
            if (isNumber(val['count' + propName])) acc.push(val['count' + propName])
        })
        return acc
    }, []).sort((a, b) => a - b)
    const thresholds = getThresholds(values[0], values[values.length - 1], nbOfRanges)
    return thresholds.map(t => {
        return {
            key: t,
            category
        }
    })
}

const getThresholds = (minValue, maxValue, nbOfRanges) => {
    const diff = maxValue - minValue
    const part = Math.round(diff / nbOfRanges)
    var roundUnit = Number('1e' + (String(part).length - 2))
    var roundStart = Number('1e' + (String(part).length - 1))
    let roundPart = Math.ceil(part / roundUnit)
    let roundPartStr = String(roundPart)
    if (Number(roundPartStr.substr(roundPartStr.length - 1, 1)) <= 5) {
        roundPart = Number(roundPartStr.substr(0, roundPartStr.length - 1) + '5')
    } else {
        roundPart = Number(roundPartStr.substr(0, roundPartStr.length - 1) + '0') + 10
    }
    roundPart *= roundUnit
    const start = Math.floor(minValue / roundStart) * roundStart
    let ranges = Array.from(Array(nbOfRanges).keys())
    // return [diff, part, roundUnit, roundStart, start, roundPartStr, roundPart]
    return ranges.map((r) => [start + r * roundPart, start + (r + 1) * roundPart]).filter(v => v[0] <= maxValue)
}

// const groupAggregateData

const getCurrentData = (data, status) => {
    const currentStateMain = getCurrentState(data, 'main')
    const currentStateAside = getCurrentState(data, 'aside')
    let dataMain
    let dataAside
    if (currentStateMain === 'transition' && status === 'active') {
        dataMain = data.past[data.past.length - 1].filter(d => d.zone === 'main')
    } else {
        dataMain = data.present.filter(d => d.zone === 'main')
    }
    if (currentStateAside === 'transition' && status === 'active') {
        dataAside = data.past[data.past.length - 1].filter(d => d.zone === 'aside')
    } else {
        dataAside = data.present.filter(d => d.zone === 'aside')
    }
    return [
        ...dataMain,
        ...dataAside
    ]
}

const getResults = (data, zone, status) => {
    data = getCurrentData(data, status)
    const filtered = data.filter(d => (d.zone === zone && d.status === status))
    return (filtered.length > 0) ? filtered[0].statements.results.bindings : []
}

const getHeadings = (data, zone, status) => {
    data = getCurrentData(data, status)
    const filtered = data.filter(d => (d.zone === zone && d.status === status))
    return (filtered.length > 0) ? filtered[0].statements.head.vars : []
}

const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

const makeId = (textstr) => {
    return textstr.replace(/([/:#_\-.\s])/g, (match, p1) => {
        if (p1) return ''
    }).toLowerCase()
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

const getLegend = (nestedProps, propName, colors, category) => {
    return {
        info: nestedProps.map((p, i) => {
            let label = (p.values && p.values[0].labelprop2) ? p.values[0].labelprop2.value : p.key
            if (Array.isArray(label)) label = label.join(' - ')
            return {
                key: p.key,
                color: colors[i],
                propName,
                label,
                category
            }
        }).sort((a, b) => {
            if (Array.isArray(a.key)) {
                return a.key[0] - b.key[0]
            } else {
                return a.label.localeCompare(b.label)
            }            
        })
    }
}

const getReadablePathsParts = (path, labels) => {
    const parts = path.split('/')
    // if (!labels) return parts.map(part => { return { label: part } })
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

const getTransitionElements = (originElements, targetElements) => {
    // 
    return { origin: originElements, target: targetElements }
}

const getAxis = (nestedProps, propName, category) => {
    /* let additionnalProp = { key: '', values: [], type: 'additionalValue' }
    if (category === 'datetime') {
        switch (nestedProps[0].group) {
        case 'century':
            additionnalProp.key = Number(nestedProps[nestedProps.length - 1].key) + 100
            break
        case 'decade':
            additionnalProp.key = Number(nestedProps[nestedProps.length - 1].key) + 10
            break
        case 'year':
        default:
            additionnalProp.key = Number(nestedProps[nestedProps.length - 1].key) + 1
        }
    } */
    return {
        info: nestedProps.map(p => {
            let range
            if (p.values.length === 0) { // last value for scale only
                range = null
            } else if (category === 'text') {
                range = p.key
            } else if (category === 'datetime') {
                range = p.range
            } else if (category === 'number') {
                range = [d3.min(p.values, d => Number(d.prop1.value)), d3.max(p.values, d => Number(d.prop1.value))]
            } else if (category === 'aggregate') {
                range = [d3.min(p.values, d => Number(d.prop1.value)), d3.max(p.values, d => Number(d.prop1.value))]
            }
            return {
                ...p,
                range,
                propName,
                category
            }
        }),
        category
    }
}

const groupTextData = (data, propName, options) => {
    return d3.nest().key(d => d[propName].value)
        .entries(data).sort((a, b) => { return a.key.localeCompare(b.key) })
        .concat([{ key: '', values: [], type: 'additionalValue' }])
}

const groupTimeData = (data, propName, options) => {
    let { forceGroup, format, max, subgroup } = options
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
        let yearStart = Number(keygroup.key)
        let range
        if (group === 'century') {
            range = [yearStart, yearStart + 99]
        } else if (group === 'decade') {
            range = [yearStart, yearStart + 9]
        } else {
            range = [yearStart, yearStart]
        }
        let groupWithAdd = {
            ...keygroup,
            group,
            range
        }
        if (subgroup) {
            let groups = d3.nest().key(prop => prop[subgroup].value).entries(keygroup.values)
            groupWithAdd.values = groups.map(group => {
                group['count' + subgroup] = 0
                group.parent = keygroup
                group.values.forEach(groupElt => {
                    group['count' + subgroup] += Number(groupElt['count' + subgroup].value)
                })
                return group
            }).sort((a, b) => a.key.localeCompare(b.key))
        } else {
            groupWithAdd.values = keygroup.values
                .map(val => { return { ...val, group } })
                .sort((a, b) => b.prop2.value.localeCompare(a.prop2.value))
        }
        return groupWithAdd
    }), { key: additionalValue, values: [], type: 'additionalValue' }]
}

exports.areLoaded = areLoaded
exports.getAxis = getAxis
exports.getCurrentState = getCurrentState
exports.getHeadings = getHeadings
exports.getLegend = getLegend
exports.getTransitionElements = getTransitionElements
exports.makeId = makeId
exports.getPropList = getPropList
exports.getThresholds = getThresholds
exports.getThresholdsForLegend = getThresholdsForLegend
exports.getResults = getResults
exports.groupTextData = groupTextData
exports.groupTimeData = groupTimeData
exports.guid = guid
