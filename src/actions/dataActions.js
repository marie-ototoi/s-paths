import fetch from 'node-fetch'
import types from '../constants/ActionTypes'
import { activateDefaultConfigs, defineConfigs, getSelectedView, selectProperty as selectPropertyConfig, selectView as selectViewConfig } from '../lib/configLib'
import { getData, makePropQuery, makeQuery, makeTransitionQuery } from '../lib/queryLib'

export const endTransition = (dispatch) => (zone) => {
    return dispatch({
        zone,
        type: types.END_TRANSITION
    })
}

export const loadStats = (dispatch) => (dataset) => {
    getStats(dataset)
}

const getStats = (options) => {
    return fetch((process.env.API + 'stats'),
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
    return fetch((process.env.API + 'resources'),
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

const checkFirstValidConfigs = (configs, stats, dataset) => {
    // console.log(configs)
    let propsToCheck = []
    let matchesToCheck = {}
    let views = configs[0].views
    let double = []
    let newStats
    for (let i = 0; i < views.length; i++) {
        views[i].matches[0].properties.forEach(prop => {
            if (!double.includes(prop.fullPath)) {
                propsToCheck.push(prop)
                double.push(prop)
            }
        })
        matchesToCheck[views[i].id] = views[i].matches[0].properties
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
            let mainSelected
            let asideSelected
            //for (let i = 0; i < newConfigs.length; i++) {
            for (let i = 0; i < newConfigs[0].views.length; i++) {
                let check = matchesToCheck[newConfigs[0].views[i].id]
                if (check) {
                    for (let j = 0; j < newConfigs[0].views[i].matches.length; j++) {
                        let match = newConfigs[0].views[i].matches[j].properties
                        let ok = true
                        match.forEach((p, index) => {
                            if (check[index].fullPath !== p.fullPath) ok = false
                        })
                        if (ok === true) {
                            if (!mainSelected) {
                                mainSelected = true
                                newConfigs[0].views[i].matches[j].selected = true
                                for (let k = 0; k < newConfigs[0].views.length; k++) {
                                    newConfigs[0].views[k].selected = (k === i)
                                }
                                if (newConfigs[0].views.length > 1) j++
                                break
                            } else if (!asideSelected) {
                                asideSelected = true
                                newConfigs[1].views[i].matches[j].selected = true
                                for (let k = 0; k < newConfigs[1].views.length; k++) {
                                    newConfigs[1].views[k].selected = (k === i)
                                }
                                j = newConfigs[0].views.length
                                break
                            }
                        }
                    }
                }
            }
            if (!mainSelected || !asideSelected) {
                for (let i = 0; i < newConfigs[0].views.length; i++) {
                    if (newConfigs[0].views[i].id === 'ListAllPropss') {
                        for (let j = 0; j < newConfigs[0].views[i].matches.length; j++) {
                            let match = newConfigs[0].views[i].matches[j].properties
                            if (match[0].checked) {
                                if (!mainSelected) {
                                    mainSelected = true
                                    newConfigs[0].views[i].matches[j].selected = true
                                    for (let k = 0; k < newConfigs[0].views.length; k++) {
                                        newConfigs[0].views[k].selected = (k === i)
                                    }
                                }
                                if (!asideSelected) {
                                    asideSelected = true
                                    newConfigs[1].views[i].matches[j].selected = true
                                    for (let k = 0; k < newConfigs[1].views.length; k++) {
                                        newConfigs[1].views[k].selected = (k === i)
                                    }
                                }
                                j = newConfigs[0].views.length
                                break
                            }
                        }
                    }
                }
            }
            // console.log('la', newConfigs, newStats)
            return [newConfigs, newStats]
            // if both main and aside send results
            // else start from new config keeping checked config if there is one and call recursive
        })
}

export const loadSelection = (dispatch) => (dataset, views, previousConfigs, previousOptions) => {
    // console.log('load Data ', dataset.constraints)
    let { constraints, endpoint, entrypoint, prefixes, resourceGraph, stats } = dataset
    let countInstancesQuery = `SELECT (COUNT(DISTINCT ?entrypoint) as ?total) FROM <${resourceGraph}> WHERE { ?entrypoint rdf:type <${entrypoint}> . ${constraints} }`
    // console.log(countInstancesQuery)
    return getData(endpoint, countInstancesQuery, prefixes)
        .then(countInstances => {
            console.log(countInstances)
            return new Promise((resolve, reject) => {
                let selectionInstances = Number(countInstances.results.bindings[0].total.value)
                // console.log('selectionInstances', selectionInstances)
                let configs = activateDefaultConfigs(defineConfigs(views, { ...stats, selectionInstances }))
                if (selectionInstances === 1) {
                    resolve([configs, { ...stats, selectionInstances }])
                } else if (selectionInstances > 1) {
                    stats = evaluateSubStats({ ...stats, selectionInstances })
                    // console.log('evaluateSubStats', stats)
                    // for each views, checks which properties ou sets of properties could match and evaluate
                    resolve(checkFirstValidConfigs(configs, { ...stats, selectionInstances }, dataset))
                } else {
                    reject('No results')
                }
            }) 
                .then(([newConfigs, newStats]) => {
                    console.log('then ? ',newConfigs, newStats)
                    const previousConfigMain = getSelectedView(previousConfigs, 'main')
                    const previousConfigAside = getSelectedView(previousConfigs, 'aside')
                    const configMain = getSelectedView(newConfigs, 'main')
                    const queryMain = makeQuery(entrypoint, configMain, 'main',  { ...dataset, maxDepth: (configMain.id === 'ListAllProps') ? 1 : null })
                    const queryMainUnique = makeQuery(entrypoint, configMain, 'main', { ...dataset, unique: true })
                    let queryTransitionMain = makeTransitionQuery(configMain, dataset, previousConfigMain, previousOptions, 'main')
                    const configAside = getSelectedView(newConfigs, 'aside')
                    const queryAside = makeQuery(entrypoint, configAside, 'aside',  { ...dataset, maxDepth: (configAside.id === 'ListAllProps') ? 1 : null })
                    const queryAsideUnique = makeQuery(entrypoint, configAside, 'aside', { ...dataset, unique: true })
                    let queryTransitionAside = makeTransitionQuery(configAside, dataset, previousConfigAside, previousOptions, 'aside')
                    // console.log(queryMain)
                    return Promise.all([
                        getData(endpoint, queryMain, prefixes),
                        (queryMain === queryAside) ? null : getData(endpoint, queryAside, prefixes),
                        getData(endpoint, queryTransitionMain, prefixes),
                        (queryTransitionMain === queryTransitionAside) ? null : getData(endpoint, queryTransitionAside, prefixes),
                        getData(endpoint, queryMainUnique, prefixes),
                        (queryMain === queryAside) ? null : getData(endpoint, queryAsideUnique, prefixes)
                    ])
                        .then(([dataMain, dataAside, dataDeltaMain, dataDeltaAside, uniqueMain, uniqueAside]) => { // , coverageMain, coverageAside
                            dispatch({
                                type: types.SET_CONFIGS,
                                constraints,
                                main: { ...dataMain },
                                aside: dataAside ? { ...dataAside } : { ...dataMain },
                                mainDelta: dataDeltaMain,
                                stats,
                                asideDelta: dataDeltaAside ? dataDeltaAside : dataDeltaMain,
                                mainDisplayed: Number(uniqueMain.results.bindings[0].displayed.value),
                                asideDisplayed: uniqueAside ? Number(uniqueAside.results.bindings[0].displayed.value) : Number(uniqueMain.results.bindings[0].displayed.value),
                                mainConfig: newConfigs[0].views,
                                asideConfig: newConfigs[1].views
                            })
                        })
                })
        })
            
}

export const analyseResources = (dispatch) => (dataset, resources) => {
    console.log('ICI intwe', dataset, resources)
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
            if (resources[0].subgraph) {
                dataset.entrypoint = resources[0].type
                dataset.totalInstances = resources[0].total
                dataset.resourceGraph = resources[0].type
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
                            const configAside = getSelectedView(configs, 'aside')
                            const queryAside = makeQuery(dataset.entrypoint, configAside, 'aside', { ...dataset, maxDepth: (configAside.id === 'ListAllProps') ? 1 : null })
                            
                            const queryMainUnique = makeQuery(dataset.entrypoint, configMain, 'main', { ...dataset, unique: true })
                            const queryAsideUnique = makeQuery(dataset.entrypoint, configAside, 'aside', { ...dataset, unique: true })
                            //
                            Promise.all([
                                getData(endpoint, queryMain, prefixes),
                                (queryMain === queryAside) ? null : getData(endpoint, queryAside, prefixes),
                                getData(endpoint, queryMainUnique, prefixes),
                                (queryMain === queryAside) ? null : getData(endpoint, queryAsideUnique, prefixes)
                            ])
                                .then(([dataMain, dataAside, uniqueMainPromise, uniqueAsidePromise]) => { // , coverageMain, coverageAside
                                    dispatch({
                                        type: types.SET_RESOURCES,
                                        resources,
                                        stats,
                                        entrypoint: dataset.entrypoint,
                                        resourceGraph: dataset.resourceGraph,
                                        totalInstances,
                                        prefixes: stats.options.prefixes,
                                        labels: stats.options.labels,
                                        constraints: '',
                                        mainConfig: configs[0].views,
                                        asideConfig: configs[1].views,
                                        main: { ...dataMain },
                                        aside: dataAside ? { ...dataAside } : { ...dataMain },
                                        mainDisplayed: Number(uniqueMainPromise.results.bindings[0].displayed.value),
                                        asideDisplayed: uniqueAsidePromise ? Number(uniqueAsidePromise.results.bindings[0].displayed.value): Number(uniqueMainPromise.results.bindings[0].displayed.value)
                                    })
                                })
                        } else {
                            dispatch({
                                type: types.SET_RESOURCES,
                                resources
                            })
                        } 
                    })
            } else {
                dispatch({
                    type: types.SET_RESOURCES,
                    resources
                })
            }
        })
        .catch(error => {
            console.error('Error getting data main + aside', error)
        })
}

