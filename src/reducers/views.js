const defaultState = [
    { 
        id: 'Timeline', 
        constraints: [
            { group: 'datetime', min_unique: 2 }
        ]
    },
    {
        id: 'Heatmap', 
        constraints: [
            { group: 'datetime', min_unique: 2 },
            { group: 'text', min_unique: 2, max_unique: 20 }
        ]
    }
]

const view = (state = {}, action) => {
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

const views = (state = defaultState, action) => {
    switch (action.type) {
    case 'SELECT_VIEWS':
    case 'DISPLAY_VIEWS':
        return state.map(v => view(v, action))
    default:
        return state
    }
}

export default views
