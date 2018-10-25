import * as d3 from 'd3'
import shallowEqual from 'shallowequal'
import { convertPath, getSplitUri, usePrefix, useFullUri } from './queryLib'

export const areLoaded = (data, zone, status) => {
    data = getCurrentData(data, zone, status)
    return data.statements !== undefined && data.statements.results !== undefined &&
        data.statements.results.bindings.length > 0
}

export const getCurrentState = (data, zone) => {
    return data.present.status
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
    //console.log(minValue, maxValue)
    let diff = maxValue - minValue
    if (diff === 1) nbOfRanges = 1
    if (diff <= nbOfRanges) nbOfRanges = diff / 2
    let part = Math.ceil(diff / nbOfRanges)
    let ranges = Array.from(Array(nbOfRanges).keys())
    // return [diff, part, roundUnit, roundStart, start, roundPartStr, roundPart]
    return ranges.map((r) => [minValue + part * r, minValue + part * (r + 1) - 1])
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

const getCurrentData = (data, zone, status) => {
    const currentStateMain = getCurrentState(data, 'main')
    let dataMain
    if (zone === 'main') {
        if (currentStateMain === 'transition' && status === 'active') {
            dataMain = data.past[data.past.length - 1]
        } else {
            dataMain = data.present
        }
    } else {
        if (currentStateMain === 'transition' && status === 'active') {
            // console.log('ici ? cas 1', data.past)
            dataMain = data.past.length >= 1 ? data.past[data.past.length - 1] : {}
        } else {
            // console.log('ici ? cas 2', data.past)
            dataMain = data.past.length >= 2 ? data.past[data.past.length - 2] : {}
        }
    }
    return dataMain
}

export const getResults = (data, zone, status) => {

    data = getCurrentData(data, zone, status)
    
    // data = data.filter(d => d.zone === zone)
    let statementsType
    if (status === 'delta') {
        status = 'transition'
        statementsType = 'deltaStatements'
    } else if (status === 'detail') {
        statementsType = 'detailStatements'
        status = 'active'
    } else {
        statementsType = 'statements'
    }
    // console.log(zone, data, statementsType, status)
    // const filtered = data.filter(d => (d.status === status))
    return (data[statementsType] && data[statementsType].results) ? data[statementsType].results.bindings : []
}

export const prepareSingleData = (data, dataset) => {
    // console.log(data)
    let { maxLevel, prefixes } = dataset
    let shortname = usePrefix(data[0].entrypoint.value, prefixes)
    let shortpath
    let tree = [{
        id: 1,
        name: data[0].entrypoint.value,
        charlength: shortname.length,
        shortname,
        parents: []
    }]
    let check = {}
    let counters = { c0: 1 }
    let counter = 2
    let maxDepth = 1
    let leaves = data.reduce((acc, cur, pathindex) => {
        let currentCheck = ''
        for (let i = 1; i <= maxLevel; i ++) {
            // console.log('dd')
            if(cur['prop'+  i]) {
                if (i > maxDepth) maxDepth = i
                // console.log('ok rentre la')
                let path = cur['path'+ i].value
                let name = cur['prop'+ i].value
                currentCheck += path + '' + name
                // console.log('bon')
                if (!check[currentCheck]) {
                    // console.log('id+', counter, 'parent', counters['c' + (i - 1)])
                    check[currentCheck] = true
                    counters['c' + i] = counter
                    let parents = [1]
                    for (let j = 1; j <= i; j ++) {
                        parents.push(counters['c' + j])
                    }
                    shortname = usePrefix(name, prefixes)
                    shortpath = usePrefix(path, prefixes)
                    acc.push({
                        id: counter,
                        name,
                        charlength: shortname.length,
                        shortname,
                        pathcharlength: shortpath.length,
                        path: shortpath,
                        parent: counters['c' + (i - 1)],
                        parents
                    })
                    counter ++
                }
            }
            
        }
        return acc
    }, [])
    leaves = leaves.map(leaf => { return { ...leaf, maxDepth } })
    tree.push(...leaves)
    // console.log(tree)
    return tree
}
export const getNbDisplayed = (data, zone, status) => {
    data = getCurrentData(data, zone, status)
    if (status === 'delta') {
        status = 'transition'
    }
    return (data.status === status && data.displayed) ? data.displayed : 0
}

export const getHeadings = (data, zone, status) => {
    data = getCurrentData(data, zone, status)
    return (data.status === status && data.statements.head) ? data.statements.head.vars : []
}

export const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const makeId = (textstr) => {
    return textstr.replace(/([/:#%_\-.\s])/g, (match, p1) => {
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

export const getReadablePathsParts = (path, labelsDic, prefixes) => {
    const parts = path.split('/')

    // if (!labels) return parts.map(part => { return { label: part } })
    let rp = parts
        .filter((part, index) => index !== 0 && part !== '*')
        .map((part, index) => {
            let prop = labelsDic[useFullUri(part, prefixes)]
            return {
                label: (prop) ? prop.label : part,
                comment: (prop) ? prop.comment : undefined
            }
        })
    return rp
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
            // console.log('ici ?', el.query && dataPiece.entrypoint && el.query.value === dataPiece.entrypoint.value)
            if (el.query && dataPiece.entrypoint && el.query.value === dataPiece.entrypoint.value) indexElement = indexEl
        } else if (el.query.value && Array.isArray(el.query.value)) {
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
    // console.log(indexElement)
    return indexElement
}

const splitTransitionElements = (elements, type, zone, deltaData) => {
    let typeA = (type === 'origin') ? 'Origin' : 'Target'
    let typeB = (type === 'origin') ? 'Target' : 'Origin'
    // console.log(deltaData)
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
                    // c'est ici qu'il faut gérer l'inverse du split
                    // console.log(cur.indexOrigin, cur.indexTarget)
                    acc.push({
                        shape: element.shape,
                        color: element.color,
                        indexOrigin: cur.indexOrigin,
                        indexTarget: cur.indexTarget,
                        signature: `${zone}_origin${cur.indexOrigin}_target${cur.indexTarget}`,
                        size,
                        rotation: element.rotation
                    })
                }
                return acc
            }, [])
            allDelta = splitRectangle(element.zone, allDelta)
            accElements = accElements.concat(allDelta)
        } else {
            accElements.push({ ...element, signature: element.query.value, size: 1 })
        }
        return accElements
    }, [])
}

