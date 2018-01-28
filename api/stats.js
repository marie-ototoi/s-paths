import express from 'express'
import fetch from 'rdf-fetch'
import rdflib from 'rdflib'
import promiseSettle from 'promise-settle'
import pathModel from '../models/path'
import propertyModel from '../models/property'
import queryLib from '../src/lib/queryLib'
// import { error } from 'util';

const router = express.Router()

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

const getStats = (opt) => {
    // add default options when not set
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
    let { prefixes, entrypoint, forceUpdate, endpoint } = options
    if (forceUpdate === true) pathModel.deleteMany({ entrypoint: entrypoint, endpoint: endpoint })
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
    console.log(selectionQuery)
    // retrieve number of entities
    return queryLib.getData(endpoint, totalQuery, prefixes)
        .then(totalcount => {
            totalInstances = Number(totalcount.results.bindings[0].total.value)
            if (options.constraints === '') {
                selectionInstances = totalInstances
                return true
            } else {
                queryLib.getData(endpoint, selectionQuery, prefixes)
                    .then(selectioncount => {
                        selectionInstances = Number(selectioncount.results.bindings[0].total.value)
                        return true
                    })
                    .catch(error => { console.error('Error getting constrained total count', error) })
            }
        })
        .then(ok => {
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
                    category: 'entrypoint'
                }]
                // check if props available in database
                // if necessary retrieve missing level
                // or recursively retrieve properties
                return getPropsLevel(entryProp, 1, options)
                    .then(resp => {
                        // get stats to match the props
                        return getStatsLevel(resp.statements, [], 1, totalInstances, options, true)
                        // last parameter is for first time query, should be changed dynamically
                    })
                    .then(resp => {
                        // get human readable rdfs:labels and rdfs:comments of all properties listed
                        return getLabels(resp.options.prefixes, resp.statements)
                            .then(labels => {
                                return {
                                    statements: resp.statements.sort((a, b) => a.level - b.level),
                                    totalInstances,
                                    selectionInstances,
                                    options: {
                                        ...resp.options,
                                        labels
                                    }
                                }
                            })
                    })
            }
        })
}

const getLabels = (prefixes, props) => {
    // find all classes and props used in paths
    let urisToLabel = props.reduce((acc, curr) => {
        let pathParts = curr.path.split('/')
        // deduplicate
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
    let missingUris
    // create a local graph
    let graph = new rdflib.IndexedFormula()
    // to add 
    // try to get props labels and comments in database
    // if already defined, do not keep in queried prefixes
    // propertyModel.find({ uri: uri }).exec()
    return Promise.all(urisToLabel.map(prop => {
        return propertyModel.findOne({ uri: prop.uri }).exec()
    }))
        .then(propsInDatabase => {
            propsInDatabase.forEach((prop, index) => {
                if (prop) {
                    urisToLabel[index].label = prop.label
                    urisToLabel[index].comment = prop.comment
                }
            })
            return true
        })
        .then(next => {
            missingUris = urisToLabel.filter(prop => !prop.label)
            // make an array of prefix object
            let prefixesArray = []
            for (let pref in prefixes) {
                // check if needed for the missing props
                const isNeeded = missingUris.filter(prop => prop.prefUri.indexOf(pref) === 0).length > 0
                if (isNeeded) prefixesArray.push({ _id: prefixes[pref], prefix: pref })
            }
            // load ontologies corresponding to prefixes
            return promiseSettle(
                // try to load the ontology corresponding to each prefix
                prefixesArray.map(prefix => {
                    return loadOntology(prefix._id, graph)
                })
            )
        })
        .then(resp => {
            return getLabelsFromGraph(missingUris, graph)
        })
        .then(missingUris => {
            propertyModel.createOrUpdate(missingUris)
            return urisToLabel.map(prop => {
                if (prop.label) {
                    return prop
                } else {
                    const missing = missingUris.filter(missingprop => missingprop.uri === prop.uri && missingprop.label)
                    if (missing.length > 0) {
                        return missing[0]
                    } else {
                        return prop
                    }
                }
            })
        })
        .then(urisToLabel => {
            missingUris = urisToLabel.filter(prop => !prop.label)
            return promiseSettle(
                // try to load the ontology corresponding to each prefix
                missingUris.map(prop => {
                    return loadOntology(prop.uri, graph)
                })
            )
        })
        .then(resp => {
            return getLabelsFromGraph(missingUris, graph)
        })
        .then(missingUris => {
            propertyModel.createOrUpdate(missingUris)
            return urisToLabel.map(prop => {
                if (prop.label) {
                    return prop
                } else {
                    const missing = missingUris.filter(missingprop => missingprop.uri === prop.uri && missingprop.label)
                    if (missing.length > 0) {
                        return missing[0]
                    } else {
                        return prop
                    }
                }
            })
        })
        // to add => if some properties are still not labeled,
        // try to load them one by one
        // save all labels in the store (find or create)    
}

const getLabelsFromGraph = (uris, graph) => {
    return promiseSettle(uris.map(prop => {
        return graph.any(rdflib.sym(prop.uri), rdflib.sym('http://www.w3.org/2000/01/rdf-schema#label'))
    }))
        .then(labels => {
            labels.forEach((label, index) => {
                if (label.isFulfilled() && label.value()) {
                    // console.log('////', label.value())
                    // to add : save in database
                    uris[index].label = label.value().value
                }
            })
            return uris
        })
        .then(uris => {
            // get a rdfs:comment for each prop 
            return promiseSettle(uris.map(prop => {
                return graph.any(rdflib.sym(prop.uri), rdflib.sym('http://www.w3.org/2000/01/rdf-schema#comment'))
            })).then(comments => {
                comments.forEach((comment, index) => {
                    if (comment.isFulfilled() && comment.value()) {
                        // to add : save in database
                        uris[index].comment = comment.value().value
                    }
                })
                return uris
            })
        })
}

const loadOntology = (url, graph) => {
    // console.log('load ontology', url)
    return fetch(url, { redirect: 'follow', headers: { 'Accept': 'Accept: text/turtle, application/rdf+xml; q=0.7, text/ntriples; q=0.9, application/ld+json; q=0.8' } }).then(response => {
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
                    // console.log('ICI',url, text)
                    // console.log(prefix._id, mediaType, 'successfully parsed', graph)
                    return rdflib.parse(text, graph, url, mediaType)
                })
            }
        } else {
            // nothing
            return response
        }
    })
}

