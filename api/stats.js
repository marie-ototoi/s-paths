import express from 'express'
import fetch from 'rdf-fetch'
import rdflib from 'rdflib'
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
    return prefixModel.createOrUpdate(options.prefixes) // store prefixes sent as options
        .then(results => {
            // check if entrypoint uses a prefix
            if (queryLib.usesPrefix(options.entrypoint, options.prefixes)) {
                return options.entrypoint
            } else {
                // if not get or generate one
                return prefixModel.findOrGenerateOne(options.entrypoint)
                    .then(prefix => {
                        // update options
                        options.prefixes[prefix.prefix] = prefix._id
                        // apply it to the entrypoint
                        return queryLib.usePrefix(options.entrypoint, options.prefixes)
                    })
            }
        })
        .then(entrypoint => {
            // update entrypoint with prefix
            options.entrypoint = entrypoint
            // get number of entities of entrypoint class in the set limited by given constraints
            let totalQuery = queryLib.makeTotalQuery(entrypoint, options.constraints, options.defaultGraph)
            return queryLib.getData(options.endpoint, totalQuery, options.prefixes)
        })
        .then(totalcount => {
            total = Number(totalcount.results.bindings[0].total.value)
            // create first prop for entrypoint to feed recursive function
            const entryProp = [{ path: options.entrypoint, previousPath: options.entrypoint, level: 0, category: 'entrypoint' }]
            if (total === 0) {
                // if number of entities is null return an empty array
                return { statements: [], options }
            } else {
                // check if props available in database
                // if necessary retrieve missing level
                // or recursively retrieve properties
                return getPropsLevel(entryProp, 1, options)
            }
        })
        .then(resp => {
            return getStatsLevel(resp.statements, [], 1, total, options, true)
            /* return promiseSettle(resp.statements.map(prop => {
                let propQuery = queryLib.makePropQuery(prop, options.constraints, options.defaultGraph)
                // console.log('[[[[[[[[[[[[[[', propQuery)
                return queryLib.getData(options.endpoint, propQuery, options.prefixes)
            }))
                .then(stats => {
                    return queryLib.mergeStatsWithProps(resp.statements, stats, total)
                })
                .then(merged => {
                    return { ...resp, statements: merged }
                }) */
        }).then(resp => {
            return getLabels(resp.options.prefixes, resp.statements)
                .then(labels => {
                    return {
                        ...resp,
                        total_instances: total,
                        options: {
                            ...resp.options,
                            labels
                        }
                    }
                })
        })
}
const getLabels = (prefixes, props) => {
    // console.log(prefixes)
    // find all classes and props used in paths, and deduplicate them
    let urisToLabel = props.reduce((acc, curr) => {
        let pathParts = curr.path.split('/')
        pathParts.forEach(part => {
            if (part !== '*' && !acc.includes(part)) acc.push(part)
        })
        return acc
    }, []).map(prop => {
        return {
            uri: queryLib.useFullUri(prop, prefixes),
            prefUri: prop
        }
    })
    // console.log(urisToLabel)
    // create a local graph
    let graph = new rdflib.IndexedFormula()
    // make an array of prefix object
    let prefixesArray = []
    for (let pref in prefixes) {
        prefixesArray.push({ _id: prefixes[pref], prefix: pref })
    }
    return promiseSettle(
        // try to load the ontology corresponding to each prefix
        prefixesArray.map(prefix => {
            return fetch(prefix._id, {}).then(response => {
                if (response.ok) {
                    // if succesful, parse it and add it to the graph
                    let mediaType = response.headers.get('Content-type')
                    // little hack to be removed -> warn hosts that the mime type is wrong
                    if (mediaType === 'text/xml') mediaType = 'application/rdf+xml'
                    // check for parsable ontologies type (to avoid app crash)
                    if (mediaType &&
                    (mediaType.indexOf('application/rdf+xml') >= 0 ||
                    mediaType.indexOf('text/turtle') >= 0 ||
                    mediaType.indexOf('text/n3') >= 0)) {
                        return response.text().then(text => {
                            return rdflib.parse(text, graph, prefix._id, mediaType)
                        })
                    }
                } else {
                    // what else
                    return response
                }
            }).catch(err => {
                console.error(err)
            })
        })
    ).then(resp => {
        // for each prop, tries to get all labels to describe the path from the local graph
        return promiseSettle(urisToLabel.map(prop => {
            return graph.any(rdflib.sym(prop.uri), rdflib.sym('http://www.w3.org/2000/01/rdf-schema#label'))
        })).then(labels => {
            labels.forEach((label, index) => {
                if (label.isFulfilled() && label.value()) {
                    urisToLabel[index].label = label.value().value
                }
            })
            // propsToLabel.filter(prop.)
            return urisToLabel
        })
    }).then(urisToLabel => {
        return promiseSettle(urisToLabel.map(prop => {
            return graph.any(rdflib.sym(prop.uri), rdflib.sym('http://www.w3.org/2000/01/rdf-schema#comment'))
        })).then(labels => {
            labels.forEach((label, index) => {
                if (label.isFulfilled() && label.value()) {
                    urisToLabel[index].comment = label.value().value
                }
            })
            // propsToLabel.filter(prop.)
            return urisToLabel
        })
    })
}