export const prepareSinglePropData = (data, category, prefixes) => {
    return d3.nest().key(prop => prop.prop1.value).entries(data)
        .map(d => {
            if (category === 'uri') {
                return { value: d.key, name: usePrefix(d.key, prefixes), count: d.values.length }
            } else {
                return { value: d.key, name: d.key, count: d.values.length }
            }
        })
}

export const prepareGeoData = (data, dataset, selections, zone) => {
    let flatSelections = selections.filter(s => s.zone === zone).map(s => s.selector)
    // console.log(flatSelections)
    return data.map((place, index) => {
        let id = makeId(place.entrypoint.value)
        let selector = `geo_element_${id}`
        // console.log(id, flatSelections.includes(selector))
        return {
            type: 'Feature', 
            properties: {
                id,
                title: place.prop3 ? place.prop3.value : place.prop1.value + '/' +  place.prop2.value,
                lat:  Number(place.prop1.value),
                long:  Number(place.prop2.value),
                label: place.prop3.value,
                cat: place.prop4 ? place.prop4.value : undefined,
                entrypoint: place.entrypoint.value,
                selector,
                singleselected: flatSelections.includes(selector) ? 1 : 0,
                index
            },
            geometry: {
                type: "Point",
                coordinates: [Number(place.prop2.value), Number(place.prop1.value), 0] 
            }
        }
    })
}

export const prepareVegaTimelineData = (data, dataset) => {
    return {
        type: 'FeatureCollection',
        features: data.map(place => {
            return {
                type: 'Feature', 
                properties: {
                    id: makeId(place.entrypoint.value),
                    title: place.prop3 ? place.prop3.value : place.prop1.value + '/' +  place.prop2.value
                },
                geometry: {
                    type: "Point",
                    coordinates: [ Number(place.prop1.value), Number(place.prop2.value), 0.0 ] 
                }
            }
        })
    }
}

