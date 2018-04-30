import express from 'express'
import promiseSettle from 'promise-settle'
import promiseLimit from 'promise-limit'
import pathModel from '../models/path'
import { getPropsLabels } from '../src/lib/labelLib'
import queryLib, { ignorePromise } from '../src/lib/queryLib'
// import { error } from 'util';

const router = express.Router()
const limit = promiseLimit(10)

router.post('/', (req, res) => {
    if (!req.body.entrypoint || !req.body.endpoint) {
        // console.error('You must provide at least an entrypoint and an endpoint')
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
        prefixes: opt.prefixes || {}
    }
    let { prefixes, endpoint, entrypoint, labels } = options
    let totalInstances
    let selectionInstances
    let displayedInstances
    // add prefix to entrypoint if full url
    if (!queryLib.usesPrefix(entrypoint, prefixes)) {
        if (!queryLib.prefixDefined(entrypoint)) {
            prefixes = queryLib.addSmallestPrefix(entrypoint, prefixes)
        }
        entrypoint = queryLib.usePrefix(entrypoint, prefixes)
    }
    // number of entities of the set of entrypoint class
    let totalQuery = queryLib.makeTotalQuery(entrypoint, { ...options, constraints: '' })
    // number of entities of the set of entrypoint class limited by given constraints
    let selectionQuery = queryLib.makeTotalQuery(entrypoint, options)
    // console.log(selectionQuery)
    // retrieve number of entities
    let totalcount = await queryLib.getData(endpoint, totalQuery, prefixes)
    totalInstances = Number(totalcount.results.bindings[0].total.value)
    if (options.constraints === '') {
        selectionInstances = totalInstances
    } else {
        let selectioncount = await queryLib.getData(endpoint, selectionQuery, prefixes)
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
            type: 'uri'
        }]
        // check if props available in database
        // if necessary retrieve missing level
        // or recursively retrieve properties
        let paths = await getPropsLevel(entryProp, 1, options)
        // get stats to match the props
        let stats = await getStatsLevel(paths.statements, [], 1, totalInstances, options, true)
        // last parameter is for first time query, should be changed dynamically
        // get human readable rdfs:labels and rdfs:comments of all properties listed
        let newlabels = (labels.length > 0) ? labels : await getPropsLabels(stats.options.prefixes, stats.statements)
        return {
            statements: stats.statements.sort((a, b) => a.level - b.level),
            totalInstances,
            selectionInstances,
            options: {
                ...stats.options,
                labels: newlabels
            }
        }
    }
}

const getStatsLevel = async (props, propsWithStats, level, total, options, firstTimeQuery) => {
    // console.log(props)
    let { maxLevel } = options
    
    const queriedProps = props.filter(prop => {
        // check levels one after another :
        // except for first time exploration, lower levels are sent only if upper levels have not been kept 
        return (prop.level === level)
        // if the beginnig of the path is displayed at a higher level, don't keep (could be discussed)
        /* &&
        (propsWithStats.filter(prevProp => prop.path.indexOf(prevProp.path) === 0 &&
        prop.level === prevProp.level + 1).length === 0) */
    })
    if (queriedProps.length === 0) {
        // end of the recursive loop
        return { statements: propsWithStats, options }
    } else {
        // if the query is about the whole set and stats have already been saved
        // if (options.constraints === '' && queriedProps[0].coverage >= 0) return getStatsLevel(props, [ ...queriedProps, ...propsWithStats ], level + 1, total, options, firstTimeQuery)
        // get all        
        let stats = await Promise.all(queriedProps.map(prop => {
            let propQuery = queryLib.makePropQuery(prop, options, firstTimeQuery)
            return queryLib.getData(options.endpoint, propQuery, options.prefixes)
        }).map(ignorePromise))
        let merged = await queryLib.mergeStatsWithProps(queriedProps, stats, total)
        // save all stats, only if they are relative to the whole ensemble
        if (options.constraints === '') pathModel.createOrUpdate(merged)
        // do not wait for success
        // filter based on unique values, only if not first time
        merged = merged.filter(prop => {
            return (prop.total > 0 &&
            ((prop.category === 'number') ||
            (prop.category === 'datetime') ||
            (prop.category === 'text') ||
            (prop.category === 'geo') ||
            (prop.type === 'uri' && prop.level === maxLevel - 1)))
            //(prop.category === 'text' && prop.avgcharlength <= options.maxChar && prop.unique <= options.maxUnique) ||
            //(prop.category === 'uri' && prop.unique <= options.maxUnique)))
        })
        return getStatsLevel(props, [ ...merged, ...propsWithStats ], level + 1, total, options, firstTimeQuery)
    }
}

const getPropsLevel = async (categorizedProps, level, options) => {
    let { entrypoint, endpoint, prefixes, maxLevel } = options
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
        let propsLists = await Promise.all(queriedProps.map(prop => {
            let propsQuery = queryLib.makePropsQuery(prop.path, options, level)
            // console.log('////////', propsQuery)
            return queryLib.getData(endpoint, propsQuery, prefixes)
        }).map(ignorePromise))
        // keep only promises that have been fulfilled
        propsLists = propsLists.map((props, index) => {
            return (props) ? props.results.bindings : false
        }).filter(props => props !== false)
        // generate prefixes if needed
        propsLists.reduce(function (flatArray, list) {
            return flatArray.concat(list)
        }, []).forEach(prop => {
            if (!queryLib.prefixDefined(prop.property.value, prefixes)) {
                prefixes = queryLib.addSmallestPrefix(prop.property.value, prefixes)
            }
        })
        propsLists.forEach((props, index) => {
            let filteredCategorizedProps = props.map(prop => {
                // the place to create or fetch a prefix if it does not exist, needed to make the path in defineGroup
                return queryLib.defineGroup(prop, queriedProps[index], level, options)
            }).filter(prop => {
                return (prop.category !== 'ignore') &&
                !checkExistingProps.includes(prop.property)
                // to prevent a loop - to be refined, better check if a pattern in the path is repeated or inverse
            })
            newCategorizedProps.push(...filteredCategorizedProps)
        })
        // save in mongo database
        if (newCategorizedProps.length > 0) pathModel.createOrUpdate(newCategorizedProps)
        // do not wait for result to continue
    }
    let returnProps = [
        ...categorizedProps,
        ...newCategorizedProps
    ]
    if (level < maxLevel && newCategorizedProps.length > 0) {
        return getPropsLevel(returnProps, level + 1, options)
    } else {
        // discard uris when there are more specific paths
        returnProps = returnProps.filter(prop => {
            return (returnProps.filter(specificProp => specificProp.path.indexOf(prop.path) === 0 &&
                specificProp.level > prop.level).length === 0)
        })
        return { statements: returnProps, options }
    }
}

export default router
