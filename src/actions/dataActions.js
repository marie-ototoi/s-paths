import fetch from 'node-fetch'
import rp from 'request-promise'
import * as types from '../constants/ActionTypes'
import stats from '../../test/data/nobel'
import config from '../lib/configLib'
import data from '../lib/dataLib'
import queryLib from '../lib/queryLib'

const getStats = (options) => {
    console.log(JSON.stringify(options))
    return fetch(('http://localhost:5000/stats/' + options.entrypoint),
        {
            method: 'POST',
            body: JSON.stringify(options),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((resp) => resp.json())
    // return rp('http://localhost:5000/stats/' + entrypoint)
}

const init = (dispatch) => () => {
    return dispatch({
        type: types.INIT
    })
}

const receiveStats = (dispatch) => (stats) => {
    return dispatch({
        type: types.SET_STATS,
        stats
    })
}

const selectProperty = (dispatch) => (configs, zone, propIndex, path, dataset) => {
    console.log('|||||||||||', config.selectProperty(configs, zone, propIndex, path))
    const { endpoint, entrypoint, prefixes } = dataset
    dispatch({
        type: types.SET_CONFIGS,
        configs: config.selectProperty(configs, zone, propIndex, path)
    })
    const newConfig = config.getSelectedConfig(configs, zone)
    const newQuery = queryLib.makeQuery(entrypoint, newConfig)
    queryLib.getData(endpoint, newQuery, prefixes)
        .then((newData) => {
            dispatch({
                type: types.SET_DATA,
                statements: {
                    ...newData,
                    results: {
                        bindings: newData.results.bindings
                    }
                },
                zone
            })
        })
        .catch(error => {
            console.error('Error getting data after property update', error)
        })
}

const setEntrypoint = (dispatch) => (endpoint, entrypoint, constraints = '') => {
    return dispatch({
        type: types.SET_ENTRYPOINT,
        endpoint,
        entrypoint,
        constraints
    })
}

const loadData = (dispatch) => (dataset, views) => {
    const { endpoint, entrypoint, prefixes } = dataset
    getStats(dataset)
        .then(stats => {
            dispatch({
                type: types.SET_STATS,
                stats
            })
            // for each views, checks which properties ou sets of properties could match and evaluate
            let configs = config.activateDefaultConfigs(config.getConfigs(views, stats))
            dispatch({
                type: types.SET_CONFIGS,
                configs
            })
            return new Promise((resolve) => resolve(configs))
        })
        .then(configs => {
            const configMain = config.getSelectedConfig(configs, 'main')
            const queryMain = queryLib.makeQuery(entrypoint, configMain)
            const configAside = config.getSelectedConfig(configs, 'aside')
            const queryAside = queryLib.makeQuery(entrypoint, configAside)
            /* return Promise.all([
                new Promise((resolve) => resolve(stats.load('Timeline'))),
                new Promise((resolve) => resolve(stats.load('HeatMap')))
            ]) */
            return Promise.all([
                queryLib.getData(endpoint, queryMain, prefixes),
                queryLib.getData(endpoint, queryAside, prefixes)
            ])
                .then(([dataMain, dataAside]) => {
                    dispatch({
                        type: types.SET_DATA,
                        statements: {
                            ...dataMain,
                            results: {
                                bindings: dataMain.results.bindings
                            }
                        },
                        zone: 'main'
                    })
                    dispatch({
                        type: types.SET_DATA,
                        statements: {
                            ...dataAside,
                            results: {
                                bindings: dataAside.results.bindings
                            }
                        },
                        zone: 'aside'
                    })
                })
        })
        .catch(error => {
            console.error('Error getting data', error)
        })
}

exports.init = init
exports.loadData = loadData
exports.receiveStats = receiveStats
exports.selectProperty = selectProperty
exports.setEntrypoint = setEntrypoint
