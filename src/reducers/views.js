const defaultState = [
    {
        id: 'Timeline',
        entrypoint: { min: 2, max: 1000, optimal: [4, 200] },
        constraints: [
            [
                {
                    category: 'datetime',
                    unique: { min: 2 }
                }
            ],
            [
                {
                    category: 'uri',
                    unique: { min: 2, max: 10, optimal: [4, 6] }
                },
                {
                    category: 'text',
                    unique: { min: 2, max: 10, optimal: [4, 6] }
                }
            ],
            [
                {
                    category: 'uri',
                    unique: { min: 2, max: 10, optimal: [4, 6] },
                    optional: true
                },
                {
                    category: 'text',
                    unique: { min: 2, max: 10, optimal: [4, 6] }
                }
            ]
        ]
    },
    {
        id: 'HeatMap',
        constraints: [
            [
                {
                    category: 'datetime',
                    unique: { min: 2 }
                }
            ],
            [
                {
                    category: 'text',
                    unique: { min: 2, max: 160, optimal: [6, 15] }
                }
            ]
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
