import * as types from '../constants/ActionTypes'

const initialConfig = { matches: [] }

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

const configstatus = (state, action) => {
    switch (action.type) {
    case types.END_TRANSITION:
        return {
            ...state,
            status: 'active'
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
                // except at first load a new config is always a transition
                status: (state[0] && state[0].matches.length > 0) ? 'transition' : 'active',
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
    case types.END_TRANSITION:
        return state.map(dz => configstatus(dz, action))
    default:
        return state
    }
}

export default configs
