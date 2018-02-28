import * as types from '../constants/ActionTypes'

const initialState = [
    { zone: 'main', statements: {}, deltaStatements: {} },
    { zone: 'aside', statements: {}, deltaStatements: {} },
    { zone: 'main-aside', statements: {} }
]

const datazone = (state, action) => {
    switch (action.type) {
    case types.SET_DATA:
        if (action[state.zone] && action[state.zone].results) {
            return {
                ...state,
                statements: action[state.zone],
                status: action.status,
                deltaStatements: action[state.zone + 'Delta'],
                coverageStatements: action[state.zone + 'Coverage']
            }
        } else {
            return state
        }
    default:
        return state
    }
}
const datastatus = (state, action) => {
    switch (action.type) {
    case types.END_TRANSITION:
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

const data = (state = initialState, action) => {
    switch (action.type) {
    case types.SET_DATA:
        // if data are already set, make a transition
        action.status = (state[0].statements.results) ? 'transition' : 'active'
        return state.map(dz => datazone(dz, action))
    case types.END_TRANSITION:
        return state.map(dz => datastatus(dz, action))
    default:
        return state
    }
}

export default data