const getStatsLevel = (props, propsWithStats, level, total, options, firstTimeQuery) => {
    const queriedProps = props.filter(prop => {
        return (prop.level === level &&
            propsWithStats.filter(prevProp => prop.path.indexOf(prevProp.path) === 0 && prop.level === prevProp.level + 1).length === 0 // if the beginnig of the path is displayed at a higher level, don't keep (could be discussed)
        )
    })
    if (queriedProps.length === 0) {
        return { statements: propsWithStats, options }
    } else {
        return promiseSettle(queriedProps.map(prop => {
            let propQuery = queryLib.makePropQuery(prop, options, firstTimeQuery)
            // console.log('[[[[[[[[[[[[[[', propQuery)
            return queryLib.getData(options.endpoint, propQuery, options.prefixes)
        }))
            .then(stats => {
                return queryLib.mergeStatsWithProps(queriedProps, stats, total)
            })
            .then(merged => {
                // save all stats, then filter based on unique values
                
                // then keep only those responding to criteria
                return merged.filter(prop => {
                    return prop.category === 'number' ||
                    prop.category === 'datetime' ||
                    (prop.category === 'text' && prop.avgcharlength <= options.maxChar && prop.unique <= options.maxUnique) ||
                    (prop.category === 'uri' && prop.unique <= options.maxUnique)
                })
            })
            .then(merged => {
                return getStatsLevel(props, [ ...merged, ...propsWithStats ], level + 1, total, options, firstTimeQuery)
            })
    }
}

const getPropsLevel = (categorizedProps, level, options) => {
    let { entrypoint, constraints, endpoint, prefixes, maxLevel, defaultGraph } = options
    let newCategorizedProps = []
    // look for savedProps
    // propertyModel.find({ path: { $regex: `/${entrypoint}*/i` } }).exec().then()
    const queriedProps = categorizedProps.filter(prop => {
        return (prop.level === level - 1 &&
            (prop.category === 'entrypoint' ||
            (prop.category === 'uri')))
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
            propsLists = propsLists.map((props, index) => {
                if (props.isFulfilled()) {
                    return props.value().results.bindings
                } else {
                    return false
                }
            }).filter(props => props !== false)
            let flatPropList = propsLists.reduce(function (flatArray, list) {
                return flatArray.concat(list)
            }, [])
            return promiseSettle(flatPropList.map(prop => {
                return prefixModel.findOrGenerateOne(prop.property.value)
                    .then(prefix => {
                        prefixes[prefix.prefix] = prefix._id
                        return prop
                    })
            })).then(pref => {
                propsLists.forEach((props, index) => {
                    let filteredCategorizedProps = props.map(prop => {
                        // the place to create or fetch a prefix if it does not exist, needed to make the path in defineGroup
                        return queryLib.defineGroup(prop, queriedProps[index].path, level, options)
                    }).filter(prop => {
                        return (prop.category !== 'ignore') &&
                        !checkExistingProps.includes(prop.property) // to prevent a loop - to be refined, better check if a pattern in the path is repeated or inverse
                    })
                    newCategorizedProps.push(...filteredCategorizedProps)
                })
                if (newCategorizedProps.length > 0) {
                    const returnProps = [
                        ...categorizedProps,
                        ...newCategorizedProps
                    ]
                    if (level < maxLevel && newCategorizedProps.length > 0) {
                        return getPropsLevel(returnProps, level + 1, options)
                    } else {
                        return { statements: returnProps, options }
                    }
                } else {
                    return { statements: categorizedProps, options }
                }
            })
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
