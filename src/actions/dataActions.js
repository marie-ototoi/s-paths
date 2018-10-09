import fetch from 'node-fetch'
import types from '../constants/ActionTypes'
import { activateDefaultConfigs, defineConfigs, getSelectedView, selectProperty as selectPropertyConfig, selectView as selectViewConfig } from '../lib/configLib'
import { getData, makePropQuery, makeQuery, makeMultipleQuery, makeTransitionQuery } from '../lib/queryLib'

export const endTransition = (dispatch) => (zone) => {
    return dispatch({
        zone,
        type: types.END_TRANSITION
    })
}

export const loadStats = (dispatch) => (dataset) => {
    getStats({ ...dataset, constraints: '' })
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
            return {
                ...statement,
                total: Math.floor(statement.total * ratio),
                unique: Math.floor(statement.unique * ratio)
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
            
            let checked = {}
            statements.forEach((prop, index) => {
                let countStat = results[index].results.bindings[0]
                // console.log('countStat', countStat.total.value, countStat.unique.value, countStat.coverage.value, selectionInstances)
                checked[prop.fullPath] = {
                    ...prop,
                    total: Number(countStat.total.value),
                    unique: Number(countStat.unique.value),
                    coverage: Number(countStat.coverage.value) * 100 / selectionInstances
                }
            })
            return checked
        })
}

const checkFirstValidConfigs = (configs, stats, dataset, previousConfig) => {
    // console.log(configs)
    let propsToCheck = []
    let matchesToCheck = {}
    let views = configs.views
    let double = []
    let newStats
    for (let i = 0; i < views.length; i++) {
        views[i].propList.forEach(list => {
            let max = 3
            if (list.length < max) max = list.length
            for(let i = 0; i < max; i ++){
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
                    if (propsChecked[prop.fullPath]) {
                        return {
                            ...prop,
                            ...propsChecked[prop.fullPath],
                            checked: true
                        }
                    } else {
                        return prop
                    }
                })
            }
            let newConfigs = defineConfigs(views, newStats)
            
            
            console.log('la', newConfigs, newStats)
            return [newConfigs, newStats]
            // if both main and aside send results
            // else start from new config keeping checked config if there is one and call recursive
        })
}

