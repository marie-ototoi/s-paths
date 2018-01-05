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

const exploreSelection = (dispatch) => (selection, zone, dataset, views) => {
    // build query for selection

    // constraints = concat each selected element query
    /* 
    select distinct ?entrypoint 
    FROM <http://localhost:8890/nobel> 
    where { 
    ?entrypoint rdf:type <http://data.nobelprize.org/terms/Laureate> . 
    FILTER regex(?entrypoint, "http://data.nobelprize.org/resource/laureate/1$|http://data.nobelprize.org/resource/laureate/10$", "i") 
    } */
    // load data
    // undo : get last configs do not load stats again / 
    // how to synchronize all reducers for undo ? dataset, data config
    // forget about selections when change data
}

const selectProperty = (dispatch) => (config, zone, propIndex, path, dataset) => {
    const { endpoint, entrypoint, prefixes } = dataset
    const updatedConfig = configLib.selectProperty(config, propIndex, path)
    dispatch({
        type: types.SET_CONFIG,
        config: updatedConfig,
        zone
    })
    const newQuery = queryLib.makeQuery(entrypoint, updatedConfig, dataset)
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

const loadData = (dispatch) => (dataset, views) => {
    let { endpoint, entrypoint, prefixes } = dataset
    getStats(dataset)
        .then(stats => {
            if (stats.totalInstances === 0) return new Promise((resolve, reject) => reject(new Error('No such entity in the endpoint')))
            dispatch({
                type: types.SET_STATS,
                stats
            })
            dispatch({
                type: types.SET_PREFIXED_ENTRYPOINT,
                entrypoint: stats.options.entrypoint,
                prefixes: stats.options.prefixes,
                labels: stats.options.labels
            })
            entrypoint = stats.options.entrypoint
            prefixes = stats.options.prefixes
            // console.log('ici ?', stats.statements)
            // for each views, checks which properties ou sets of properties could match and evaluate
            let configs = configLib.activateDefaultConfigs(configLib.defineConfigs(views, stats))
            dispatch({
                type: types.SET_CONFIGS,
                configs
            })
            return configs
        })
        .then(configs => {
            const configMain = configLib.getConfigs(configs, 'main')
            const queryMain = queryLib.makeQuery(entrypoint, configMain, dataset)
            const configAside = configLib.getConfigs(configs, 'aside')
            const queryAside = queryLib.makeQuery(entrypoint, configAside, dataset)
            // console.log('queryMain', queryMain)
            // console.log('queryaside', queryAside)
            /* return Promise.all([
                new Promise((resolve) => resolve(stats.load('Timeline'))),
                new Promise((resolve) => resolve(stats.load('HeatMap')))
            ]) */
            return Promise.all([
                queryLib.getData(endpoint, queryMain, prefixes),
                queryLib.getData(endpoint, queryAside, prefixes)
            ])
                .then(([dataMain, dataAside]) => {
                    // console.log(dataMain, dataAside)
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
exports.exploreSelection = exploreSelection
exports.loadData = loadData
exports.receiveStats = receiveStats
exports.selectProperty = selectProperty
