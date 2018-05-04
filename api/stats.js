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
        let paths = await getPropsLevel(entryProp, 1, options, { totalInstances, selectionInstances }).catch(e => console.error('Error getting paths and stats', e))

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
    } else if (parentQuantities < 5000) {
        maxRequests = 2
    } else {
        maxRequests = 1
    }
    return maxRequests
}

const getPropsLevel = async (categorizedProps, level, options, instances) => {
    let { constraints, entrypoint, endpoint, prefixes, maxLevel } = options
    let { selectionInstances, totalInstances } = instances
    let maxRequests = getMaxRequest(selectionInstances)
    
    let newCategorizedProps = []
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
        // no props saved start from entr
        const queriedProps = categorizedProps.filter(prop => {
            return (prop.level === level - 1 &&
                (prop.category === 'entrypoint' ||
                (prop.type === 'uri')))
        })
        const checkExistingProps = categorizedProps.map(p => p.property)
        let propQueries = queriedProps.map(prop => {
            let propsQuery = queryLib.makePropsQuery(prop.path, options, level)
            // console.log('////////', prop.path, level, propsQuery)
            return queryLib.getData(endpoint, propsQuery, prefixes)
        })
        // let propsLists = await Promise.all(propQueries.map(ignorePromise))
        // deal with props by bunches of promises 
        for (let i = 0; i < propQueries.length; i += maxRequests) {
            let elementsToSlice = (propQueries.length - i < maxRequests) ? propQueries.length - i : maxRequests
            let propsLists = await Promise.all(propQueries.slice(i, elementsToSlice).map(ignorePromise))
            
            // keep only promises that have been fulfilled
            propsLists = propsLists
                .map((props, index) => (props) ? props.results.bindings.map(prop => { return { ...prop, index } }) : false)
                .filter(props => props !== false)
                .reduce((flatArray, list) => flatArray.concat(list), [])
                .map(prop => {
                    // generate prefixes if needed
                    if (!queryLib.prefixDefined(prop.property.value, prefixes)) {
                        prefixes = queryLib.addSmallestPrefix(prop.property.value, prefixes)
                    }
                    // the place to create or fetch a prefix if it does not exist, needed to make the path in defineGroup
                    return queryLib.defineGroup(prop, queriedProps[prop.index], level, options)
                })
                .filter(prop => (prop.category !== 'ignore') && !checkExistingProps.includes(prop.property))
            // push to the list
            newCategorizedProps.push(...propsLists)
        }
        // save in mongo database
        if (newCategorizedProps.length > 0) await pathModel.createOrUpdate(newCategorizedProps).catch(e => console.error('Error updating paths', e))
    }
    //
    let propsWithStats = []
    if (props.length === 0 || constraints !== '') {
        let statsQueries = newCategorizedProps.map(prop => {
            let propQuery = queryLib.makePropQuery(prop, options, (props.length === 0))
            return queryLib.getData(options.endpoint, propQuery, options.prefixes)
        })
        let stats = []
        for (let i = 0; i < statsQueries.length; i += maxRequests) {
            let elementsToSlice = (statsQueries.length - i < maxRequests) ? statsQueries.length - i : maxRequests
            let statsList = await Promise.all(statsQueries.slice(i, elementsToSlice).map(ignorePromise))
            stats.push(...statsList)
        }
        propsWithStats = queryLib.mergeStatsWithProps(newCategorizedProps, stats, totalInstances)
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
        return getPropsLevel(returnProps, level + 1, options, instances)
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