const getStatsLevel = (props, propsWithStats, level, total, options, firstTimeQuery) => {
    // console.log(props)
    const queriedProps = props.filter(prop => {
        // check levels one after another 
        // except for first time exploration,
        // lower levels are sent only if upper levels have not been kept 
        return (prop.level === level &&
            (propsWithStats.filter(prevProp => prop.path.indexOf(prevProp.path) === 0 &&
            prop.level === prevProp.level + 1).length === 0)) // if the beginnig of the path is displayed at a higher level, don't keep (could be discussed)
    })
    if (queriedProps.length === 0) {
        // end of the recursive loop
        return { statements: propsWithStats, options }
    } else {
        // if the query is about the whole set and stats have already been saved
        //if (options.constraints === '' && queriedProps[0].coverage >= 0) return getStatsLevel(props, [ ...queriedProps, ...propsWithStats ], level + 1, total, options, firstTimeQuery)
        // get all
        return promiseSettle(queriedProps.map(prop => {
            let propQuery = queryLib.makePropQuery(prop, options, firstTimeQuery)
            return queryLib.getData(options.endpoint, propQuery, options.prefixes)
        }))
            .then(stats => {
                return queryLib.mergeStatsWithProps(queriedProps, stats, total)
            })
            .then(merged => {
                // save all stats, only if they are relative to the whole ensemble
                if (options.constraints === '') pathModel.createOrUpdate(merged)
                // do not wait for success
                // filter based on unique values, only if not first time
                return merged.filter(prop => {
                    return (prop.total > 0 &&
                    ((prop.category === 'number') ||
                    (prop.category === 'datetime') ||
                    (prop.category === 'text' && prop.avgcharlength <= options.maxChar && prop.unique <= options.maxUnique) ||
                    (prop.category === 'uri' && prop.unique <= options.maxUnique)))
                })
            })
            .then(merged => {
                return getStatsLevel(props, [ ...merged, ...propsWithStats ], level + 1, total, options, firstTimeQuery)
            })
    }
}

const getPropsLevel = (categorizedProps, level, options) => {
    let { entrypoint, endpoint, prefixes, maxLevel } = options
    let newCategorizedProps = []
    // look for savedProps in the database
    return pathModel.find({ entrypoint: entrypoint, endpoint: endpoint, level: level }).exec()
        .then(props => {
            if (props.length > 0) {
                // console.log('////////////////////////// saved props')
                // if available
                // generate current prefixes
                return props.map(prop => {
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
                // console.log('////////////////////////// new fetch')
                // no props saved start from entr
                const queriedProps = categorizedProps.filter(prop => {
                    return (prop.level === level - 1 &&
                        (prop.category === 'entrypoint' ||
                        (prop.category === 'uri')))
                })
                const checkExistingProps = categorizedProps.map(p => p.property)
                return promiseSettle(
                    queriedProps.map(prop => {
                        let propsQuery = queryLib.makePropsQuery(prop.path, options, level)
                        // console.log('////////', propsQuery)
                        return queryLib.getData(endpoint, propsQuery, prefixes)
                    })
                ).then(propsLists => {
                    // keep only promises that have been fulfilled
                    propsLists = propsLists.map((props, index) => {
                        if (props.isFulfilled()) {
                            return props.value().results.bindings
                        } else {
                            return false
                        }
                    }).filter(props => props !== false)
                    // generate prefixes if needed
                    propsLists.reduce(function (flatArray, list) {
                        return flatArray.concat(list)
                    }, []).forEach(prop => {
                        if (!queryLib.prefixDefined(prop.property.value, prefixes)) {
                            prefixes = queryLib.addSmallestPrefix(prop.property.value, prefixes)
                        }
                    })
                    // console.log('////////', propsLists)
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
                    if (newCategorizedProps.length > 0) {
                        // save in mongo database
                        pathModel.createOrUpdate(newCategorizedProps)
                    }
                    // do not wait for result to continue
                    return newCategorizedProps
                })
            }
        }).then(newCategorizedProps => {
            // console.log('tronc commun')
            const returnProps = [
                ...categorizedProps,
                ...newCategorizedProps
            ]
            // console.log(returnProps)
            if (level < maxLevel && newCategorizedProps.length > 0) {
                return getPropsLevel(returnProps, level + 1, options)
            } else {
                return { statements: returnProps, options }
            }
        })
}

export default router
