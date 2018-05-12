import express from 'express'
import pathModel from '../models/path'
import { getPropsLabels } from '../src/lib/labelLib'
import queryLib, { ignorePromise } from '../src/lib/queryLib'
// import { error } from 'util';

const router = express.Router()

router.post('/', (req, res) => {
    if (!req.body.entrypoint || !req.body.endpoint || !req.body.totalInstances) {
        console.error('You must provide at least an entrypoint and an endpoint, and the total number of instances')
        res.end()
    } else {
        getStats(req.body)
            .then(props => {
                console.log('API stats', props)
                res.json(props)
                res.end()
            })
            .catch((err) => {
                console.error('Error retrieving stats', err)
            })
    }
})

const getStats = async (opt) => {
    // add default options when not set
    const ignore = opt.ignoreList ? [...opt.ignoreList] : []
    let options = {
        constraints: opt.constraints || '',
        dateList: opt.dateList,
        defaultGraph: opt.defaultGraph || null,
        endpoint: opt.endpoint,
        entrypoint: opt.entrypoint,
        forceUpdate: opt.forceUpdate,
        ignoreList: [...ignore, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
        labels: opt.labels || [],
        maxLevel: opt.maxLevel || 4,
        prefixes: opt.prefixes || {},
        totalInstances: opt.totalInstances
    }
    let { prefixes, endpoint, entrypoint, labels, maxLevel, totalInstances } = options

    let selectionInstances
    let displayedInstances
    // add prefix to entrypoint if full url
    if (!queryLib.usesPrefix(entrypoint, prefixes)) {
        if (!queryLib.prefixDefined(entrypoint)) {
            prefixes = queryLib.addSmallestPrefix(entrypoint, prefixes)
        }
        entrypoint = queryLib.usePrefix(entrypoint, prefixes)
    }
    // number of entities of the set of entrypoint class limited by given constraints
    let selectionQuery = queryLib.makeTotalQuery(entrypoint, options)
    //
    if (options.constraints === '') {
        selectionInstances = totalInstances
    } else {
        let selectioncount = await queryLib.getData(endpoint, selectionQuery, prefixes).catch(e => console.error('Error retrieving number of selected instances', e))
        selectionInstances = Number(selectioncount.results.bindings[0].total.value)
    }
    if (selectionInstances === 0) {
        // if number of entities is null return an empty array
        return { statements: [], options }
    } else {
        // create first prop for entrypoint to feed recursive function
        const entryProp = [{
            fullPath: '<' + queryLib.useFullUri(entrypoint, prefixes) + '>',
            path: entrypoint,
            entrypoint: queryLib.useFullUri(entrypoint, prefixes),
            level: 0,
            category: 'entrypoint',
            type: 'uri',
            total: totalInstances
        }]
        options.maxRequests = getMaxRequest(selectionInstances)
        // check if props available in database
        // if necessary retrieve missing level
        // or recursively retrieve properties
        let paths = await getProps(entryProp, 1, options, { totalInstances, selectionInstances }).catch(e => console.error('Error getting paths and stats', e))

        // last parameter is for first time query, should be changed dynamically
        // get human readable rdfs:labels and rdfs:comments of all properties listed
        let newlabels = (labels.length > 0) ? labels : await getPropsLabels(paths.options.prefixes, paths.statements).catch(e => console.error('Error getting labels', e))
        return {
            statements: paths.statements.sort((a, b) => a.level - b.level),
            totalInstances,
            selectionInstances,
            options: {
                ...paths.options,
                labels: newlabels
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
    let { constraints, entrypoint, endpoint, prefixes, maxLevel } = options
    let { selectionInstances, totalInstances } = instances
    let maxRequests = getMaxRequest(selectionInstances)
    let newCategorizedProps = []
    const queriedProps = categorizedProps.filter(prop => {
        return (prop.level === level - 1 &&
            (prop.category === 'entrypoint' ||
            (prop.type === 'uri')))
    })
    // look for savedProps in the database
    let props = await pathModel.find({ entrypoint: entrypoint, endpoint: endpoint, level: level }).exec()
    if (props.length > 0) {
        // if available
        // generate current prefixes
        newCategorizedProps = props.map(prop => {
            if (!queryLib.prefixDefined(prop.property, prefixes)) {
                prefixes = queryLib.addSmallestPrefix(prop.property, prefixes)
            }
            return {
                ...prop._doc,
                // generate prefixed paths
                path: queryLib.convertPath(prop.fullPath, prefixes)
            }
        })
    } else {
        //let propQueries = queriedProps
        // deal with props by bunches of promises 
        for (let i = 0; i < queriedProps.length; i += maxRequests) {
            let elementsToSlice = (queriedProps.length - i < maxRequests) ? queriedProps.length - i : maxRequests
            console.log('**** on boucle', level, i, maxRequests, elementsToSlice)
            let propsLists = await Promise.all(queriedProps
                .slice(i, i + elementsToSlice)
                .map(prop => {
                    let propsQuery = queryLib.makePropsQuery(prop.path, options, level)
                     console.log(propsQuery)
                    return queryLib.getData(endpoint, propsQuery, prefixes)
                })
                .map(ignorePromise))
            // keep only promises that have been fulfilled
            propsLists = propsLists
                .map((props, index) => {
                    // console.log(props.results.bindings)
                    return (props && props.results.bindings.length > 0) ? props.results.bindings.map(prop => {
                    // generate prefixes if needed
                        if (!queryLib.prefixDefined(prop.property.value, prefixes)) {
                            prefixes = queryLib.addSmallestPrefix(prop.property.value, prefixes)
                        }
                        return queryLib.makePath(prop, queriedProps[index], level, { prefixes, endpoint }) 
                    }) : false
                })
                .filter(props => props !== false)
                .reduce((flatArray, list) => flatArray.concat(list), [])
                
            newCategorizedProps.push(...propsLists)
        }
        // save in mongo database
        //if (newCategorizedProps.length > 0) await pathModel.createOrUpdate(newCategorizedProps).catch(e => console.error('Error updating paths', e))
    }
    //
    let propsWithStats = []
    if (props.length === 0 || constraints !== '') {
        let typeStats = []
        let countStats = []
        for (let i = 0; i < newCategorizedProps.length; i += maxRequests) {
            let elementsToSlice = (newCategorizedProps.length - i < maxRequests) ? newCategorizedProps.length - i : maxRequests
            let temp = await Promise.all(newCategorizedProps
                .slice(i, i + elementsToSlice)
                .map(prop => {
                    let propQuery = queryLib.makePropQuery(prop, options, 'count')
                    // console.log('count ', propQuery)
                    return queryLib.getData(options.endpoint, propQuery, options.prefixes)
                })
                .map(ignorePromise))
            countStats.push(...temp)
            if (props.length === 0) {
                temp = await Promise.all(newCategorizedProps
                    .slice(i, i + elementsToSlice)
                    .map(prop => {
                        let propQuery = queryLib.makePropQuery(prop, options, 'type')
                        // console.log('type ', propQuery)
                        return (props.length === 0) ? queryLib.getData(options.endpoint, propQuery, options.prefixes)
                            : false
                    })
                    .map(ignorePromise))
                typeStats.push(...temp)
            }
        }
        propsWithStats = queryLib.mergeStatsWithProps(newCategorizedProps, countStats, typeStats, totalInstances)
        // console.log('|||||| stop tout bon')
        propsWithStats = propsWithStats.map(prop => {
            // the place to create or fetch a prefix if it does not exist, needed to make the path in defineGroup
            return queryLib.defineGroup(prop, options)
        })
        let propsWithSample = []
        for (let i = 0; i < propsWithStats.length; i += maxRequests) {            
            let elementsToSlice = (propsWithStats.length - i < maxRequests) ? propsWithStats.length - i : maxRequests
            let temp = await Promise.all(propsWithStats
                .slice(i, i + elementsToSlice)
                .map(async prop => {
                    if (prop.category === 'datetime') {
                        let sampleQuery = queryLib.makePropQuery(prop, options, 'dateformat')
                       // console.log('dateformat', sampleQuery)
                        return queryLib.getData(options.endpoint, sampleQuery, options.prefixes)
                            .then(sampleData => {
                                // console.log(sampleData )
                                // console.log(']]', sampleData.results.bindings)
                                if (sampleData && sampleData.results.bindings.length > 0) {
                                    let countInvalid = 0
                                    sampleData.results.bindings.forEach(element => {
                                        let thedate = new Date(element.object.value)
                                        if (thedate == 'Invalid Date') countInvalid++
                                        // console.log(thedate == 'Invalid Date', element.object.value, thedate.getFullYear())
                                    })
                                    let category = (countInvalid > 5) ? 'text' : prop.category
                                    return {
                                        ...prop,
                                        category
                                    }
                                } else {
                                    return prop
                                }
                            })
                    } else {
                        return prop
                    }
                })
                .map(ignorePromise))
            propsWithSample.push(...temp)
        }
        propsWithStats = propsWithSample
            .filter(prop => (prop && prop.category !== 'ignore'))

        
        // save all stats, only if they are relative to the whole ensemble
        if (options.constraints === '') await pathModel.createOrUpdate(propsWithStats).catch(e => console.error('Error updating stats', e))
    } else {
        propsWithStats = newCategorizedProps
    }
    // 
    let returnProps = [
        ...categorizedProps,
        ...propsWithStats
    ]
    if (level < maxLevel && propsWithStats.length > 0) {
        return getProps(returnProps, level + 1, options, instances)
    } else {
        // discard uris when there are more specific paths
        returnProps = returnProps.filter(prop => {
            return (returnProps.filter(specificProp => specificProp.path.indexOf(prop.path) === 0 &&
                specificProp.level > prop.level).length === 0) &&
                prop.total > 0 &&
                ((prop.category === 'number') ||
                (prop.category === 'datetime') ||
                (prop.category === 'text') ||
                (prop.category === 'geo') ||
                (prop.type === 'uri' && prop.level === maxLevel - 1))
        })
        return { statements: returnProps, options }
    }
}

export default router
