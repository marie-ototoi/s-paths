import * as types from '../constants/ActionTypes'

const initialState = {
    endpoint: 'http://wilda.lri.fr:3030/nobel/sparql', // 'http://wilda.lri.fr:3030/dataset.html'
    entrypoint: 'nobel:LaureateAward',
    prefixes: {
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
    },
    status: 'off',
    stats: []
}

const initialConfig = { properties: [], grade: 0 }

const dataset = (state = initialState, action) => {
    switch (action.type) {
    case types.INIT:
        return {
            ...state,
            status: 'fetching_props'
        }
    case types.SET_ENTRYPOINT:
        return {
            ...state,
            endpoint: action.endpoint,
            entryPoint: action.entryPoint,
            constraints: action.constraints || '',
            status: 'fetching_props'
        }
    case types.SET_STATS:
        return {
            ...state,
            status: 'ranking_views',
            stats: action.stats
        }
    case types.SET_CONFIGS:
        return {
            ...state,
            status: 'fetching_data',
        }
    case types.SET_DATA:
        return {
            ...state,
            status: 'ok'
        }
    default:
        return state
    }
}

export default dataset
