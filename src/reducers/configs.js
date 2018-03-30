import * as types from '../constants/ActionTypes'

const initialConfig = [
    { zone: 'main', views: [] },
    { zone: 'aside', views: [] }
]

const configstatus = (state, action) => {
    switch (action.type) {
    case types.END_TRANSITION:
        //console.log('END_TRANSITION')
        if (action.zone === state.zone) {
            return {
                ...state,
                status: 'active'
            }
        } else {
            return state
        }
    default:
        return state
    }
}

const configzone = (state, action) => {
    switch (action.type) {
    case types.SET_CONFIGS:
    case types.SET_STATS:
        if (action[state.zone]) {
            // except at first load a new config is always a transition
            let status = (state.views[0]) ? 'transition' : 'active'
            return {
                ...state,
                views: action[state.zone] || state.views,
                status
            }
        } else {
            return state
        }
    case types.SET_CONFIG:
        if (action.zone === state.zone) {
            // console.log(state)
            return {
                ...state,
                views: state.views.map(v => {
                    return (v.id === action.config.id) ? {
                        ...action.config,
                        selected: true
                    } : {
                        ...v,
                        selected: false
                    }
                }),
                status: 'transition'
            }
        } else {
            return state
        }
    default:
        return state
    }
}

const configs = (state = initialConfig, action) => {
    switch (action.type) {
    case types.SET_CONFIGS:
    case types.SET_STATS:
    case types.SET_CONFIG:
        return state.map(dz => configzone(dz, action))
    case types.END_TRANSITION:
        return state.map(dz => configstatus(dz, action))
    default:
        return state
    }
}

export default configs
