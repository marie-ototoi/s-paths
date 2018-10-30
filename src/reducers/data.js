import types from '../constants/ActionTypes'

const initialState = {
    statements: {},
    deltaStatements: {},
    detailStatements: [],
    status: 'loading'
}

const data = (state = initialState, action) => {
    let status
    let detailStatements
    let newbindings
    switch (action.type) {
    case types.SET_DATA:
    case types.SET_CONFIG:
    case types.SET_CONFIGS:
    case types.SET_STATS:
    case types.SET_RESOURCES:
        if (!state.statements) return state
        // if data are already set, make a transition
        status = (state.statements.results) ? 'transition' : 'active'
        // console.log('ok on a recu les data', action.status, action)
        return {
            ...state,
            statements: action.main || state.statements,
            status,
            deltaStatements: action.mainDelta || {},
            displayed: action.mainDisplayed,
            multiple: []
        }
    case types.SET_DETAIL:
        // if data are already set, make a transition
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
    case types.SET_MULTIPLE:
        return {
            ...state,
            multiple: [...state.multiple,
                action.elements.results.bindings
            ]
        }   
    case types.END_TRANSITION:
        // console.log('en transition')
        return {
            ...state,
            status: 'active'
        }
    default:
        return state
    }
}

export default data