export const prepareDetailData = (data, dataset) => {
    // console.log('prepare only once', data.length)
    let { entrypoint, prefixes, labels } = dataset
    let newData = []
    newData.push(d3.nest().key(prop => prop.entrypoint.value).entries(data).map(prop => prop.key))
    let maxLevel = Number(data.sort((a, b) => Number(b.level.value) - Number(a.level.value))[0].level.value)
    // console.log(maxLevel)
    for (let i = 1; i <= maxLevel; i++) {
        let filtered = data
            .filter(d => Number(d.level.value) === i)
            .reduce((acc, cur,m)=>{
                let fullPath = `<${entrypoint}>/`
                for(let j = 1; j <= i; j++) {
                    fullPath = fullPath.concat(`<` + cur[`path${j}`].value + `>/*/`)
                }
                let checkPathIndex
                let checkValueIndex
                let someIndex = acc.some((d, index) => {
                    if (d.fullPath === fullPath) checkPathIndex = index
                    return d.fullPath === fullPath
                })
                if (someIndex) {
                    let someValue = acc[checkPathIndex][`prop${i}`].some((v, index) => {
                        if (v.value === cur[`prop${i}`].value) checkValueIndex = index
                        // console.log(v.value, cur[`prop${i}`].value, v.value === cur[`prop${i}`].value)
                        return v.value === cur[`prop${i}`].value
                    })
                    // console.log(checkValueIndex, someIndex, checkValueIndex, someValue)
                    if (someValue) {
                        // console.log()
                        acc[checkPathIndex][`prop${i}`][checkValueIndex].count++
                    } else {
                        acc[checkPathIndex][`prop${i}`].push({ value: cur[`prop${i}`].value, count: 1 })
                    }
                } else {
                    let newItem = cur
                    newItem.path = convertPath(fullPath, prefixes)
                    newItem.readablePath = getReadablePathsParts(newItem.path, labels, prefixes)
                    newItem.fullPath = fullPath
                    newItem[`prop${i}`] = Array.isArray(newItem[`prop${i}`]) ? newItem[`prop${i}`] : [newItem[`prop${i}`]]
                    newItem[`prop${i}`] = newItem[`prop${i}`].map(v => {
                        return { value: v.value, count: 1 }
                    }) 
                    acc.push(newItem)
                }
                return acc
            },[])
            .sort((a, b) => a.path.localeCompare(b.path))
        newData.push(filtered)
    }
    return newData
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
                if (cur[prop] && dt[prop]) {
                    return cur[prop].value === dt[prop].value
                } else {
                    return false
                }
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

export const getTransitionElements = (originElements, targetElements, originConfig, targetSelectedView, deltaData, zone) => {
    // console.log('before', zone, originElements, targetElements, originConfig, targetSelectedView, deltaData)
    deltaData = deltaData.map(data => {
        let indexOrigin = getDeltaIndex(data, originElements, { entrypoint: originConfig.entrypoint, isTarget: false })
        let indexTarget = getDeltaIndex(data, targetElements, { entrypoint: targetSelectedView.entrypoint, isTarget: true })
        return {
            indexOrigin,
            indexTarget,
            ...data
        }
    })
    // console.log(deltaData)
    if (!originElements) {
        originElements = []
    } else if (!originConfig.entrypoint && originElements.length > 0) {
        originElements = splitTransitionElements(originElements, 'origin', zone, deltaData)
    } else {
        originElements = originElements.map(el => {
            let cur = deltaData.filter(dp => dp.entrypoint.value === el.query.value)[0]
            return {
                ...el,
                indexOrigin: cur ? cur.indexOrigin : null,
                indexTarget: cur ? cur.indexTarget : null,
                signature: cur ? `${zone}_origin${cur.indexOrigin}_target${cur.indexTarget}` : el.query.value
            }
        })
    }
    if (!targetElements) {
        targetElements = []
    } else if (!targetSelectedView.entrypoint && targetElements.length > 0) {
        targetElements = splitTransitionElements(targetElements, 'target', zone, deltaData)
    } else {
        targetElements = targetElements.map(el => {
            let cur = deltaData.filter(dp => dp.entrypoint.value === el.query.value)[0]
            return {
                ...el,
                indexOrigin: cur ? cur.indexOrigin : null,
                indexTarget: cur ? cur.indexTarget : null,
                signature: cur ? `${zone}_origin${cur.indexOrigin}_target${cur.indexTarget}` : el.query.value
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
            if (dateProp.toString() === 'Invalid Date') return false
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
    } else if (category === 'text' || category === 'uri') {
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
