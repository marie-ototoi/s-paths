import * as types from '../constants/ActionTypes'
import stats from '../../test/data/nobel'
import config from '../lib/configLib'
import data from '../lib/dataLib'
import {SparqlClient, SPARQL} from 'sparql-client-2'

const getStats = (endpoint, entrypoint) => {
    return new Promise((resolve, reject) => {
        resolve(stats.explore())
    })
}

const getData = (endpoint, query, prefixes) => {
    const client = new SparqlClient(endpoint)
        .registerCommon('rdf', 'rdfs')
        .register(prefixes)
    return client
        .query(query)
        .execute()
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

const setEntrypoint = (dispatch) => (endpoint, entrypoint, constraints = '') => {
    return dispatch({
        type: types.SET_ENTRYPOINT,
        endpoint,
        entryPoint,
        constraints
    })
}

const loadData = (dispatch) => (dataset, views) => {
    const {endpoint, entrypoint, prefixes} = dataset
    getStats(endpoint, entrypoint)
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
            const queryMain = data.makeQuery(entrypoint, configMain)
            const configAside = config.getSelectedConfig(configs, 'aside')
            const queryAside = data.makeQuery(entrypoint, configAside)
            /* return Promise.all([
                new Promise((resolve) => resolve(stats.load('Timeline'))),
                new Promise((resolve) => resolve(stats.load('HeatMap')))
            ]) */
            return Promise.all([
                getData(endpoint, queryMain, prefixes),
                getData(endpoint, queryAside, prefixes)
            ])
                .then(([dataMain, dataAside]) => {
                    dispatch({
                        type: types.SET_DATA,
                        statements: {
                            ...dataMain,
                            results: {
                                bindings: dataMain.results.bindings /* .sort((a, b) => a.prop1.value - b.prop1.value) */ 
                            }
                        },
                        zone: 'main'
                    })
                    dispatch({
                        type: types.SET_DATA,
                        statements: {
                            ...dataAside,
                            results: {
                                bindings: dataAside.results.bindings /* .sort((a, b) => a.prop1.value - b.prop1.value) */
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
exports.setEntrypoint = setEntrypoint
