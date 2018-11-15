import express from 'express'
import pathModel from '../models/path'

import { getReadablePathsParts } from '../src/lib/dataLib'
import { getPropsLabels } from '../src/lib/labelLib'
import * as queryLib from '../src/lib/queryLib'

const router = express.Router()

router.post('/', (req, res) => {
    // req.setTimeout(600000)
    if (!req.body.entrypoint || !req.body.endpoint || !req.body.totalInstances) {
        console.error('You must provide at least an entrypoint and an endpoint, and the total number of instances')
        res.end()
    } else {
        getAllStats(req.body)
            .then(props => {
                res.json(props)
                res.end()
            })
            .catch((err) => {
                console.error('Error retrieving stats', err)
            })
    }
})

const getAllStats = async (options) => {
    // console.log('oy', options)
    let { analyse, prefixcc, prefixes, endpoint, graphs, localEndpoint, entrypoint, labels, totalInstances } = options
    let selectionInstances
    
    // add prefix to entrypoint if full url
    // console.log(entrypoint, queryLib.usesPrefix(entrypoint, prefixes))
    if (!queryLib.prefixDefined(entrypoint, prefixes)) {
        prefixes = await queryLib.addPrefix(entrypoint, prefixes, prefixcc)
    }
  
    if (analyse) {
        await pathModel.deleteMany({ endpoint, graphs: { $all: graphs }, entrypoint }).exec()
    }
    // number of entities of the set of entrypoint class limited by given constraints
    let selectionQuery = queryLib.makeTotalQuery(entrypoint, options)
    //
    if (options.constraints === '') {
        selectionInstances = totalInstances
    } else {
        let selectioncount = await queryLib.getData(localEndpoint, selectionQuery, prefixes).catch(e => console.error('Error retrieving number of selected instances', selectionQuery, e))
        selectionInstances = Number(selectioncount.results.bindings[0].total.value)
    }
    if (selectionInstances === 0) {
        // if number of entities is null return an empty array
        return { statements: [], options }
    } else {
        // create first prop for entrypoint to feed recursive function
        const entryProp = [{
            fullPath: '<' + entrypoint + '>',
            path: queryLib.usePrefix(entrypoint, prefixes),
            entrypoint,
            level: 0,
            endpoint,
            graphs,
            category: 'entrypoint',
            type: 'uri',
            total: totalInstances
        }]
        // check if props available in database
        // if necessary retrieve missing level
        // or recursively retrieve properties
        let paths = await getProps(entryProp, 1, options, { totalInstances, selectionInstances })

        return {
            statements: paths.statements
                .sort((a, b) => a.level - b.level),//.map(stat => { return { ...stat, readablePath: getReadablePathsParts(stat.path, labelsDic, paths.options.prefixes ) } })                
            totalInstances,
            selectionInstances,
            options: {
                ...paths.options/*,
                labels: allLabels,
                labelsDic*/
            }
        }
    }
}

const getMaxRequest = (parentQuantities) => {
    // to do : adjust depending on the machine and perf etc
    // later optimization : + the cost of the query
    let maxRequests
    if (parentQuantities < 100) {
        maxRequests = 6
    } else if (parentQuantities < 500) {
        maxRequests = 5
    } else if (parentQuantities < 1000) {
        maxRequests = 4
    } else if (parentQuantities < 2000) {
        maxRequests = 3
    } else if (parentQuantities < 3000) {
        maxRequests = 2
    } else {
        maxRequests = 1
    }
    return maxRequests
}

