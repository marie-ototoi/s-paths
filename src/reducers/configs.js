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
    case types.SET_STATS:
        return action.configs.map(c => {
            return {
                ...c,
                matches: c.matches.sort((a, b) => {
                    return b.score - a.score
                })
            }
        })
    case types.SET_CONFIG:
        return state.map(c => {
            if (c.zone === action.zone) {
                return {
                    ...action.config,
                    matches: action.config.matches.sort((a, b) => {
                        return b.score - a.score
                    })
                }
            } else {
                return c
            }
        })
    default:
        return state
    }
}

export default configs
