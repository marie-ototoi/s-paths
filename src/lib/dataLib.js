import * as d3 from 'd3'
import { nest } from 'd3'
import moment from 'moment'
import shallowEqual from 'shallowequal'

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
            if (Number.isInteger(val['count' + propName])) acc.push(val['count' + propName])
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
    let diff = maxValue - minValue
    let part = Math.ceil(diff / nbOfRanges)
    // console.log()
    // console.log('minValue', minValue, 'maxValue', maxValue, 'diff', diff, 'part', part, 'roundStart', roundStart, 'diff', diff)
    const roundUnit = Math.ceil(Number('1e' + (String(part).length - 2)))
    let roundPart = Math.ceil(part / roundUnit)
    let roundPartStr = String(roundPart)
    if (Number(roundPartStr.substr(roundPartStr.length - 1, 1)) <= 5) {
        roundPart = Number(roundPartStr.substr(0, roundPartStr.length - 1) + '5')
    } else {
        roundPart = Number(roundPartStr.substr(0, roundPartStr.length - 1) + '0') + 10
    }
    roundPart *= roundUnit
    let roundStart
    let index = nbOfRanges
    do {
        roundStart = roundPart * index
        index--
    }
    while (roundStart > minValue)
    // console.log('roundPart', roundPart, 'roundUnit', roundUnit)
    let ranges = Array.from(Array(nbOfRanges).keys())
    // return [diff, part, roundUnit, roundStart, start, roundPartStr, roundPart]
    return ranges.map((r) => [roundStart + r * roundPart + 1, (roundStart + (r + 1) * roundPart)]).filter(v => v[0] <= maxValue)
}

// const groupAggregateData
const getDateRange = (key, group) => {
    key = Number(key)
    if (group === 'century') {
        return [key, key + 99]
    } else if (group === 'decade') {
        return [key, key + 9]
    } else {
        return [key, key]
    }
}

const getNumberOfTimeUnits = (nestedData) => {
    let dif = Number(nestedData[nestedData.length - 1].key) - Number(nestedData[0].key)
    if (nestedData[0].group === 'decade') {
        dif = dif / 10
    } else if (nestedData[0].group === 'century') {
        dif = dif / 100
    }
    return dif
}

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
    data = data.filter(d => d.zone === zone)
    let statementsType
    if (status === 'coverage') {
        status = data[0].status
        statementsType = 'coverageStatements'
    } else if (status === 'delta') {
        status = 'transition'
        statementsType = 'deltaStatements'
    } else {
        statementsType = 'statements'
    }
    // console.log(data, status, statementsType)
    const filtered = data.filter(d => (d.status === status))
    return (filtered.length > 0 && filtered[0][statementsType].results) ? filtered[0][statementsType].results.bindings : []
}

const getHeadings = (data, zone, status) => {
    data = getCurrentData(data, status)
    const filtered = data.filter(d => (d.zone === zone && d.status === status))
    return (filtered.length > 0 && filtered[0].statements.head) ? filtered[0].statements.head.vars : []
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
                label: (prop[0] && prop[0].label) ? prop[0].label : part,
                comment: (prop[0] && prop[0].comment) ? prop[0].comment : undefined
            }
        })
}

const splitRectangle = (zone, parts) => {
    parts = {
        name: 'main',
        children: parts
    }
    //if (!zone.x0 && zone.x1) zone.x0 = zone.x1
    //if (!zone.y0 && zone.y1) zone.y0 = zone.y1
    let hierarchy = d3.hierarchy(parts)
    let treemap = d3.treemap()
        .size([zone.width, zone.height])
        .round(true)
        .paddingInner(1)
    let tree = treemap(hierarchy.sum(d => d.size))
    return tree.children.map(part => {
        return {
            ...part.data,
            zone: {
                x1: zone.x1 + part.x0,
                y1: zone.y1 + part.y0,
                x2: zone.x1 + part.x1,
                y2: zone.y1 + part.y1,
                width: part.x1 - part.x0,
                height: part.y1 - part.y0
            }
        }
    })
}

const getDeltaIndex = (dataPiece, elements, options) => {
    let { entrypoint, isTarget } = options
    let indexElement
    elements.forEach((el, indexEl) => {
        if (entrypoint) {
            if (el.query.value === dataPiece.entrypoint.value) indexElement = indexEl
        } else {
            // console.log(el)
            let conditions = el.query.value.map((condition, index) => {
                const propIndex = index + 1
                const propName = `${isTarget ? 'new' : ''}prop${propIndex}`
                // console.log('||||||||||||', dataPiece[propName], condition.category)
                if (dataPiece[propName]) {
                    if (condition.category === 'datetime') {
                        const cast = (dataPiece[propName].datatype === 'http://www.w3.org/2001/XMLSchema#date') ? Number(dataPiece[propName].value.substr(0,4)) : Number(dataPiece[propName].value)
                        return cast >= condition.value[0] && cast <= condition.value[1]
                    } else if (condition.category === 'number') {
                        if (Array.isArray(condition.value)) {
                            return Number(dataPiece[propName].value) >= condition.value[0] && Number(dataPiece[propName].value) <= condition.value[1]
                        } else {
                            return Number(dataPiece[propName].value) === condition.value
                        }
                    } else {
                        // text or uri
                        return dataPiece[propName].value === condition.value
                    }
                // to add : geographical info
                } else {
                    return false
                }
            })
            // if all conditions were true
            if (conditions.filter(c => c === false).length === 0) indexElement = indexEl
        }
    })
    return indexElement
}