export const selectResource = (dispatch) => (dataset, views) => {
    let { constraints, endpoint, entrypoint, prefixes, resourceGraph, totalInstances } = dataset
    return getStats({ ...dataset, stats: [] })
        .then(stats => {
            prefixes = stats.options.prefixes
            // console.log('ok on a bien reçu les stats', stats, defineConfigs(views, stats))
            // for each views, checks which properties ou sets of properties could match and evaluate
            let configs = activateDefaultConfigs(defineConfigs(views, stats))
            const configMain = getSelectedView(configs, 'main')
            const queryMain = makeQuery(entrypoint, configMain, 'main', { ...dataset, maxDepth: (configMain.id === 'ListAllProps') ? 1 : null })
            const configAside = getSelectedView(configs, 'aside')
            const queryAside = makeQuery(entrypoint, configAside, 'aside', { ...dataset, maxDepth: (configAside.id === 'ListAllProps') ? 1 : null })
            const queryMainUnique = makeQuery(entrypoint, configMain, 'main', { ...dataset, unique: true })
            const queryAsideUnique = makeQuery(entrypoint, configAside, 'aside', { ...dataset, unique: true })
            // const coverageQueryAside = makeQuery(entrypoint, configAside, 'aside', { ...dataset, prop1only: true })
       
            return Promise.all([
                getData(endpoint, queryMain, prefixes),
                (queryMain === queryAside) ? null : getData(endpoint, queryAside, prefixes),
                getData(endpoint, queryMainUnique, prefixes),
                (queryMain === queryAside) ? null : getData(endpoint, queryAsideUnique, prefixes)
            ])
                .then(([dataMain, dataAside, uniqueMainPromise, uniqueAsidePromise]) => { // , coverageMain, coverageAside
                    // console.log('ok on a bien reçu les promesses')
                    dispatch({
                        type: types.SET_STATS,
                        stats,
                        entrypoint,
                        resourceGraph,
                        totalInstances,
                        prefixes: stats.options.prefixes,
                        labels: stats.options.labels,
                        constraints,
                        mainConfig: configs[0].views,
                        asideConfig: configs[1].views,
                        main: { ...dataMain },
                        aside: dataAside ? { ...dataAside } : { ...dataMain },
                        mainDisplayed: Number(uniqueMainPromise.results.bindings[0].displayed.value),
                        asideDisplayed: uniqueAsidePromise ? Number(uniqueAsidePromise.results.bindings[0].displayed.value): Number(uniqueMainPromise.results.bindings[0].displayed.value)
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
            matches: config.matches.map(match => {
                return {
                    ...match,
                    selected: index === viewIndex && match.properties.reduce((acc, cur, i) => {
                        if (cur.path !== props[i]) acc = false
                        return acc
                    }, true)
                }
            })
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
            action[zone] = newData
            action[zone + 'Config'] = updatedConfigs
            action[zone + 'Delta'] = newDelta
            action[zone + 'Displayed'] = Number(newUnique.results.bindings[0].displayed.value)
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

export const setUnitDimensions = (dispatch) => (dimensions, zone, configId, role, setTarget) => {
    // console.log(dimensions, zone, configId, role)
    dispatch({
        type: types.SET_UNIT_DIMENSIONS,
        unitDimensions: dimensions,
        configId,
        zone,
        role
    })
    if (setTarget) {
        dispatch({
            type: types.SET_UNIT_DIMENSIONS,
            unitDimensions: dimensions,
            configId,
            zone,
            role: 'target'
        })
    }
}
