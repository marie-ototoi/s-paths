const defaultState = []

const selection = (state, action) => {
    switch (action.type) {
    case 'ADD_SELECTION':
        return {
            selector: action.selector,
            query: action.query
        }
    default:
        return state
    }
}

const selections = (state = defaultState, action ) => {
    switch (action.type) {
    case 'ADD_SELECTION':
        return [
            ...state,
            selection(undefined, action)
        ]
    case 'REMOVE_SELECTION':
        return state.filter(sel =>
            sel.selector !== action.selector
        )
    default:
        return state
    }
}

export default selections
