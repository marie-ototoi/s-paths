import * as d3 from 'd3'
import shallowEqual from 'shallowequal'

export const areLoaded = (data, zone, status) => {
    data = getCurrentData(data, status)
    const filtered = data.filter(d => (d.zone === zone && d.status === status))
    return filtered.length > 0 &&
        filtered[0].statements.results !== undefined &&
        filtered[0].statements.results.bindings.length > 0
}

export const getCurrentState = (data, zone) => {
    const filtered = data.present.filter(d => (d.zone === zone))
    if (filtered[0].statements.length === 0) {
        return 'loading'
    } else {
        return filtered[0].status
    }
}

export const getDict = (arrayWithKeys) => {
    let dico = {}
    arrayWithKeys.forEach((entry, index) => {
        dico[entry.key] = index
    })
    return dico
}

export const getThresholdsForLegend = (nestedProps, propName, category, nbOfRanges) => {
    const values = nestedProps.reduce((acc, curr) => {
        curr.values.forEach(val => {
            if (Number.isInteger(val['count' + propName])) {
                acc.push(val['count' + propName])
            } else if (val['count' + propName] && val['count' + propName].value) {
                acc.push(Number(val['count' + propName].value))
            }
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

export const getThresholds = (minValue, maxValue, nbOfRanges) => {
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
export const getDateRange = (key, group) => {
    key = Number(key)
    if (group === 'century') {
        return [key, key + 99]
    } else if (group === 'decade') {
        return [key, key + 9]
    } else {
        return [key, key]
    }
}

export const getNumberOfUnits = (nestedData, category) => {
    if (category === 'datetime') {
        let dif = Number(nestedData[nestedData.length - 1].key) - Number(nestedData[0].key)
        if (nestedData[0].group === 'decade') {
            dif = dif / 10
        } else if (nestedData[0].group === 'century') {
            dif = dif / 100
        }
        return dif
    } else {
        return nestedData.length - 1
    }
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

export const getResults = (data, zone, status) => {
    data = getCurrentData(data, status)
    data = data.filter(d => d.zone === zone)
    let statementsType
    if (status === 'delta') {
        status = 'transition'
        statementsType = 'deltaStatements'
    } else {
        statementsType = 'statements'
    }
    // console.log(data, status, statementsType)
    const filtered = data.filter(d => (d.status === status))
    return (filtered.length > 0 && filtered[0][statementsType].results) ? filtered[0][statementsType].results.bindings : []
}

export const getHeadings = (data, zone, status) => {
    data = getCurrentData(data, status)
    const filtered = data.filter(d => (d.zone === zone && d.status === status))
    return (filtered.length > 0 && filtered[0].statements.head) ? filtered[0].statements.head.vars : []
}

export const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const makeId = (textstr) => {
    return textstr.replace(/([/:#_\-.\s])/g, (match, p1) => {
        if (p1) return ''
    }).toLowerCase()
}

export const getLegend = (nestedProps, propName, colors, category) => {
    return {
        info: nestedProps.map((p, i) => {
            let label = (p.values && p.values.length > 0 && p.values[0].labelprop2) ? p.values[0].labelprop2.value : p.key
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

export const getReadablePathsParts = (path, labels) => {
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

export const splitRectangle = (zone, parts) => {
    parts = {
        name: 'main',
        children: parts
    }
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

export const getDeltaIndex = (dataPiece, elements, options) => {
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
                        const cast = (dataPiece[propName].datatype === 'http://www.w3.org/2001/XMLSchema#date') ? Number(dataPiece[propName].value.substr(0, 4)) : Number(dataPiece[propName].value)
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
                let size
                if (cur.countprop1 && cur.countprop2) {
                    size = d3.max([Number(cur.countprop1.value), Number(cur.countprop2.value)])
                } else if (cur.countprop1) {
                    size = Number(cur.countprop1.value)
                } else {
                    size = 1
                }
                // else creates the entry
                if (!exists) {
                    acc.push({
                        shape: element.shape,
                        color: element.color,
                        indexOrigin: cur.indexOrigin,
                        indexTarget: cur.indexTarget,
                        signature: `${zone}_origin${cur.indexOrigin}_target${cur.indexTarget}`,
                        size
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

export const deduplicate = (data, props) => {
    /* return data.reduce((acc, cur) => {
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
    }, []) */
    return data.reduce((acc, cur) => {
        let alreadyInIndex = null
        acc.forEach((dt, index) => {
            let conditions = props.map(prop => {
                // console.log(prop, cur[prop], dt[prop])
                return cur[prop].value === dt[prop].value
            })
            if (!conditions.includes(false)) alreadyInIndex = index
        })
        if (alreadyInIndex === null) {
            acc.push(cur)
        } else {
            for (let prop in acc[alreadyInIndex]) {
                let newprop = cur[prop]
                let oldprop = acc[alreadyInIndex][prop]
                if (!props.includes(prop) && !shallowEqual(newprop, oldprop)) {
                    let oldelements = Array.isArray(oldprop) ? oldprop : [oldprop]
                    let newelements = Array.isArray(newprop) ? newprop : [newprop]
                    oldprop = oldelements.concat(newelements)
                }
            }
        }
        return acc
    }, [])
}

export const getTransitionElements = (originElements, targetElements, originConfig, targetConfig, deltaData, zone) => {
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

export const getAxis = (nestedProps, propName, category) => {
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

export const nestData = (data, props) => {
    // first level
    let dataToNest = nestDataLevel(data, props)
    // second level
    if (props.length > 1) {
        dataToNest = dataToNest.map(group => {
            return {
                ...group,
                values: (group.values.length > 0) ? nestDataLevel(group.values, props, group) : []
            }
        })
    }
    return dataToNest
}

const sortData = (data, sortOn, sortOrder) => {
    return data.sort((a, b) => {
        let first = (sortOrder === 'DESC') ? a[sortOn] : b[sortOn]
        let last = (sortOrder === 'DESC') ? b[sortOn] : a[sortOn]
        if (first.value) first = first.value
        if (last.value) last = last.value
        if (!isNaN(Number(first)) && !isNaN(Number(last))) {
            return Number(last) - Number(first)
        } else {
            return last.localeCompare(first)
        }
    })
}

const nestDataLevel = (data, props, parent) => {
    let index = parent ? 1 : 0
    let { forceGroup, category, max, propName, sortKey, sortKeyOrder, sortValues, sortValuesOrder } = props[index]
    // console.log(data, propName, max)
    let nestedData
    let additionalValue
    let group
    if (category === 'datetime') {
        let dataToNest = data.map(d => {
            let dateProp = new Date(d[propName].value)
            if (dateProp == 'Invalid Date') return false
            return {
                ...d,
                dateProp,
                year: dateProp.getFullYear(),
                decade: Math.floor((dateProp.getFullYear()) / 10) * 10,
                century: Math.floor((dateProp.getFullYear()) / 100) * 100
            }
        })
            .filter(prop => prop !== false)
            .sort((a, b) => a.year - b.year)

        let yearNest = d3.nest().key(prop => prop.year).entries(dataToNest)
        let yearNumber = Number(yearNest[yearNest.length - 1].key) - Number(yearNest[0].key)
        let decadeNest = d3.nest().key(prop => prop.decade).entries(dataToNest)
        let decadeNumber = (Number(decadeNest[decadeNest.length - 1].key) - Number(decadeNest[0].key)) / 10
        let centuryNest = d3.nest().key(prop => prop.century).entries(dataToNest)
        let nest
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
        nestedData = nest.map(keygroup => {
            let yearStart = Number(keygroup.key)
            let range = getDateRange(yearStart, group)
            // console.log(yearStart, range)
            return {
                ...keygroup,
                group,
                range
            }
        })
    } else if (category === 'text') {
        nestedData = d3.nest().key(d => d[propName].value)
            .entries(data).sort((a, b) => { return a.key.localeCompare(b.key) })
        additionalValue = ''
    }
    if (!parent) {
        nestedData.push({ key: additionalValue, values: [], type: 'additionalValue' })
    } else {
        nestedData = nestedData.map(elt => {
            elt['count' + propName] = 0
            elt.parent = parent.key
            elt.range = parent.range
            elt.values = elt.values.map(groupElt => {
                groupElt.key = groupElt[propName].value
                groupElt.parent = { key: elt.key }
                if (groupElt['count' + propName]) {
                    elt['count' + propName] += Number(groupElt['count' + propName].value)
                } else {
                    elt['count' + propName] += 1
                }
                return groupElt
            })
            return elt
        })
    }
    if (sortKey) {
        nestedData = sortData(nestedData, sortKey, sortKeyOrder)
    }
    if (sortValues) {
        nestedData = nestedData.map(group => {
            return {
                ...group,
                values: sortData(group.values, sortValues, sortValuesOrder)
                    .map(dt => { return { ...dt } })
            }
        })
    }
    return nestedData
}
