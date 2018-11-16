import fetch from 'node-fetch'
import types from '../constants/ActionTypes'
import { activateDefaultConfigs, defineConfigs, getSelectedView, scoreMatch } from '../lib/configLib'
import { getData, makeCheckPivotQuery, makeDetailQuery, makePropQuery, makeQuery, makeMultipleQuery, makeTransitionQuery } from '../lib/queryLib'

export const endTransition = (dispatch) => (zone) => {
    return dispatch({
        zone,
        type: types.END_TRANSITION
    })
}

export const loadStats = (dispatch) => (dataset) => {
    getStats({ ...dataset, constraints: '', stats: [] })
}

const getStats = (options) => {
    return fetch((`${process.env.API || '/'}stats`),
        {
            method: 'POST',
            body: JSON.stringify(options),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Origin'
            }
        })
        .then((resp) => resp.json())
    // return rp('http://localhost:80/stats/' + entrypoint)
}
const getResources = (options) => {
    return fetch((`${process.env.API || '/'}resources`),
        {
            method: 'POST',
            body: JSON.stringify(options),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type, User-Agent, Origin'
            }
        })
        .then((resp) => resp.json())
}

const evaluateSubStats = (stats) => {
    let { selectionInstances, totalInstances, statements } = stats
    let ratio = selectionInstances / totalInstances
    return {
        ...stats,
        statements: statements.map(statement => {
            // console.log(statement.unique, statement.total, statement)
            return {
                ...statement,
                total: Math.ceil(statement.total * ratio),
                unique: (statement.unique * ratio < 2) ? 2 : Math.ceil(statement.unique * ratio)
            }
        })
    }
}

const checkStatements = (statements, selectionInstances, dataset) => {
    return Promise.all(statements.map(prop => {
        let propQuery = makePropQuery(prop, dataset, 'count')
        return getData(dataset.endpoint, propQuery, dataset.prefixes)
    }))
        .then((results) => {
            // mix stats and results
            // add checked property

            let checked = []
            statements.forEach((prop, index) => {
                let countStat = results[index].results.bindings[0]
                // console.log('countStat', countStat.total.value, countStat.unique.value, countStat.coverage.value, selectionInstances)
                checked.push({
                    ...prop,
                    total: Number(countStat.total.value),
                    unique: Number(countStat.unique.value),
                    coverage: Number(countStat.coverage.value) * 100 / selectionInstances
                })
            })
            return checked
        })
}

const checkStatementsValidity = (props, checkedProps) => {
    for (const prop of props) {
        const checkedProp = checkedProps.find(p => p.fullPath === prop.fullPath)
        if (checkedProp.coverage / prop.coverage < 0.9) {
            return false
        }
        if (checkedProp.unique / prop.unique < 0.9) {
            return false
        }
        if (checkedProp.total / prop.total < 0.9) {
            return false
        }
    }
    return true
}

const checkEvaluationConfigs = async (configs, stats, dataset) => {
    for (const view of configs.views) {
        // verify selectedMatch.properties using checkStatements function (it is used in the function below as an example)
        const checkedProps = await checkStatements(
            view.selectedMatch.properties,
            stats.selectionInstances,
            dataset
        )

        // if all views have been checked without success
        // for each view, find the next property match
        for (const [key, prop] of Object.entries(view.selectedMatch.properties)) {
            if (prop.total === 0) {
                const propIndex = view.propList[key].findIndex(p => p.fullPath === prop.fullPath)
                view.propList[key].splice(propIndex, 1)
                view.selectedMatch.properties[key] = view.propList[key][propIndex]
            }
        }

        // compute the new score of checked stats (function scoreMatch in configLib.js)
        // compare the former score, 'unique' and 'total' value of estimated stats with the new checked values
        // if the difference is no more than, let's say 10 %, we will adjust later,
        // break the loop, put the current view as first in the list and return configs
        // else check next view
        const previousScoreMatch = view.selectedMatch.scoreMatch
        view.selectedMatch.scoreMatch = scoreMatch(checkedProps, view.weight, dataset.rankMatchFactors)
        if (view.selectedMatch.scoreMatch / previousScoreMatch < 0.9) {
            continue
        }
        if (checkStatementsValidity(view.selectedMatch.properties, checkedProps)) {
            configs.views.splice(configs.views.findIndex(v => v.id === view.id), 1)
            configs.views.unshift(view)
            return configs
        }
    }

    return checkEvaluationConfigs(configs, stats, dataset)
}

