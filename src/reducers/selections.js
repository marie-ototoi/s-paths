import types from '../constants/ActionTypes'

const defaultState = []
/* const exSelection = {
    zone: 'main',
    selector: '#toto',
    {
        query: 'http:'
    }]
} */

const selection = (state, action) => {
    switch (action.type) {
    case types.ADD_SELECTION:
    case types.REPLACE_SELECTION:
        return {
            selector: action.selector,
            index: action.index,
            zone: action.zone,
            config: action.config,
            query: action.query,
            count: action.count || 0,
            other: action.other
        }
    default:
        return state
    }
}

const selections = (state = defaultState, action) => {
    let elements2Add
    let elementsAdded
    let elements2Remove
    switch (action.type) {
    case types.ADD_SELECTION:
        elements2Add = action.elements.filter(el => {
            return state.filter(sel =>
                (sel.selector === el.selector && sel.zone === action.zone)
            ).length === 0
        })
        elementsAdded = elements2Add.map(el => {
            return selection(undefined, {
                ...action,
                query: el.query,
                selector: el.selector,
                count: el.count,
                index: el.index,
                other: el.other,
                config: el.config
            })
        })
        return [
            ...state.filter(sel => sel.zone === action.zone),
            ...elementsAdded
        ]
    case types.REPLACE_SELECTION:
        return action.elements.map(el => {
            return selection(undefined, {
                ...action,
                query: el.query,
                selector: el.selector,
                count: el.count,
                index: el.index,
                other: el.other,
                config: el.config
            })
        })
    case types.REMOVE_SELECTION:
        elements2Remove = action.elements.map(s => s.selector)
        return state.filter(sel => {
            return !(elements2Remove.includes(sel.selector) && sel.zone === action.zone)
        })
    case types.RESET_SELECTION:
    case types.END_TRANSITION:
        return []
    default:
        return state
    }
}

export default selections
