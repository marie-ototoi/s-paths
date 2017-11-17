import * as types from '../constants/ActionTypes'

const initialConfig = { properties: [], score: 0, zone: null }

const config = (state = initialConfig, action) => {
    switch (action.type) {
    case types.ADD_CONFIG:
        return {
            ...state,
            properties: action.properties,
            score: action.score,
            view: action.view
        }
    case types.SELECT_CONFIG:
        return {
            ...state,
            zone: (state.view === action.view) ? action.zone : null
        }
    default:
        return state
    }
}

const configs = (state = [], action) => {
    switch (action.type) {
    case types.ADD_CONFIG:
        return [
            ...state,
            config(undefined, action)
        ]
    case types.SELECT_CONFIG:
        return state.map(c => config(c, action))
    case types.SET_CONFIGS:
        return action.configs.map(c => {
            return {
                ...c,
                matches: c.matches.sort((a, b) => {
                    return b.score - a.score
                })
            }
        })
    default:
        return state
    }
}

export default configs