const checkFirstValidConfigs = (configs, stats, dataset) => {
    // console.log(configs)
    let propsToCheck = []
    let matchesToCheck = {}
    let views = configs.views
    let double = []
    let newStats
    for (let i = 0; i < views.length; i++) {
        views[i].propList.forEach(list => {
            let max = 1 // the number of config checked could depend of the number of views, and the total number of entities
            if (list.length < max) max = list.length
            for (let i = 0; i < max; i++) {
                let prop = list[i]
                if (!double.includes(prop.fullPath)) {
                    propsToCheck.push(prop)
                    double.push(prop)
                }
            }
        })
        matchesToCheck[views[i].id] = views[i].selectedMatch.properties
    }

    return checkStatements(propsToCheck, stats.selectionInstances, dataset)
        .then(propsChecked => {
            newStats = {
                ...stats,
                statements: stats.statements.map(prop => {
                    const propChecked = propsChecked.find(p => p.fullPath === prop.fullPath)
                    if (propChecked) {
                        return {
                            ...prop,
                            ...propChecked,
                            checked: true
                        }
                    } else {
                        return prop
                    }
                })
            }
            let newConfigs = activateDefaultConfigs(defineConfigs(views, newStats, dataset))
            return [newConfigs, newStats]
            // if both main and aside send results
            // else start from new config keeping checked config if there is one and call recursive
        })
}

export const analyseResources = (dispatch) => (dataset, resources) => {
    // console.log('ICI', dataset, resources)
    getResources({ ...dataset, toAnalyse: resources })
}

export const getGraphs = (dispatch) => (dataset) => {
    let query = `SELECT DISTINCT ?g 
    WHERE {
        GRAPH ?g { ?s ?p ?o }
    }`
    let ignore = [
        'http://www.openlinksw.com/schemas/virtrdf#',
        'http://www.w3.org/ns/ldp#',
        'http://localhost:8890/sparql',
        'http://localhost:8890/DAV/',
        'http://www.w3.org/2002/07/owl#',
        'http://www.w3.org/2000/01/rdf-schema#Class'
    ]
    dataset.resources.forEach(resource => {
        ignore.push(resource.type)
    })
    getData(dataset.endpoint, query, dataset.prefixes)
        .then(results => {
            return results.bindings.map(graph => {
                if (!ignore.includes(graph.g.value)) return graph.g.value
            }).filter(graph => graph)
        })
}

export const loadResources = (dispatch) => (dataset, views) => {
    let { endpoint, graphs, prefixes } = dataset
    // console.log('load resources', graphs)
    let totalInstances
    return getResources(dataset)
        .then(resources => {
            if(resources.length > 0) { 
                dataset.entrypoint = resources[0].type
                dataset.totalInstances = resources[0].total
                // console.log('resources', resources) 
                return getStats({ ...dataset, stats: [], resources })
                    .then(stats => {
                        prefixes = stats.options.prefixes
                        // console.log('ok on a bien reçu les stats', stats) //, defineConfigs(views, stats)
                        // for each views, checks which properties ou sets of properties could match and evaluate
                        let configs = activateDefaultConfigs(defineConfigs(views, stats, dataset))
                        //
                        // console.log('configs', configs) 
                        const configMain = getSelectedView(configs, 'main')
                        // console.log('configMain', configMain) 
                        if (configMain) {
                            const queryMain = makeQuery(dataset.entrypoint, configMain, 'main',  { ...dataset, maxDepth: (configMain.id === 'ListAllProps' || configMain.id === 'InfoCard') ? 1 : null })
                            
                            const queryMainUnique = makeQuery(dataset.entrypoint, configMain, 'main', { ...dataset, unique: true })
                            //
                            return Promise.all([
                                getData(endpoint, queryMain, prefixes),
                                getData(endpoint, queryMainUnique, prefixes)
                            ])
                                .then(([dataMain, uniqueMainPromise]) => { // , coverageMain, coverageAside
                                    dispatch({
                                        type: types.SET_RESOURCES,
                                        resources,
                                        stats,
                                        entrypoint: dataset.entrypoint,
                                        graphs: dataset.graphs,
                                        totalInstances,
                                        prefixes: stats.options.prefixes,
                                        labels: stats.options.labels,
                                        constraints: '',
                                        mainConfig: configs.views,
                                        main: { ...dataMain },
                                        mainDisplayed: configMain.id === 'ListAllProps' || configMain.id === 'InfoCard' ? dataset.stats.selectionInstances : Number(uniqueMainPromise.results.bindings[0].displayed.value)
                                    })
                                    return resources
                                })
                        } else {
                            dispatch({
                                type: types.SET_RESOURCES,
                                resources,
                                graphs: dataset.graphs
                            })
                            return resources
                        } 
                    })
            } else {
                console.log('no resources found')
                dispatch({
                    type: types.SET_RESOURCES,
                    resources,
                    graphs: dataset.graphs
                })
                return resources
            }    
        })
        .catch(error => {
            console.error('Error getting data', error)
        })
}

