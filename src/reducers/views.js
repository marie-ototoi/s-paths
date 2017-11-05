const defaultState = {
    id: 'fallback',
    constraints: []
}

const view = (state = defaultState, action) => {
    switch (action.type) {
    case 'SELECT_VIEWS':
        // for each prop, check if it fits the constraints
        let relevantProps = state.stats
        return {
            ...state,
            relevantProps
        }
    case 'DISPLAY_VIEWS':
        return {
            ...state,
            displayed: action.ids.includes(state.id)
        }
    default:
        return state
    }
}

const views = (state = [], action) => {
    switch (action.type) {
    case 'SELECT_VIEWS':
    case 'DISPLAY_VIEWS':
        return state.map(v => view(v, action))
    default:
        return state
    }
}

export default views
