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
        const elements2Add = action.elements.filter(el => {
            return state.filter(sel =>
                (sel.selector === el.selector && sel.zone === action.zone)
            ).length === 0
        })
        const elementsAdded = elements2Add.map(el => {
            return selection(undefined, { ...action, props: el.props, selector: el.selector })
        })
        return [
            ...state,
            ...elementsAdded
        ]
    case 'REMOVE_SELECTION':
        const elements2Remove = action.elements.map(s => s.selector)
        return state.filter(sel => {
            return !(elements2Remove.includes(sel.selector) && sel.zone === action.zone)
        })
    case 'RESET_SELECTION':
        return state.filter(sel => {
            return !(sel.zone === action.zone)
        })
    default:
        return state
    }
}

export default selections
