import fetch from 'node-fetch'
import * as types from '../constants/ActionTypes'
import { activateDefaultConfigs, defineConfigs, getConfigs, selectProperty as selectPropertyConfig, selectView as selectViewConfig } from '../lib/configLib'
import { getData, makeQuery, makeTransitionQuery } from '../lib/queryLib'

const getStats = (options) => {
    // console.log(JSON.stringify(options))
    return fetch(('http://localhost:5000/stats/'),
        {
            method: 'POST',
            body: JSON.stringify(options),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
    // return rp('http://localhost:5000/stats/' + entrypoint)
}

const receiveStats = (dispatch) => (stats) => {
    return dispatch({
        type: types.SET_STATS,
        stats
    })
}

const endTransition = (dispatch) => (zone) => {
    return dispatch({
        zone,
        type: types.END_TRANSITION
    })
}

const selectView = (dispatch) => (id, zone, configs, dataset) => {
    const { endpoint, entrypoint, prefixes } = dataset
    const updatedConfigs = selectViewConfig(id, zone, configs)
    dispatch({
        type: types.SET_CONFIGS,
        configs: updatedConfigs
    })
    const selectedConfig = getConfigs(configs, zone)
    const updatedConfig = getConfigs(updatedConfigs, zone)
    const newQuery = makeQuery(entrypoint, updatedConfig, zone, dataset)
    const queryTransition = makeTransitionQuery(updatedConfig, dataset, selectedConfig, dataset, zone)
    const coverageQuery = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, prop1only: true })
    // console.log('test', queryTransition)
    Promise.all([
        getData(endpoint, newQuery, prefixes),
        getData(endpoint, queryTransition, prefixes),
        getData(endpoint, coverageQuery, prefixes)
    ])
        .then(([newData, newDelta, newCoverage]) => {
            // console.log(newData, newDelta)
            const action = {
                type: types.SET_DATA,
                resetUnitDimensions: 'zone',
                zone: zone
            }
            action[zone] = newData
            action[zone + 'Delta'] = newDelta
            action[zone + 'Coverage'] = newCoverage
            dispatch(action)
        })
        .catch(error => {
            console.error('Error getting data after view update', error)
        })
}

const selectProperty = (dispatch) => (propIndex, path, config, dataset, zone) => {
    // console.log('select property')
    const { endpoint, entrypoint, prefixes } = dataset
    const updatedConfig = selectPropertyConfig(config, zone, propIndex, path)
    dispatch({
        type: types.SET_CONFIG,
        config: updatedConfig
    })
    const newQuery = makeQuery(entrypoint, updatedConfig, zone, dataset)
    const queryTransition = makeTransitionQuery(updatedConfig, dataset, config, dataset, zone)
    const coverageQuery = makeQuery(entrypoint, updatedConfig, zone, { ...dataset, prop1only: true })
    Promise.all([
        getData(endpoint, newQuery, prefixes),
        getData(endpoint, queryTransition, prefixes),
        (propIndex === 0) ? getData(endpoint, coverageQuery, prefixes) : {}
    ])
        .then(([newData, newDelta, newCoverage]) => {
            // console.log(newData, newDelta)
            const action = {
                type: types.SET_DATA,
                resetUnitDimensions: (propIndex === 0) ? 'zone' : null,
                zone: zone
            }
            action[zone] = newData
            action[zone + 'Delta'] = newDelta
            action[zone + 'Coverage'] = newCoverage
            dispatch(action)
        })
        .catch(error => {
            console.error('Error getting data after property update', error)
        })
}

const setUnitDimensions = (dispatch) => (dimensions, zone, configId, role, setTarget) => {
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

const loadData = (dispatch) => (dataset, views, previousConfigs, previousOptions) => {
    // console.log('load Data ', dataset.constraints)
    let { endpoint, entrypoint, prefixes } = dataset
    let newOptions
    getStats(dataset)
        .then(stats => {
            return new Promise((resolve, reject) => {
                if (stats.totalInstances === 0) {
                    reject(new Error('no_results'))
                } else {
                    entrypoint = stats.options.entrypoint
                    prefixes = stats.options.prefixes
                    // console.log(configLib.defineConfigs(views, stats))
                    // for each views, checks which properties ou sets of properties could match and evaluate
                    let configs = activateDefaultConfigs(defineConfigs(views, stats))
                    // console.log(configs)
                    dispatch({
                        type: types.SET_STATS,
                        stats,
                        entrypoint: stats.options.entrypoint,
                        prefixes: stats.options.prefixes,
                        labels: stats.options.labels,
                        constraints: stats.options.constraints,
                        configs
                    })
                    newOptions = {
                        ...dataset,
                        entrypoint: stats.options.entrypoint,
                        prefixes: stats.options.prefixes,
                        constraints: stats.options.constraints
                    }
                    resolve(configs)
                }
            })
        })
        .then(configs => {
            // console.log(configs)
            const configMain = getConfigs(configs, 'main')
            const queryMain = makeQuery(entrypoint, configMain, 'main', dataset)
            const coverageQueryMain = makeQuery(entrypoint, configMain, 'main', { ...dataset, prop1only: true })
            const configAside = getConfigs(configs, 'aside')
            const queryAside = makeQuery(entrypoint, configAside, 'aside', dataset)
            const coverageQueryAside = makeQuery(entrypoint, configAside, 'aside', { ...dataset, prop1only: true })
            let deltaMain
            let deltaAside
            if (previousConfigs.length > 0) {
                const previousConfigMain = getConfigs(previousConfigs, 'main')
                const previousConfigAside = getConfigs(previousConfigs, 'aside')
                let queryTransitionMain = makeTransitionQuery(configMain, newOptions, previousConfigMain, previousOptions, 'main')
                deltaMain = getData(endpoint, queryTransitionMain, prefixes)
                let queryTransitionAside = makeTransitionQuery(configAside, newOptions, previousConfigAside, previousOptions, 'aside')
                deltaAside = getData(endpoint, queryTransitionAside, prefixes)
            } else {
                deltaMain = {}
                deltaAside = {}
            }
            // console.log('queryMain', queryMain)
            // console.log('queryaside', queryAside)
            return Promise.all([
                getData(endpoint, queryMain, prefixes),
                getData(endpoint, queryAside, prefixes),
                deltaMain,
                deltaAside,
                getData(endpoint, coverageQueryMain, prefixes),
                getData(endpoint, coverageQueryAside, prefixes),
            ])
                .then(([dataMain, dataAside, dataDeltaMain, dataDeltaAside, coverageMain, coverageAside]) => {
                    // console.log(dataMain, dataAside)
                    // console.log('dataTransitionMain', dataTransitionMain)
                    // console.log('dataTransitionAside', dataTransitionAside)
                    dispatch({
                        type: types.SET_DATA,
                        main: { ...dataMain },
                        aside: { ...dataAside },
                        mainDelta: dataDeltaMain,
                        asideDelta: dataDeltaAside,
                        mainCoverage: coverageMain,
                        asideCoverage: coverageAside,
                        resetUnitDimensions: 'all'
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

exports.endTransition = endTransition
exports.loadData = loadData
exports.receiveStats = receiveStats
exports.selectProperty = selectProperty
exports.selectView = selectView
exports.setUnitDimensions = setUnitDimensions
