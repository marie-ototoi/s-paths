import fetch from 'node-fetch'
import * as types from '../constants/ActionTypes'
// import stats from '../../test/data/nobel'
import configLib from '../lib/configLib'
// import dataLib from '../lib/dataLib'
import queryLib from '../lib/queryLib'

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

const selectProperty = (dispatch) => (config, zone, propIndex, path, dataset) => {
    // console.log('select property')
    const { endpoint, entrypoint, prefixes } = dataset
    const updatedConfig = configLib.selectProperty(config, zone, propIndex, path)
    dispatch({
        type: types.SET_CONFIG,
        config: updatedConfig,
        zone
    })

    const newQuery = queryLib.makeQuery(entrypoint, updatedConfig, zone, dataset)
    // console.log('new data', newQuery)
    queryLib.getData(endpoint, newQuery, prefixes)
        .then((newData) => {
            const action = {
                type: types.SET_DATA
            }
            action[zone] = newData
            dispatch(action)
        })
        .catch(error => {
            console.error('Error getting data after property update', error)
        })
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
                    let configs = configLib.activateDefaultConfigs(configLib.defineConfigs(views, stats))
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
            const configMain = configLib.getConfigs(configs, 'main')
            const queryMain = queryLib.makeQuery(entrypoint, configMain, 'main', dataset)
            const configAside = configLib.getConfigs(configs, 'aside')
            const queryAside = queryLib.makeQuery(entrypoint, configAside, 'aside', dataset)
            let deltaMain
            let deltaAside
            if (previousConfigs.length > 0) {
                const previousConfigMain = configLib.getConfigs(previousConfigs, 'main')
                const previousConfigAside = configLib.getConfigs(previousConfigs, 'aside')
                let queryTransitionMain = queryLib.makeTransitionQuery(configMain, newOptions, previousConfigMain, previousOptions, 'main')
                deltaMain = queryLib.getData(endpoint, queryTransitionMain, prefixes)
                let queryTransitionAside = queryLib.makeTransitionQuery(configAside, newOptions, previousConfigAside, previousOptions, 'aside')
                deltaAside = queryLib.getData(endpoint, queryTransitionAside, prefixes)
            } else {
                deltaMain = []
                deltaAside = []
            }
            // console.log('queryMain', queryMain)
            // console.log('queryaside', queryAside)
            return Promise.all([
                queryLib.getData(endpoint, queryMain, prefixes),
                queryLib.getData(endpoint, queryAside, prefixes),
                deltaMain,
                deltaAside
            ])
                .then(([dataMain, dataAside, dataDeltaMain, dataDeltaAside]) => {
                    // console.log(dataMain, dataAside)
                    // console.log('dataTransitionMain', dataTransitionMain)
                    // console.log('dataTransitionAside', dataTransitionAside)
                    dispatch({
                        type: types.SET_DATA,
                        main: { ...dataMain },
                        aside: { ...dataAside },
                        deltaMain: dataDeltaMain,
                        deltaAside: dataDeltaAside
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