const getProps = async (categorizedProps, level, options, instances) => {
    let { analyse, constraints, graphs, entrypoint, endpoint, localEndpoint, prefixcc, prefixes, maxLevel, labels } = options
    let { totalInstances, selectionInstances } = instances
    let maxRequests = getMaxRequest(totalInstances)
    let newCategorizedProps = []
    
    // look for savedProps in the database
    let props = await pathModel.find({ entrypoint: entrypoint, endpoint: endpoint, level: level, graphs: { $all: graphs } }).exec()
    if (props.length > 0) {        
        // if available
        // generate current prefixes
        
        for (let i = 0; i < props.length; i ++) {
            let prop = props[i]
            newCategorizedProps.push({
                ...prop._doc
            })
        }
        // keep only those whose parents count > 0
    } else if (analyse) {

        const queriedProps = categorizedProps.filter(prop => {
            // console.log(prop.path, prop.level, prop.category, prop.total, prop.type)
            return (prop.level === level - 1 &&
                (prop.category === 'entrypoint' ||
                prop.category === 'uri') &&
                (!prop.total || (prop.total && prop.total > 0)))
        })
        // console.log('TOTAL queriedProps', queriedProps.length, queriedProps)
        // deal with props by bunches of promises
        for (let i = 0; i < queriedProps.length; i += maxRequests) {
            let elementsToSlice = (queriedProps.length - i < maxRequests) ? queriedProps.length - i : maxRequests
            let propsLists = await Promise.all(queriedProps
                .slice(i, i + elementsToSlice)
                .map(prop => {
                    let propsQuery = queryLib.makePropsQuery(prop.path, options, level, prefixes)
                    console.log(prop.path, propsQuery)
                    return queryLib.getData(localEndpoint, propsQuery, prefixes)
                })
                .map((promise, index) => promise.catch(e => {
                    console.error('Error with makePropsQuery', e, queryLib.makePropsQuery(queriedProps[i + index].path, options, level, prefixes))
                    return undefined
                }))
            )
            let results = []
            for (let j = 0; j < propsLists.length; j ++) {
                
                let props = propsLists[j]
                if (props && props.results && props.results.bindings.length > 0) {
                    for (let k = 0; k < props.results.bindings.length; k ++) {
                        let prop = props.results.bindings[k]
                        // generate prefixes if needed
                        if (!queryLib.prefixDefined(prop.property.value, prefixes)) {
                            prefixes = await queryLib.addPrefix(prop.property.value, prefixes, prefixcc)
                        }
                        results.push(queryLib.makePath(prop, queriedProps[j + i], level, { prefixes, endpoint }))
                    }   
                }
            }
            
            newCategorizedProps.push(...results)
        }
    }
    //
    let propsWithStats = []
    let temp
    if (props.length === 0) {
        let typeStats = []
        let countStats = []
        for (let i = 0; i < newCategorizedProps.length; i += maxRequests) {
            let elementsToSlice = (newCategorizedProps.length - i < maxRequests) ? newCategorizedProps.length - i : maxRequests
            temp = await Promise.all(newCategorizedProps
                .slice(i, i + elementsToSlice)
                .map(prop => {
                    // console.log(prop.path)
                    let propQuery = queryLib.makePropQuery(prop, { ...options, prefixes }, 'count')
                    console.log(propQuery)
                    return queryLib.getData(localEndpoint, propQuery, prefixes)
                })
                .map((promise, i) => promise.catch(e => {
                    console.error('Error with makePropQuery count', e, queryLib.makePropQuery(newCategorizedProps[i], { ...options, prefixes }, 'count'))
                    return undefined
                })))
            countStats.push(...temp)
            if (props.length === 0 && selectionInstances > 1) {
                temp = await Promise.all(newCategorizedProps
                    .slice(i, i + elementsToSlice)
                    .map(prop => {
                        let propQuery = queryLib.makePropQuery(prop, { ...options, prefixes }, 'type')
                        console.log('type ', propQuery)
                        return queryLib.getData(localEndpoint, propQuery, prefixes)
                    })
                    .map((promise, i) => promise.catch(e => {
                        console.error('Error with makePropQuery type', e, queryLib.makePropQuery(newCategorizedProps[i], { ...options, prefixes }, 'type'))
                        return undefined
                    })))
                typeStats.push(...temp)
            }
        }
        if (newCategorizedProps.length > 0 ) {
            propsWithStats = queryLib.mergeStatsWithProps(newCategorizedProps, countStats, typeStats, selectionInstances)
            propsWithStats = propsWithStats.map(prop => {
                // the place to create or fetch a prefix if it does not exist, needed to make the path in defineGroup
                return queryLib.defineGroup(prop, options)
            })
            let propsWithSample = []
            temp = await Promise.all(propsWithStats
                .map(prop => {
                    if ((prop.category === 'datetime' || prop.category === 'text') && prop.total > 0) {
                        let sampleQuery = queryLib.makePropQuery(prop, { ...options, prefixes }, 'dateformat')
                        return queryLib.getData(localEndpoint, sampleQuery, prefixes)
                            .then(sampleData => {
                                if (sampleData && sampleData.results.bindings.length > 0) {
                                    let category = prop.category
                                    let subcategory = prop.subcategory
                                    let value = sampleData.results.bindings[0].object.value
                                    if (prop.category === 'datetime') {
                                        let thedate = new Date(value)
                                        if (thedate.toString() === 'Invalid Date') category = 'text'
                                    }
                                    return {
                                        ...prop,
                                        category,
                                        subcategory
                                    }
                                } else {
                                    return prop
                                }
                            })
                            .catch(e => {
                                console.error('Error with makePropQuery sample dateformat', e)
                                return undefined
                            })
                    } else {
                        return prop
                    }
                })
            )
            propsWithSample.push(...temp)
            propsWithStats = propsWithSample
                .filter(prop => (prop && prop.category !== 'ignore'))
                .map(prop => { return { ...prop, endpoint, graphs } })

            for (let i = 0; i < propsWithStats.length; i ++) {
                let prop = propsWithStats[i]
                if (!queryLib.prefixDefined(prop.property, prefixes)) {
                    prefixes = await queryLib.addPrefix(prop.property, prefixes, prefixcc)
                }
            }
            // console.log('LABELS', labels)
            let newlabels = await getPropsLabels(prefixes, propsWithStats)
            // console.log('NEW LABELS', newlabels)
            let labelsDic = {}
            labels = [...labels, ...newlabels]
            labels.forEach(lab => {
                labelsDic[lab.uri] = { label: lab.label, comment: lab.comment }
            })

            propsWithStats = propsWithStats.map (prop => {
                let path = queryLib.convertPath(prop.fullPath, prefixes)
                // console.log(getReadablePathsParts(path, labelsDic, prefixes))
                return {
                    ...prop,
                    path,
                    readablePath: getReadablePathsParts(path, labelsDic, prefixes)
                }
            })
            // console.log('PROPS WITH STATS', propsWithStats)
            // save all stats, only if they are relative to the whole ensemble
            if (constraints === '') await pathModel.createOrUpdate(propsWithStats).catch(e => console.error('Error updating stats', e))
        }
    } else {
        propsWithStats = newCategorizedProps
    }
    
    let returnProps = [
        ...categorizedProps,
        ...propsWithStats
    ]
    // console.log('RETURN PROPS ', level, returnProps, level < maxLevel && newCategorizedProps.length > 0)
    if (level < maxLevel && newCategorizedProps.length > 0) {
        return getProps(returnProps, level + 1, {...options, prefixes, labels}, instances)
    } else {
        // discard uris when there are more specific paths
        return {
            statements: returnProps.filter(prop => (prop.total > 0 && !queryLib.hasMoreSpecificPath(prop.path, prop.level, returnProps))), 
            options: {...options, prefixes, labels}
        }
    }
}

export default router
