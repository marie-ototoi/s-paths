import * as types from '../constants/ActionTypes'
import data from '../../test/data/nobel'
import configViews from '../lib/config'
// import {SparqlClient, SPARQL} from 'sparql-client-2'

const getStats = (endpoint, entrypoint) => {
    return new Promise((resolve, reject) => {
        resolve(data.explore())
    })
}

const makeQuery = (entrypoint, constraint) => {
    let query = `SELECT DISTINCT ?entrypoint 
    WHERE { ?entrypoint type> ${entrypoint} . ${constraint}}`
    //console.log(query)
    return query
}

const getData = (endpoint, query) => {
    return new Promise((resolve, reject) => {
        resolve(data.load())
    })
    /*const client = new SparqlClient(endpoint)
        .register({
            rdf: '<http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        })
    return client
        .query(query + '&output=json')
        .execute()
    */
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

const loadData = (dispatch) => (endpoint, entrypoint, constraints, views) => {
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
            let configMain = configs.filter(c => c.zone === 'main')[0]
            let queryMain =  makeQuery(entrypoint, constraints, configMain)
            let configAside = configs.filter(c => c.zone === 'aside')[0]
            let queryAside =  makeQuery(entrypoint, constraints, configAside)
            return Promise.all([
                getData(endpoint, queryMain),
                getData(endpoint, queryAside)
            ])
                .then(([dataMain, dataAside]) => {
                    // console.log(dataMain)
                    dispatch({
                        type: types.SET_DATA,
                        statements: dataMain,
                        zone: 'main'
                    })
                    dispatch({
                        type: types.SET_DATA,
                        statements: dataAside,
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
