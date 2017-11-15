import * as types from '../constants/ActionTypes'

const initialState = {
    endpoint: 'http://wilda.lri.fr:3030/nobel/sparql', // 'http://wilda.lri.fr:3030/dataset.html'
    entrypoint: 'nobel:LaureateAward',
    constraints: '',
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
