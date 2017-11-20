const defaultState = []
/* const exSelection = {
    zone: 'main',
    selector: '#toto',
    props: [{
        path: 'nobelLaureate/nobel:year/*',
        value: [[0, 12], 2]  // valeur unique ou une liste de range ou de valeurs uniques
    },
    {
        uri: 'http:'
    }]
} */

const selection = (state, action) => {
    switch (action.type) {
    case 'ADD_SELECTION':
        return {
            selector: action.selector,
            zone: action.zone,
            props: action.props
        }
    default:
        return state
    }
}

const selections = (state = defaultState, action) => {
    switch (action.type) {
    case 'ADD_SELECTION':
        return [
            ...state,
            selection(undefined, action)
        ]
    case 'REMOVE_SELECTION':
        return state.filter(sel =>
            !(sel.selector === action.selector && sel.zone === action.zone)
        )
    default:
        return state
    }
}

export default selections