export const loadSelection = (dispatch) => (dataset, views, previousConfigs, previousOptions) => {
    // console.log('load Data ', dataset.constraints)
    let { constraints, endpoint, entrypoint, prefixes, graphs, resourceGraph, stats } = dataset
    let graph =  resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    let countInstancesQuery = `SELECT (COUNT(DISTINCT ?entrypoint) as ?total) ${graph} WHERE { ?entrypoint rdf:type <${entrypoint}> . ${constraints} }`
    // console.log(countInstancesQuery)
    return getData(endpoint, countInstancesQuery, prefixes)
        .then(countInstances => {
            // console.log('countInstances', countInstances)
            const previousConfigMain = getSelectedView(previousConfigs, 'main')
            return new Promise((resolve, reject) => {
                let selectionInstances = Number(countInstances.results.bindings[0].total.value)
                // console.log('selectionInstances', selectionInstances)
                let configs = activateDefaultConfigs(defineConfigs(views, { ...stats, selectionInstances }))
                // console.log('alors ?', configs)
                if (selectionInstances === 1) {
                    resolve([configs, { ...stats, selectionInstances }])
                } else if (selectionInstances > 1) {
                    stats = evaluateSubStats({ ...stats, selectionInstances })
                    // console.log('evaluateSubStats', stats)
                    // for each views, checks which properties ou sets of properties could match and evaluate
                    // console.log('checkFirstValidConfigs', checkFirstValidConfigs(configs, { ...stats, selectionInstances }, dataset))
                    resolve(checkFirstValidConfigs(configs, { ...stats, selectionInstances }, dataset, previousConfigMain))
                } else {
                    reject('No results')
                }
            }) 
                .then(([newConfigs, newStats]) => {
                    // console.log('then ? ',newConfigs, newStats)
                    const configMain = getSelectedView(newConfigs, 'main')
                    const queryMain = makeQuery(entrypoint, configMain, 'main',  { ...dataset, maxDepth: (configMain.id === 'ListAllProps') ? 1 : null })
                    const queryMainUnique = makeQuery(entrypoint, configMain, 'main', { ...dataset, unique: true })
                    let queryTransitionMain = makeTransitionQuery(configMain, dataset, previousConfigMain, previousOptions, 'main')
                    // console.log(queryMain)
                    return Promise.all([
                        getData(endpoint, queryMain, prefixes),
                        dataset.entrypoint === previousConfigs.entrypoint ? getData(endpoint, queryTransitionMain, prefixes) : [],
                        getData(endpoint, queryMainUnique, prefixes)
                    ])
                        .then(([dataMain, dataDeltaMain, uniqueMain]) => { // , coverageMain, coverageAside
                            // console.log('DELTA', dataDeltaMain, newConfigs.entrypoint, previousConfigs.entrypoint)
                            dispatch({
                                type: types.SET_CONFIGS,
                                constraints,
                                main: { ...dataMain },
                                mainDelta: dataDeltaMain,
                                stats,
                                entrypoint,
                                mainDisplayed: configMain.id === 'ListAllProps' ? dataset.stats.selectionInstances : Number(uniqueMain.results.bindings[0].displayed.value),
                                mainConfig: newConfigs.views
                            })
                        })
                })
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
    let { endpoint, prefixes } = dataset
    let totalInstances
    getResources(dataset)
        .then(resources => {
            dataset.entrypoint = resources[0].type
            dataset.totalInstances = resources[0].total
            
            getStats({ ...dataset, stats: [], resources })
                .then(stats => {
                    prefixes = stats.options.prefixes
                    // console.log('ok on a bien reçu les stats', defineConfigs(views, stats))
                    // for each views, checks which properties ou sets of properties could match and evaluate
                    let configs = activateDefaultConfigs(defineConfigs(views, stats))
                    //
                    const configMain = getSelectedView(configs, 'main')
                    if (configMain) {
                        const queryMain = makeQuery(dataset.entrypoint, configMain, 'main',  { ...dataset, maxDepth: (configMain.id === 'ListAllProps') ? 1 : null })
                        
                        const queryMainUnique = makeQuery(dataset.entrypoint, configMain, 'main', { ...dataset, unique: true })
                        //
                        Promise.all([
                            getData(endpoint, queryMain, prefixes),
                            getData(endpoint, queryMainUnique, prefixes)
                        ])
                            .then(([dataMain, uniqueMainPromise]) => { // , coverageMain, coverageAside
                                dispatch({
                                    type: types.SET_RESOURCES,
                                    resources,
                                    stats,
                                    entrypoint: dataset.entrypoint,
                                    totalInstances,
                                    prefixes: stats.options.prefixes,
                                    labels: stats.options.labels,
                                    constraints: '',
                                    mainConfig: configs.views,
                                    main: { ...dataMain },
                                    mainDisplayed: configMain.id === 'ListAllProps' ? dataset.stats.selectionInstances : Number(uniqueMainPromise.results.bindings[0].displayed.value)
                                })
                            })
                    } else {
                        dispatch({
                            type: types.SET_RESOURCES,
                            resources
                        })
                    } 
                })
    
        })
        .catch(error => {
            console.error('Error getting data', error)
        })
}

export const selectResource = (dispatch) => (dataset, views) => {
    let { constraints, endpoint, entrypoint, prefixes, totalInstances } = dataset
    return getStats({ ...dataset, stats: [] })
        .then(stats => {
            prefixes = stats.options.prefixes
            // console.log('ok on a bien reçu les stats', stats, defineConfigs(views, stats))
            // for each views, checks which properties ou sets of properties could match and evaluate
            let configs = activateDefaultConfigs(defineConfigs(views, stats))
            const configMain = getSelectedView(configs, 'main')
            const queryMain = makeQuery(entrypoint, configMain, 'main', { ...dataset, maxDepth: (configMain.id === 'ListAllProps') ? 1 : null })
            const queryMainUnique = makeQuery(entrypoint, configMain, 'main', { ...dataset, unique: true })
           
            return Promise.all([
                getData(endpoint, queryMain, prefixes),
                getData(endpoint, queryMainUnique, prefixes)
            ])
                .then(([dataMain, uniqueMainPromise]) => { // , coverageMain, coverageAside
                    // console.log('ok on a bien reçu les promesses')
                    dispatch({
                        type: types.SET_STATS,
                        stats,
                        entrypoint,
                        totalInstances,
                        prefixes: stats.options.prefixes,
                        labels: stats.options.labels,
                        constraints,
                        mainConfig: configs.views,
                        main: { ...dataMain },
                        mainDisplayed: configMain.id === 'ListAllProps' ? dataset.stats.selectionInstances : Number(uniqueMainPromise.results.bindings[0].displayed.value)
                    })
                })
                
        })
        .catch(error => {
            console.error('Error getting resource', error)
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
    const newQuery = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, maxDepth: (updatedConfig.id === 'ListAllProps') ? 1 : null })
    const queryTransition = makeTransitionQuery(updatedConfig, dataset, prevConfig, dataset, zone)
    const queryUnique = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, unique: true })
    
    return Promise.all([
        getData(endpoint, newQuery, prefixes),
        getData(endpoint, queryTransition, prefixes),
        getData(endpoint, queryUnique, prefixes)
    ])
        .then(([newData, newDelta, newUnique]) => {
            const action = {
                type: types.SET_CONFIGS,
                zone: zone
            }
            action.entrypoint = entrypoint
            action.stats = dataset.stats
            action[zone] = newData
            action[zone + 'Config'] = updatedConfigs
            action[zone + 'Delta'] = newDelta
            action[zone + 'Displayed'] = updatedConfig.id === 'ListAllProps' ? dataset.stats.selectionInstances : Number(newUnique.results.bindings[0].displayed.value)
            dispatch(action)
        })
        .catch(error => {
            console.error('Error getting data after property update', error)
        })
}


