import types from '../constants/ActionTypes'

const initialConfig = {
    entrypoint: undefined,
    views: [],
    savedSelections: []
}

const configs = (state = initialConfig, action) => {
    let status
    switch (action.type) {
    case types.SET_CONFIGS:
    case types.SET_RESOURCES:
    case types.SET_STATS:
        // except at first load a new config is always a transition
        status = (state.views[0]) ? 'transition' : 'active'
        // console.log(status, action.savedSelections, state.savedSelections)
        return {
            ...state,
            views: action.mainConfig || state.views,
            status,
            token: action.token || state.token,
            savedSelections: action.savedSelections || state.savedSelections,
            entrypoint: action.entrypoint,
            stats: action.stats,
            checked: false,
            multiple: false
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
            stats: action.stats,
            checked: false,
            multiple: false
        }
    case types.END_TRANSITION:
        // console.log('END_TRANSITION')
        // console.log('active', action.savedSelections, state.savedSelections)
        return {
            ...state,
            status: 'active'
        }
    case types.UPDATE_CONFIGS:
        // console.log('UPDATE_CONFIGS', state.token, action.token, action.configs)
        if (state.token === action.token) {
            return {
                ...state,
                views: action.configs.views,
                checked: true
            }
        } else {
            return state
        }
    case types.SET_MULTIPLE:
        return {
            ...state,
            multiple: true
        }
    default:
        return state
    }
}

export default configs
