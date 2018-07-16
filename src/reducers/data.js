import types from '../constants/ActionTypes'

const initialState = [
    { zone: 'main', statements: {}, deltaStatements: {}, detailStatements: [] },
    { zone: 'aside', statements: {}, deltaStatements: {}, detailStatements: [] },
    { zone: 'main-aside', statements: {} }
]

const datazone = (state, action) => {
    switch (action.type) {
    case types.SET_DATA:
    case types.SET_CONFIG:
    case types.SET_CONFIGS:
    case types.SET_RESOURCES:
    case types.SET_STATS:
        if (action[state.zone] && action[state.zone].results) {
            return {
                ...state,
                statements: action[state.zone],
                status: action.status,
                deltaStatements: action[state.zone + 'Delta'] || {},
                displayed: action[state.zone + 'Displayed']
            }
        } else {
            return state
        }
    default:
        return state
    }
}
const datadetail = (state, action) => {
    let detailStatements
    let newbindings
    switch (action.type) {
    case types.SET_DETAIL:
        if (action.zone === state.zone) {
            if (action.elements.results.bindings) {
                newbindings = action.elements.results.bindings.map(el => { return { ...el, level: action.level } })
                detailStatements = {
                    ...action.elements,
                    results: {
                        ...action.elements.results,
                        bindings: (action.level === 1) ? newbindings : [ ...state.detailStatements.results.bindings, ...newbindings ]
                    }
                }
            } else {
                detailStatements = {}
            }
            return {
                ...state,
                detailStatements
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
    case types.SET_CONFIG:
    case types.SET_CONFIGS:
    case types.SET_STATS:
    case types.SET_RESOURCES:
        // if data are already set, make a transition
        action.status = (state[0].statements.results) ? 'transition' : 'active'
        // console.log('ok on a recu les data', action.status, action)
        return state.map(dz => datazone(dz, action))
    case types.SET_DETAIL:
        // if data are already set, make a transition
        return state.map(dz => datadetail(dz, action))
    case types.END_TRANSITION:
        // console.log('en transition')
        return state.map(dz => datastatus(dz, action))
    default:
        return state
    }
}

export default data
