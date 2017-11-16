const defaultState = []
/* const exSelection = {
    selector: '#toto',
    prop: 'nobelLaureate/nobel:year/*',
    value: [[0, 12], 2]  // valeur unique ou une liste de range ou de valeur unique (paliers)\
} */

const selection = (state, action) => {
    switch (action.type) {
    case 'ADD_SELECTION':
        return {
            selector: action.selector,
            prop: action.prop,
            value: action.value
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
