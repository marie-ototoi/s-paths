import types from '../constants/ActionTypes'

const initialConfig = {
    entrypoint: undefined,
    views: []
}

const configs = (state = initialConfig, action) => {
    let status
    switch (action.type) {
    case types.SET_CONFIGS:
    case types.SET_RESOURCES:
    case types.SET_STATS:
        // except at first load a new config is always a transition
        status = (state.views[0]) ? 'transition' : 'active'
        return {
            ...state,
            views: action.mainConfig || state.views,
            status,
            entrypoint: action.entrypoint,
            stats: action.stats
        }
    case types.SET_CONFIG:
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
            status: 'transition',
            entrypoint: action.entrypoint,
            stats: action.stats
        }
    case types.END_TRANSITION:
        // console.log('END_TRANSITION')
        return {
            ...state,
            status: 'active'
        }
    default:
        return state
    }
}

export default configs
