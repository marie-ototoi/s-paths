import * as types from '../constants/ActionTypes'
import stats from '../../test/data/nobel'
import configViews from '../lib/config'
import data from '../lib/data'
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
            let configs = configViews.activateDefaultConfigs(configViews.getConfigs(views, stats))
            dispatch({
                type: types.SET_CONFIGS,
                configs
            })
            return new Promise((resolve) => resolve(configs))
        })
        .then(configs => {
            const configMain = configViews.getSelectedConfig(configs, 'main')
            const queryMain =  data.makeQuery(entrypoint, configMain)
            const configAside = configViews.getSelectedConfig(configs, 'aside')
            const queryAside =  data.makeQuery(entrypoint, configAside)
            
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
exports.setEntrypoint = setEntrypoint
