import fetch from 'node-fetch'
import types from '../constants/ActionTypes'
import { activateDefaultConfigs, defineConfigs, getConfig, getSelectedConfig, selectProperty as selectPropertyConfig, selectView as selectViewConfig } from '../lib/configLib'
import { getData, makeQuery, makeTransitionQuery } from '../lib/queryLib'

export const endTransition = (dispatch) => (zone) => {
    return dispatch({
        zone,
        type: types.END_TRANSITION
    })
}

const getStats = (options) => {
    // console.log(JSON.stringify(options))
    return fetch(('http://localhost:5000/stats'),
        {
            method: 'POST',
            body: JSON.stringify(options),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
    // return rp('http://localhost:5000/stats/' + entrypoint)
}

const getResources = (options) => {
    // console.log(JSON.stringify(options))
    return fetch(('http://localhost:5000/resources'),
        {
            method: 'POST',
            body: JSON.stringify(options),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
}

export const loadData = (dispatch) => (dataset, views, previousConfigs, previousOptions) => {
    // console.log('load Data ', dataset.constraints)
    let { constraints, endpoint, entrypoint, prefixes } = dataset
    let newOptions
    if (constraints !== '') dataset.forceUpdate = false
    getStats({ ...dataset, stats: [] })
        .then(stats => {
            return new Promise((resolve, reject) => {
                if (stats.totalInstances === 0) {
                    reject(new Error('no_results'))
                } else {
                    entrypoint = stats.options.entrypoint
                    prefixes = stats.options.prefixes
                    // console.log('ok on a bien reçu les stats', defineConfigs(views, stats))
                    // for each views, checks which properties ou sets of properties could match and evaluate
                    let configs = activateDefaultConfigs(defineConfigs(views, stats))
                    dispatch({
                        type: types.SET_STATS,
                        stats,
                        entrypoint: stats.options.entrypoint,
                        prefixes: stats.options.prefixes,
                        labels: stats.options.labels,
                        constraints: stats.options.constraints,
                        main: configs[0].views,
                        aside: configs[1].views
                    })
                    newOptions = {
                        ...dataset,
                        entrypoint: stats.options.entrypoint,
                        prefixes: stats.options.prefixes,
                        constraints: stats.options.constraints,
                        selectionInstances: stats.selectionInstances
                    }
                    resolve(configs)
                }
            })
        })
        .then(configs => {
            const configMain = getConfig(configs, 'main')
            const queryMain = makeQuery(entrypoint, configMain, 'main', dataset)
            const queryMainUnique = makeQuery(entrypoint, configMain, 'main', { ...dataset, unique: true })
            // const coverageQueryMain = makeQuery(entrypoint, configMain, 'main', { ...dataset, prop1only: true })
            const configAside = getConfig(configs, 'aside')
            const queryAside = makeQuery(entrypoint, configAside, 'aside', dataset)
            const queryAsideUnique = makeQuery(entrypoint, configAside, 'aside', { ...dataset, unique: true })
            // const coverageQueryAside = makeQuery(entrypoint, configAside, 'aside', { ...dataset, prop1only: true })
            let mainPromise = getData(endpoint, queryMain, prefixes)
            let asidePromise = (queryMain === queryAside) ? null : getData(endpoint, queryAside, prefixes)
            let deltaMainPromise
            let deltaAsidePromise
            let totalMainPromise = (newOptions.selectionInstances === 1) ? { results: { bindings: [ { displayed: { value: 1 } } ] } } : getData(endpoint, queryMainUnique, prefixes)
            let totalAsidePromise = (newOptions.selectionInstances === 1) ? { results: { bindings: [ { displayed: { value: 1 } } ] } } : getData(endpoint, queryAsideUnique, prefixes)
            if (previousConfigs.length > 0) {
                const previousConfigMain = getConfig(previousConfigs, 'main')
                const previousConfigAside = getConfig(previousConfigs, 'aside')
                let queryTransitionMain = makeTransitionQuery(configMain, newOptions, previousConfigMain, previousOptions, 'main')
                deltaMainPromise = getData(endpoint, queryTransitionMain, prefixes)
                let queryTransitionAside = makeTransitionQuery(configAside, newOptions, previousConfigAside, previousOptions, 'aside')
                deltaAsidePromise = (queryTransitionMain === queryTransitionAside) ? null : getData(endpoint, queryTransitionAside, prefixes)
                // console.log('queryTransitionMain', queryTransitionMain)
                // console.log('queryTransitionAside', queryTransitionAside)
            } else {
                deltaMainPromise = {}
                deltaAsidePromise = {}
            }
            // console.log('queryMain', queryMain)
            // console.log('coverageQueryMain', coverageQueryMain)
            // console.log('queryAside', queryAside)
            // console.log('coverageQueryAside', coverageQueryAside)
            return Promise.all([
                mainPromise,
                asidePromise,
                deltaMainPromise,
                deltaAsidePromise,
                totalMainPromise,
                totalAsidePromise
            ])
                .then(([dataMain, dataAside, dataDeltaMain, dataDeltaAside, uniqueMain, uniqueAside]) => { // , coverageMain, coverageAside
                    dispatch({
                        type: types.SET_DATA,
                        main: { ...dataMain },
                        aside: dataAside ? { ...dataAside } : { ...dataMain },
                        mainDelta: dataDeltaMain,
                        asideDelta: dataDeltaAside ? dataDeltaAside : dataDeltaMain,
                        mainDisplayed: Number(uniqueMain.results.bindings[0].displayed.value),
                        asideDisplayed: Number(uniqueAside.results.bindings[0].displayed.value)
                    })
                })
                .catch(error => {
                    console.error('Error getting data main + aside', error)
                })
        })
        .catch(error => {
            if (error === 'no_results') return { statements: [] }
            console.error('Error getting data', error)
        })
}

export const loadDetail = (dispatch) => (dataset, configs, zone) => {
    // console.log('load Detail ', dataset.constraints)
    // would like to use async await rather than imbricated promise but compilation fails
    let { endpoint, entrypoint, maxLevel, prefixes } = dataset
    const configMain = getConfig(configs, 'main')
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

export const loadResources = (dispatch) => (dataset) => {
    return getResources(dataset)
        .then(resources => {
            dispatch({
                type: types.SET_RESOURCES,
                resources
            })
            return resources
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
    const newQuery = makeQuery(entrypoint, updatedConfig, zone, dataset)
    const queryTransition = makeTransitionQuery(updatedConfig, dataset, config, dataset, zone)
    const queryUnique = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, unique: true })
    // const coverageQuery = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, prop1only: true })
    let reset = (propIndex === 0 ||
        (propIndex === 1 && getSelectedConfig(config).properties[1].category !== getSelectedConfig(updatedConfig).properties[1].category && (getSelectedConfig(config).properties[1].category === 'datetime' || getSelectedConfig(updatedConfig).properties[1].category === 'datetime')))
    Promise.all([
        getData(endpoint, newQuery, prefixes),
        getData(endpoint, queryTransition, prefixes),
        getData(endpoint, queryUnique, prefixes)
    ])
        .then(([newData, newDelta, newUnique]) => {
            // console.log('queryUnique', newUnique.results.bindings[0].displayed.value, queryUnique)
            const action = {
                type: types.SET_DATA,
                resetUnitDimensions: (reset) ? 'zone' : null,
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
    const newQuery = makeQuery(entrypoint, updatedConfig, zone, dataset)
    const queryUnique = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, unique: true })
    const queryTransition = makeTransitionQuery(updatedConfig, dataset, selectedConfig, dataset, zone)
    // console.log('queryUnique', queryUnique)
    // console.log('queryTransition', queryTransition)
    Promise.all([
        getData(endpoint, newQuery, prefixes),
        getData(endpoint, queryTransition, prefixes),// ,
        getData(endpoint, queryUnique, prefixes)
    ])
        .then(([newData, newDelta, newUnique]) => {
            // console.log(newUnique.results.bindings[0].displayed.value)
            const action = {
                type: types.SET_DATA,
                resetUnitDimensions: 'zone',
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
