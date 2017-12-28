import express from 'express'
import promiseSettle from 'promise-settle'
import queryLib from '../src/lib/queryLib'
import prefixModel from '../models/prefix'
const router = express.Router()

router.post('/', (req, res) => {
    if (!req.body.entrypoint || !req.body.endpoint) {
        console.error('You must provide at least an entrypoint and an endpoint')
        res.end()
    } else {
        getStats(req.body)
            .then(props => {
                console.log('API stats', props)
                res.json(props)
            })
            .catch((err) => {
                console.log('Error retrieving stats', err)
            })
    }
})

const getStats = (opt) => {
    const ignore = opt.ignoreList ? [...opt.ignoreList] : []
    let options = {
        entrypoint: opt.entrypoint,
        constraints: opt.constraints || '',
        defaultGraph: opt.defaultGraph || null,
        endpoint: opt.endpoint,
        ignoreList: [...ignore, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
        dateList: opt.dateList,
        maxLevel: opt.maxLevel || 4,
        maxUnique: opt.maxUnique || 100,
        maxChar: opt.maxChar || 55,
        prefixes: opt.prefixes || {}
    }
    let total
    return prefixModel.findOrCreate(options.prefixes)
        .then(results => {
            if (queryLib.usesPrefix(options.entrypoint, options.prefixes)) {
                return options.entrypoint
            } else {
                return prefixModel.findOrGenerateOne(options.entrypoint)
                    .then(prefix => {
                        // console.log('prefix', prefix)
                        options.prefixes[prefix.prefix] = prefix._id
                        return queryLib.usePrefix(options.entrypoint, options.prefixes)
                    })
            }
        })
        .then(entrypoint => {
            // console.log('entrypoint', entrypoint)
            options.entrypoint = entrypoint
            return queryLib.makeTotalQuery(entrypoint, options.constraints, options.defaultGraph)
        })
        .then(totalQuery => {
            // console.log('totalQuery', totalQuery)
            return queryLib.getData(options.endpoint, totalQuery, options.prefixes)
        })
        .then(totalcount => {
            total = Number(totalcount.results.bindings[0].total.value)
            const entryProp = [{ path: options.entrypoint, previousPath: options.entrypoint, level: 0, category: 'entrypoint' }]
            return (total === 0) ? new Promise(resolve => resolve([])) : getStatsLevel(entryProp, 1, total, options)
        })
        .then(props => {
            return prefixModel.find()
                .then(newPrefixes => {
                    newPrefixes.forEach(prefix => {
                        options.prefixes[prefix.prefix] = prefix._id
                    })
                    return new Promise(resolve => resolve({ total_instances: total, statements: props, options }))
                })
        })
}
const getStatsLevel = (categorizedProps, level, total, options) => {
    let { entrypoint, constraints, endpoint, prefixes, maxLevel, maxUnique, maxChar, defaultGraph } = options
    let newCategorizedProps = []
    const queriedProps = categorizedProps.filter(prop => {
        return (prop.level === level - 1 &&
            (prop.category === 'entrypoint' ||
            (prop.category === 'uri' && prop.unique > maxUnique)))
    })
    const checkExistingProps = categorizedProps.map(p => p.property)
    return promiseSettle(
        queriedProps.map(prop => {
            let propsQuery = queryLib.makePropsQuery(prop.path, constraints, level, defaultGraph)
            // console.log('////////', propsQuery)
            return queryLib.getData(endpoint, propsQuery, prefixes)
        })
    )
        .then(propsLists => {
            // console.log('||||||||||||||||', level, propsLists)
            propsLists.forEach((props, index) => {
                if (props.isFulfilled()) {
                    props = props.value()
                    let filteredCategorizedProps = props.results.bindings.map(prop => {
                        // console.log('??????', level, { ...prop })
                        return queryLib.defineGroup(prop, queriedProps[index].path, level, options)
                    }).filter(prop => {
                        return (prop.category !== 'ignore') &&
                        !checkExistingProps.includes(prop.property)
                    })
                    newCategorizedProps.push(...filteredCategorizedProps)
                }
            })
            // console.log('[[[[[[[[[[[[[[', newCategorizedProps.length, newCategorizedProps)
            if (newCategorizedProps.length > 0) {
                return promiseSettle(newCategorizedProps.map(prop => {
                    return prefixModel.findOrGenerateOne(prop.property)
                }))
                    .then(newPrefixes => {
                        newPrefixes.forEach(prefix => {
                            if (prefix.prefix) prefixes[prefix.prefix] = prefix._id
                        })
                        return promiseSettle(newCategorizedProps.map(prop => {
                            let propQuery = queryLib.makePropQuery(prop, constraints, defaultGraph)
                            // console.log('[[[[[[[[[[[[[[', propQuery)
                            return queryLib.getData(endpoint, propQuery, prefixes)
                        }))
                    })
            } else {
                return []
            }
        })
        .then(stats => {
            // console.log('@@@@@@@@@@@@@', level, stats)
            const returnProps = [
                ...categorizedProps,
                ...queryLib.mergeStatsWithProps(newCategorizedProps, stats, total)
            ]
            // console.log(returnProps)
            if (level < maxLevel && stats.length > 0) {
                return getStatsLevel(returnProps, level + 1, total, options)
            } else {
                return new Promise(resolve => resolve(returnProps))
            }
        })
        .catch((err) => {
            console.error('Error retrieving stats', err)
        })
}
router.post('/:class', (req, res) => {
    console.log("c'est parti")
})

router.post('/:class/:constraint', (req, res) => {
    // for later, store preprocessing in the data base
})

export default router