export const checkPivots = (dispatch) => (properties, dataset) => {
    properties = properties.map(prop => {
        return {
            ...prop,
            path: prop.path.replace('/*/', '/?/')
        }
    })
    return getData(dataset.endpoint, makeCheckPivotQuery(properties, dataset), dataset.prefixes)
}

export const loadSingle = (dataset, configMain, singleURI) => {
    let { maxLevel, entrypoint, endpoint, prefixes } = dataset
    return Promise.all(Array.from(Array(maxLevel).keys()).map(depth => getData(endpoint, makeQuery(entrypoint, configMain, 'main',  { ...dataset, singleURI, maxDepth: depth + 1 }), prefixes)))
        .then(allresults => {
            return { results: { bindings: allresults.reduce((acc, cur) => {
                acc.push(...cur.results.bindings)
                return acc
            }, []) } }
        })
}

export const selectResource = (dispatch) => (dataset, views, previousConfigs, previousOptions, savedSelections) => {
    // console.log('ok on va cherche les stats', dataset)
    let { constraints, endpoint, entrypoint, graphs, prefixes, totalInstances, resourceGraph } = dataset
    let graph =  resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    return getStats({ ...dataset, stats: [], constraints: '' })
        .then(stats => {
            let singleURI
            prefixes = stats.options.prefixes
            // console.log('ok on a bien reçu les stats', stats)
            return new Promise((resolve, reject) => {
                // if pivot 
                if (constraints !== '') {
                    let countInstancesQuery = `SELECT (COUNT(DISTINCT ?entrypoint) as ?total) ${graph} WHERE { ?entrypoint rdf:type <${entrypoint}> . ${constraints} }`
                    // console.log(countInstancesQuery)
                    getData(endpoint, countInstancesQuery, prefixes)
                        .then(countInstances => {
                            let selectionInstances = Number(countInstances.results.bindings[0].total.value)
                            // console.log('selectionInstances', selectionInstances, stats.totalInstances)
                            let configs
                            // console.log(configs)
                            if (selectionInstances === stats.totalInstances) {
                                configs = activateDefaultConfigs(defineConfigs(views, { ...stats, selectionInstances }, dataset))
                                resolve(configs)
                            } else if (selectionInstances === 1) {
                                configs = activateDefaultConfigs(defineConfigs(views, { ...stats, selectionInstances }, dataset))
                                let singleURIQuery =  `SELECT ?entrypoint ${graph} WHERE { ?entrypoint rdf:type <${entrypoint}> . ${constraints} }`
                                getData(endpoint, singleURIQuery, prefixes)
                                    .then(res => {
                                        singleURI = res.results.bindings[0].entrypoint.value
                                        resolve(configs)
                                    })
                                
                            } else if (selectionInstances > 1) {
                                // evaluation of 'unique' and 'total' values for all paths on the subset
                                stats = evaluateSubStats({ ...stats, selectionInstances })
                                // definition of the new configs based on the estimation
                                configs = activateDefaultConfigs(defineConfigs(views, { ...stats, selectionInstances }, dataset))
                                // check evaluation
                                resolve(checkEvaluationConfigs(configs, { ...stats, selectionInstances }, dataset))
                            } else {
                                reject('No results')
                            }
                        })
                } else {
                    // for each views, checks which properties ou sets of properties could match and evaluate
                    let configs = activateDefaultConfigs(defineConfigs(views, stats, dataset))
                    resolve(configs)
                }
            })
                .then(configs => {
                    const configMain = getSelectedView(configs, 'main')
                    // console.log(configs, configMain)
                    const previousConfigMain = getSelectedView(previousConfigs, 'main')
                    // console.log(previousConfigs, configMain, dataset, previousConfigMain, previousOptions)
                    let queryTransitionMain = makeTransitionQuery(configMain, dataset, previousConfigMain, previousOptions, 'main')
                    return Promise.all([
                        singleURI ? loadSingle(dataset, configMain, singleURI) : getData(endpoint, makeQuery(entrypoint, configMain, 'main', dataset), prefixes),
                        !dataset.transitionOff ? getData(endpoint, queryTransitionMain, prefixes) : [],
                        singleURI ? 1 : getData(endpoint, makeQuery(entrypoint, configMain, 'main', { ...dataset, unique: true }), prefixes)
                    ])
                        .then(([dataMain, dataDeltaMain, uniqueMainPromise]) => { // , coverageMain, coverageAside
                            //console.log('select resource, get data', queryMain, dataMain)
                            //console.log('select resource, get data', queryMainUnique, uniqueMainPromise)
                            if (singleURI || Number(uniqueMainPromise.results.bindings[0].displayed.value) >= 1) {
                                dispatch({
                                    type: types.SET_STATS,
                                    stats,
                                    entrypoint,
                                    totalInstances,
                                    savedSelections,
                                    prefixes: stats.options.prefixes,
                                    labels: stats.options.labels,
                                    mainDelta: dataDeltaMain,
                                    constraints,
                                    mainConfig: configs.views,
                                    main: { ...dataMain },
                                    mainDisplayed: singleURI ? 1 : Number(uniqueMainPromise.results.bindings[0].displayed.value)
                                })
                            } else {
                                return new Promise((resolve, reject) => reject('No results'))
                            }
                        })
                })
        })
}