const splitTransitionElements = (elements, type, zone, deltaData) => {
    let typeA = (type === 'origin') ? 'Origin' : 'Target'
    let typeB = (type === 'origin') ? 'Target' : 'Origin'
    return elements.reduce((accElements, element, indexElement) => {
        let allDelta = deltaData.filter(dp => dp['index' + typeA] === indexElement)
        if (allDelta.length >= 1) {
            allDelta = allDelta.reduce((acc, cur) => {
                let exists = false
                acc = acc.map((dp) => {
                    // if collaboration already registered for this year add an occurence
                    if (dp['index' + typeB] === cur['index' + typeB]) {
                        exists = true
                        dp.size = dp.size + 1
                    }
                    return dp
                })
                // else creates the entry
                if (!exists) {
                    acc.push({
                        shape: element.shape,
                        color: element.color,
                        indexOrigin: cur.indexOrigin,
                        indexTarget: cur.indexTarget,
                        signature: `${zone}_origin${cur.indexOrigin}_target${cur.indexTarget}`,
                        size: (cur.countprop1 || cur.countprop2) ? d3.max([Number(cur.countprop1.value), Number(cur.countprop2.value)]) : 1 
                    })
                }
                return acc
            }, [])
            allDelta = splitRectangle(element.zone, allDelta)
            accElements = accElements.concat(allDelta)
        }
        return accElements
    }, [])
}

const deduplicate = (data, props) => {
    return data.reduce((acc, cur) => {
        let alreadyIn = acc.filter(dt => {
            let conditions = props.map(prop => {
                return cur[prop].value === dt[prop].value
            })
            return !conditions.includes(false)
        })
        if (alreadyIn.length === 0) {
            acc.push(cur)
        }
        return acc
    }, [])
}

const getTransitionElements = (originElements, targetElements, originConfig, targetConfig, deltaData, zone) => {
    // console.log('before', zone, originElements, targetElements, originConfig, targetConfig, deltaData)
    deltaData = deltaData.map(data => {
        let indexOrigin = getDeltaIndex(data, originElements, { entrypoint: originConfig.entrypoint, isTarget: false })
        let indexTarget = getDeltaIndex(data, targetElements, { entrypoint: targetConfig.entrypoint, isTarget: true })
        return {
            indexOrigin,
            indexTarget,
            ...data
        }
    })
    // console.log(deltaData)
    if (!originConfig.entrypoint) {
        originElements = splitTransitionElements(originElements, 'origin', zone, deltaData)
    } else {
        originElements = originElements.map(el => {
            let cur = deltaData.filter(dp => dp.entrypoint.value === el.query.value)[0]
            return {
                ...el,
                signature: cur ? `${zone}_origin${cur.indexOrigin}_target${cur.indexTarget}` : ''
            }
        })
    }
    if (!targetConfig.entrypoint) {
        targetElements = splitTransitionElements(targetElements, 'target', zone, deltaData)
    } else {
        targetElements = targetElements.map(el => {
            let cur = deltaData.filter(dp => dp.entrypoint.value === el.query.value)[0]
            return {
                ...el,
                signature: cur ? `${zone}_origin${cur.indexOrigin}_target${cur.indexTarget}` : ''
            }
        })
    }
    // console.log('after', originElements, targetElements)
    // pour chaque zone d'arrivée identifier tous les points de départ
    // diviser la zone d'arrivée et la remplacer par le nombre de zones nécessaires 
    // en donnant le nom de la zone de départ 
    return { origin: originElements, target: targetElements }
}

const getAxis = (nestedProps, propName, category) => {
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
    // let centuryNumber = (Number(centuryNest[centuryNest.length - 1].key) - Number(centuryNest[0].key)) / 100
    // console.log(yearNest.length, yearNumber, decadeNest.length, decadeNumber, centuryNest.length, centuryNumber)
    let nest
    let additionalValue
    if (forceGroup === 'year' || (!forceGroup && yearNumber < max)) {
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
        let range = getDateRange(yearStart, group)
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
                    if (groupElt['count' + subgroup]) {
                        group['count' + subgroup] += Number(groupElt['count' + subgroup].value)
                    } else {
                        group['count' + subgroup] += 1
                    }
                })
                return group
            }).sort((a, b) => a.key.localeCompare(b.key))
        } else {
            groupWithAdd.values = keygroup.values
                .map(val => { return { ...val, group } })
                .sort((a, b) => b.prop2 ? b.prop2.value.localeCompare(a.prop2.value) : 0)
        }
        return groupWithAdd
    }), { key: additionalValue, values: [], type: 'additionalValue' }]
}

exports.areLoaded = areLoaded
exports.deduplicate = deduplicate
exports.getAxis = getAxis
exports.getCurrentState = getCurrentState
exports.getDateRange = getDateRange
exports.getDeltaIndex = getDeltaIndex
exports.getHeadings = getHeadings
exports.getLegend = getLegend
exports.getNumberOfTimeUnits = getNumberOfTimeUnits
exports.getReadablePathsParts = getReadablePathsParts
exports.getTransitionElements = getTransitionElements
exports.makeId = makeId
exports.getThresholds = getThresholds
exports.getThresholdsForLegend = getThresholdsForLegend
exports.getResults = getResults
exports.groupTextData = groupTextData
exports.groupTimeData = groupTimeData
exports.splitRectangle = splitRectangle
exports.guid = guid
