import * as types from '../constants/ActionTypes'

const initialConfig = { matches: [] }

const config = (state = initialConfig, action) => {
    switch (action.type) {
    /*case types.SET_DATA:
        let unitDimensions = {
            main: (action.resetUnitDimensions === 'all') ? null : state.unitDimensions.main,
            aside: (action.resetUnitDimensions === 'all') ? null : state.unitDimensions.aside
        }
        if (action.resetUnitDimensions === 'zone') unitDimensions[action.zone] = null
        return {
            ...state,
            unitDimensions
        }
    case types.SET_UNIT_DIMENSIONS:
        return {
            ...state,
            unitDimensions: {
                main: (state.id === action.configId && action.zone === 'main') ? action.unitDimensions : state.unitDimensions.main,
                aside: (state.id === action.configId && action.zone === 'aside') ? action.unitDimensions : state.unitDimensions.aside
            }
        }*/
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
            if (c.id === action.config.id) {
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
    /*case types.SET_DATA:
        return state.map(v => config(v, action))
    case types.SET_UNIT_DIMENSIONS:
        return state.map(v => config(v, action))
        // to do*/
    default:
        return state
    }
}

export default configs