export const displayConfig = (dispatch) => (viewIndex, props, configs, prevConfig, dataset, zone) => {
    const { endpoint, entrypoint, prefixes } = dataset
    const updatedConfigs = configs.map((config, index) => {
        return {
            ...config,
            selected: index === viewIndex,
            selectedMatch: props
        }

    })
    let updatedConfig = updatedConfigs.filter(c => c.selected)[0]
    const newQuery = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, maxDepth: (updatedConfig.id === 'ListAllProps' || updatedConfig.id === 'InfoCard') ? 1 : null })
    const queryTransition = makeTransitionQuery(updatedConfig, dataset, prevConfig, dataset, zone)
    const queryUnique = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, unique: true })
    return Promise.all([
        getData(endpoint, newQuery, prefixes),
        getData(endpoint, queryTransition, prefixes),
        getData(endpoint, queryUnique, prefixes)
    ])
        .then(([newData, newDelta, newUnique]) => {
            if (newData.results.bindings.length === 0 && updatedConfig.id !== 'ListAllProps' && updatedConfig.id !== 'InfoCard') throw 'No entities with this combination of paths'
            const action = {
                type: types.SET_CONFIGS,
                zone: zone
            }
            action.entrypoint = entrypoint
            action.stats = dataset.stats
            action[zone] = ((updatedConfig.id === 'ListAllProps' && prevConfig.id === 'InfoCard') || (updatedConfig.id === 'InfoCard' && prevConfig.id === 'ListAllProps')) ? undefined : newData
            action[zone + 'Config'] = updatedConfigs
            action[zone + 'Delta'] = ((updatedConfig.id === 'ListAllProps' && prevConfig.id === 'InfoCard') || (updatedConfig.id === 'InfoCard' && prevConfig.id === 'ListAllProps')) ? {} : newDelta
            action[zone + 'Displayed'] = updatedConfig.id === 'ListAllProps' || updatedConfig.id === 'InfoCard' ? 1 : Number(newUnique.results.bindings[0].displayed.value)
            dispatch(action)
        })
}

export const loadMultiple = (dispatch) => (dataset, path, indexC, indexP, zone) => {
    let { endpoint, entrypoint, prefixes } = dataset
    let queryMain = makeMultipleQuery(entrypoint, path, indexP, 'main', dataset)
    // console.log(queryMain)
    return getData(endpoint, queryMain, prefixes)
        .then(data => {
            /* dispatch({
                type: types.SET_MULTIPLE,
                indexC,
                indexP,
                zone,
                elements: data
            }) */
            // console.log('youpi', data)
            return data
        })
}

export const loadDetail = (dispatch) => (dataset, configs, zone) => {
    // console.log('load Detail ', dataset.constraints)
    // would like to use async await rather than imbricated promise but compilation fails
    let { endpoint, entrypoint, prefixes } = dataset
    const configMain = getSelectedView(configs, 'main')
    let queryMain = makeDetailQuery(entrypoint, configMain, 'main', dataset )
    // console.log(queryMain)
    return getData(endpoint, queryMain, prefixes)
        .then(data => {
            dispatch({
                type: types.SHOW_DETAILS,
                details: data.results.bindings
            })
        })
}
