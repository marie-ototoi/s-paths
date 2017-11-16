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

const getData = (endpoint, query) => {
    const client = new SparqlClient(endpoint)
    .registerCommon('rdf', 'rdfs')
    .register({
        nobel: 'http://data.nobelprize.org/terms/',
        foaf: 'http://xmlns.com/foaf/0.1/',
        'dbpedia-owl': 'http://dbpedia.org/ontology/',
        yago: 'http://yago-knowledge.org/resource/',
        viaf: 'http://viaf.org/viaf/',
        meta: 'http://www4.wiwiss.fu-berlin.de/bizer/d2r-server/metadata#',
        dcterms: 'http://purl.org/dc/terms/',
        d2r: 'http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#',
        dbpedia: 'http://dbpedia.org/resource/',
        owl: 'http://www.w3.org/2002/07/owl#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        map: 'http://data.nobelprize.org/resource/#',
        freebase: 'http://rdf.freebase.com/ns/',
        dbpprop: 'http://dbpedia.org/property/',
        skos: 'http://www.w3.org/2004/02/skos/core#'
    })
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

const loadData = (dispatch) => (endpoint, entrypoint, views) => {
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
                getData(endpoint, queryMain),
                getData(endpoint, queryAside)
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
