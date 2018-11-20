import fetch from 'node-fetch'
import types from '../constants/ActionTypes'
import { activateDefaultConfigs, defineConfigs, getSelectedView, scoreProp } from '../lib/configLib'
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
    return fetch((`${process.env.API || '/'}stats/analyse`),
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

const checkStats = (options) => {
    return fetch((`${process.env.API || '/'}stats/check`),
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


export const countPaths = (dispatch) => (dataset) => {
    return fetch((`${process.env.API || '/'}stats/count`),
        {
            method: 'POST',
            body: JSON.stringify(dataset),
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
        // console.log(propQuery)
        return getData(dataset.endpoint, propQuery, dataset.prefixes)
    }))
        .then((results) => {
            // mix stats and results
            // add checked property

            let checked = {}
            statements.forEach((prop, index) => {
                let countStat = results[index].results.bindings[0]
                // console.log('countStat', countStat.total.value, countStat.unique.value, countStat.coverage.value, selectionInstances)
                checked[prop.path] = {
                    checked: true,
                    total: Number(countStat.total.value),
                    unique: Number(countStat.unique.value),
                    coverage: Number(countStat.coverage.value) * 100 / selectionInstances
                }
            })
            return checked
        })
}

const checkStatsConfigs = (configs, selectedView, selectionInstances, totalInstances, dataset, checkDict) => {

    let index = 0
    let endList = 0
    let alreadyPlanned = []
    let propsToCheck = []
    while(propsToCheck.length < 20 && endList < configs.views.length) {
        configs.views.forEach(view => {
            view.propList.forEach(list => {
                if (index < list.length && !list[index].checked && !checkDict[list[index].path] && !alreadyPlanned.includes(list[index].path)) propsToCheck.push(list[index])
                if (index === list.length -1) endList ++ 
            })
        })
        index ++ 
    }
    // console.log(propsToCheck)
    return checkStatements(propsToCheck, selectionInstances, dataset)
        .then(checkedStatements => {
            console.log(checkedStatements)
            return {
                ...configs,
                views: configs.views.map(view => {
                    let newview = {
                        ...view,
                        propList: view.propList.map((list, iL ) => {
                            return list.map((prop, i) => {
                                if (checkDict[prop.path]) {
                                    if (checkDict[prop.path].total > 0) {
                                        let newprop = {
                                            ...prop,
                                            index: i,
                                            checked: true,
                                            total: checkDict[prop.path].total,
                                            coverage: checkDict[prop.path].coverage, 
                                        }
                                        //console.log(scoreProp(newprop, view.constraints[iL][0], dataset.rankPropFactors, dataset.propertyPreferences))
                                        return {
                                            ...newprop,
                                            score: (i > index) ? 0.1 : scoreProp(newprop, view.constraints[iL][0], dataset.rankPropFactors, dataset.propertyPreferences)
                                        }
                                    }
                                } else if (checkedStatements[prop.path]) {
                                    if (checkedStatements[prop.path].total > 0) {
                                        let newprop = {
                                            ...prop,
                                            index: i,
                                            checked: true,
                                            total: checkedStatements[prop.path].total,
                                            coverage: checkedStatements[prop.path].coverage,
                                            unique: checkedStatements[prop.path].unique,                                    } 
                                        return {
                                            ...newprop,                                        
                                            score: i > index ? 0.1 : scoreProp(newprop, view.constraints[iL][0], dataset.rankPropFactors, dataset.propertyPreferences)
                                        }
                                    }
                                } else {
                                    return {
                                        ...prop,
                                        index: i
                                    }
                                }
                            }).filter(p => p).sort((a,b) => {
                                return (b.index < index ? 100000 : -100000 + b.score) - (a.index < index ? 100000 : -100000 + a.score)
                            })
                        })
                    }
                    // console.log(newview)
                    let alreadyInMatch = []
                    let valid = true
                    let selectedMatch = newview.propList.map((list, listIndex) => {
                        if (list.length > 0) {
                            let index = 0
                            while (alreadyInMatch.includes(list[index].path) && list[index + 1]){
                                index ++
                            }
                            if (!alreadyInMatch.includes(list[index].path)) {
                                alreadyInMatch.push(list[index].path)
                                return list[index]
                            }
                        }
                    })
                    selectedMatch.forEach(m => {if (!m) valid = false})
                    if (valid) {
                        return {
                            ...newview,
                            selected: selectedView.id === newview.id,
                            selectedMatch : selectedView.id === newview.id ? selectedView.selectedMatch : { properties: selectedMatch }
                        }
                    }
                }).filter(v => v)
            }
        })
}


const checkStatementGap = (prop, checkedProp) => {
    // console.log(checkedProp.coverage, prop.coverage, checkedProp.coverage / prop.coverage)
    // check if the new coverage is not less than 80% of the estimated one
    return checkedProp.coverage / prop.coverage > 0.8
}

const checkConfig =  (config, dataset, zone) => {
    // check if the combination of props covers at leat some entities
    let { endpoint, entrypoint, prefixes } = dataset
    let queryUnique = makeQuery(entrypoint, config, zone, { ...dataset, unique: true })
    return getData(endpoint, queryUnique, prefixes)
        .then(nb => {
            return (nb.results.bindings[0].displayed.value > 0)
        })    
}


const checkFirstValidConfig = async (configs, stats, dataset, zone, evaluation) => {
    let { selectionInstances } = stats
    let checkDict = {}
    // 1 - check if first config ok
    let firstConfig = configs.views[0]
    let check_ok = true 
    let checkedProps = await checkStatements(firstConfig.selectedMatch.properties, selectionInstances, dataset)
    // console.log(checkedProps)
    for (let key in checkedProps) {
        checkDict[key] = checkedProps[key]
    }
    //ici il faudrait verifier si ça correspond tjs aux contraintes de la vue
    //
    // console.log(checkDict)
    // console.log(check_ok)
    for (let i = 0; i < firstConfig.selectedMatch.properties.length; i ++) {
        let propIndex = firstConfig.propList[i].findIndex(p => p.path === firstConfig.selectedMatch.properties[i].path)
        // if no entities for this prop
        if (checkDict[firstConfig.propList[i][propIndex].path].total === 0) {
            firstConfig.propList[i].splice(propIndex, 1)
            check_ok = false
            break
        }
        // else if gap with prediction too big
        if (!checkStatementGap(firstConfig.selectedMatch.properties[i], checkDict[firstConfig.selectedMatch.properties[i].path])) {
            check_ok = false
            break
        }
    }
    // console.log(check_ok)
    // if no entities in the selection for the conjunction of props
    if (check_ok && firstConfig.selectedMatch.length > 1) {
        check_ok = await checkConfig(firstConfig, dataset, zone)
    }
    
    // if the estimated best config is valid
    if (check_ok) {
        // send it back together with the dictionnary of verified statements
        return { views : [{...firstConfig, selected: true, propList: firstConfig.selectedMatch.properties.map(p => [p])}], checkDict }
    }
    
    // console.log(check_ok)
    // 2 - else, find a view with one prop only
    let singlePropView = configs.views.find(v => v.constraints.length === 1)
    let index = 0
    let prop = singlePropView.propList[0][index]
    let checkProp = checkDict[prop.path] ? checkDict[prop.path] : await checkStatements([prop], selectionInstances, dataset)
    for (let key in checkProp) {
        checkDict[key] = checkProp[key]
    }
    let valid = checkStatementGap(prop, checkProp[prop.path])
    let propList = []
    while (index < singlePropView.propList[0].length && !valid) {
        index ++
        prop = singlePropView.propList[0][index]
        if (checkDict[prop.path]) {
            checkProp = checkDict[prop.path]
        } else {
            checkProp = await checkStatements([prop], selectionInstances, dataset)
            for (let key in checkProp) {
                checkDict[key] = checkProp[key]
            }
        }
        if (checkDict[prop.path].total > 0) propList.push({
            ...prop,
            total: checkDict[prop.path].total,
            unique: checkDict[prop.path].unique,
            coverage: checkDict[prop.path].coverage
        })
        valid = checkStatementGap(prop, checkDict[prop.path])
    }
    propList = propList.sort((a, b) => b.coverage - a.coverage)
    if (valid || propList.length > 0) {
        // send the config back together with the dictionnary of verified statements
        return { views : [{...singlePropView, selected: true, propList, selectedMatch: { properties: [propList[0]] }}], checkDict }
    }
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
    // console.log('load resources', graphs)
    let totalInstances
    return getResources(dataset)
        .then(resources => {
           
            if(resources.length > 0) { 
                dataset.entrypoint = resources[0].type
                dataset.totalInstances = resources[0].total
                // console.log('resources', resources) 
                return getStats({ ...dataset, stats: [], resources, totalInstances: resources[0].total })
                    .then(stats => {
                        // console.log('load resources', stats)
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
    // cancelPromises = true
    let token = Math.random * Math.random * 1000
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
                                configs = defineConfigs(views, { ...stats, selectionInstances }, dataset)
                                // console.log(configs)
                                // check evaluation
                                checkFirstValidConfig(configs, { ...stats, selectionInstances }, dataset, 'main', true)
                                    .then(checked =>{
                                        // console.log(checked)
                                        //checkAllStats({ ...stats, selectionInstances }, dataset)
                                        new Promise(resolve =>
                                            window.setTimeout(() => resolve(), 5000)    
                                        ).then(ok =>{
                                            
                                            checkStatsConfigs(configs, checked.views[0], selectionInstances, totalInstances, dataset, checked.checkDict)
                                                .then((newconfigs) => {
                                                    // console.log('end check',newconfigs)
                                                    dispatch({
                                                        type: types.UPDATE_CONFIGS,
                                                        configs: newconfigs,
                                                        token
                                                    })
                                                }) 
                                        })                             
                                        resolve(checked)
                                    })
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
                                    token,
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
    // console.log(newQuery)
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