export const selectProperty = (dispatch) => (propIndex, path, config, dataset, zone) => {

    // console.log('select property')
    const { endpoint, entrypoint, prefixes } = dataset
    
    const updatedConfig = selectPropertyConfig(config, zone, propIndex, path)
    dispatch({
        type: types.SET_CONFIG,
        zone,
        config: updatedConfig
    })
    const newQuery = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, maxDepth: (updatedConfig.id === 'ListAllProps') ? 1 : null })
    const queryTransition = makeTransitionQuery(updatedConfig, dataset, config, dataset, zone)
    const queryUnique = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, unique: true })
    // const coverageQuery = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, prop1only: true })
    
    Promise.all([
        getData(endpoint, newQuery, prefixes),
        getData(endpoint, queryTransition, prefixes),
        getData(endpoint, queryUnique, prefixes)
    ])
        .then(([newData, newDelta, newUnique]) => {
            // console.log('queryUnique', newUnique.results.bindings[0].displayed.value, queryUnique)
            const action = {
                type: types.SET_DATA,
                zone: zone
            }
            action[zone] = newData
            action[zone + 'Delta'] = newDelta
            action[zone + 'Displayed'] = Number(newUnique.results.bindings[0].displayed.value)
            dispatch(action)
        })
        .catch(error => {
            console.error('Error getting data after property update', error)
        })
}

export const selectView = (dispatch) => (id, zone, selectedConfigs, dataset) => {
    const { endpoint, entrypoint, prefixes } = dataset
    // console.log(selectedConfigs)
    const updatedConfigs = selectViewConfig(id, selectedConfigs)
    const selectedConfig = selectedConfigs.filter(c => c.selected)[0]
    const updatedConfig = updatedConfigs.filter(c => c.selected)[0]
    dispatch({
        type: types.SET_CONFIG,
        zone,
        config: updatedConfig
    })
    const newQuery = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, maxDepth: (updatedConfig.id === 'ListAllProps') ? 1 : null })
    const queryUnique = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, unique: true })
    const queryTransition = makeTransitionQuery(updatedConfig, dataset, selectedConfig, dataset, zone)
    // console.log('newQuery', dataset, newQuery)
    // console.log('queryUnique', queryUnique)
    // console.log('selectedConfig', updatedConfig)
    Promise.all([
        getData(endpoint, newQuery, prefixes),
        (updatedConfig.id !== 'ListAllProps' && selectedConfig.id !== 'ListAllProps') ? getData(endpoint, queryTransition, prefixes) : null,
        getData(endpoint, queryUnique, prefixes)
    ])
        .then(([newData, newDelta, newUnique]) => {
            // console.log(newUnique.results.bindings[0].displayed.value)
            const action = {
                type: types.SET_DATA,
                zone: zone
            }
            action[zone] = newData
            action[zone + 'Delta'] = newDelta
            action[zone + 'Displayed'] = Number(newUnique.results.bindings[0].displayed.value)
            dispatch(action)
        })
        .catch(error => {
            // to do : get back to state previous transition
            console.error('Error getting data after view update', error)
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
    let { endpoint, entrypoint, maxLevel, prefixes } = dataset
    const configMain = getSelectedView(configs, 'main')
    let queryMain = makeQuery(entrypoint, configMain, 'main', { ...dataset, maxDepth: 1 } )
    getData(endpoint, queryMain, prefixes)
        .then(data => {
            dispatch({
                type: types.SET_DETAIL,
                level: 1,
                zone,
                elements: data
            })
            for (let i = 1; i < maxLevel; i ++) {
                queryMain = makeQuery(entrypoint, configMain, 'main', { ...dataset, maxDepth: i } )
                getData(endpoint, queryMain, prefixes)
                    .then(newdata => {
                        dispatch({
                            type: types.SET_DETAIL,
                            level: i,
                            zone,
                            elements: newdata
                        })
                    })
            }
        })   
}
