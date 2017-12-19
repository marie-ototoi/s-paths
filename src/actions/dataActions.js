import fetch from 'node-fetch'
import rp from 'request-promise'
import * as types from '../constants/ActionTypes'
import stats from '../../test/data/nobel'
import configLib from '../lib/configLib'
import dataLib from '../lib/dataLib'
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

const selectProperty = (dispatch) => (config, zone, propIndex, path, dataset) => {
    const { endpoint, entrypoint, prefixes } = dataset
    const updatedConfig = configLib.selectProperty(config, propIndex, path)
    dispatch({
        type: types.SET_CONFIG,
        config: updatedConfig,
        zone
    })
    const newConfig = configLib.getSelectedConfig(updatedConfig)
    const newQuery = queryLib.makeQuery(entrypoint, newConfig)
    // console.log('new data', newQuery)
    queryLib.getData(endpoint, newQuery, prefixes)
        .then((newData) => {
            // console.log('new data', newData)
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
            dispatch({
                type: types.RESET_SELECTION,
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
            if (stats.total_instances === 0) return new Promise((resolve, reject) => reject('No such entity in the endpoint'))
            dispatch({
                type: types.SET_STATS,
                stats
            })
            // for each views, checks which properties ou sets of properties could match and evaluate
            let configs = configLib.activateDefaultConfigs(configLib.defineConfigs(views, stats))
            dispatch({
                type: types.SET_CONFIGS,
                configs
            })
            return new Promise((resolve) => resolve(configs))
        })
        .then(configs => {
            const configMain = configLib.getSelectedConfig(configLib.getConfigs(configs, 'main'))
            const queryMain = queryLib.makeQuery(entrypoint, configMain)
            const configAside = configLib.getSelectedConfig(configLib.getConfigs(configs, 'aside'))
            const queryAside = queryLib.makeQuery(entrypoint, configAside)
            console.log('queryMain', queryMain)
            console.log('queryaside', queryAside)
            /* return Promise.all([
                new Promise((resolve) => resolve(stats.load('Timeline'))),
                new Promise((resolve) => resolve(stats.load('HeatMap')))
            ]) */
            return Promise.all([
                queryLib.getData(endpoint, queryMain, prefixes),
                queryLib.getData(endpoint, queryAside, prefixes)
            ])
                .then(([dataMain, dataAside]) => {
                    console.log(dataMain, dataAside)
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
