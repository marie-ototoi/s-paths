import * as types from '../constants/ActionTypes'

const initialConfig = { properties: [], grade: 0, zone: null }

const config = (state = initialConfig, action) => {
    switch (action.type) {
    case types.ADD_CONFIG:
        return {
            ...state,
            properties: action.properties,
            grade: action.grade,
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
    default:
        return state
    }
}

export default configs
