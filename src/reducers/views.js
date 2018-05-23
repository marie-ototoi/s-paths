import * as types from '../constants/ActionTypes'

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
                    category: 'text',
                    unique: { min: 2, max: 50, optimal: [4, 6] }
                },
                {
                    category: 'geo',
                    subcategory: 'name',
                    unique: { min: 2, max: 50, optimal: [4, 6] }
                }
            ]/* ,
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
            ] */
        ]
    },
    {
        id: 'HeatMap',
        constraints: [
            [
                {
                    category: 'datetime',
                    unique: { min: 2 }
                },
                {
                    category: 'text',
                    unique: { min: 2, max: 150 }
                }
            ],
            [
                {
                    category: 'text',
                    unique: { min: 2, max: 50, optimal: [6, 15] }
                }
            ]
        ]
    },
    {
        id: 'TreeMap',
        constraints: [
            [
                {
                    category: 'text',
                    hierarchical: true,
                    avg: { max: 100, optimal: [30, 50] },
                    unique: { min: 5, max: 40, optimal: [10, 30] }
                },
                {
                    category: 'geo',
                    subcategory: 'name',
                    hierarchical: true,
                    avg: { max: 100, optimal: [30, 50] },
                    unique: { min: 5, max: 40, optimal: [10, 30] }
                }
            ]
        ]
    },
    {
        id: 'URIWheel',
        constraints: [
            [
                {
                    category: 'uri',
                    avg: { max: 250, optimal: [30, 100] },
                    unique: { min: 4, max: 250, optimal: [10, 150] }
                }
            ]
        ]
    }
    /* ,
    {
        id: 'GeoMap',
        constraints: [
            [
                {
                    category: 'geo',
                    subcategory: 'latitude',
                    hierarchical: true,
                    unique: { min: 2 }
                },
                {
                    category: 'geo',
                    subcategory: 'name',
                    hierarchical: true,
                    unique: { min: 2 }
                }
            ],
            [
                {
                    category: 'geo',
                    subcategory: 'longitude',
                    optional: true,
                    unique: { min: 2 }
                }
            ]
        ]
    } */
]

const view = (state = {}, action) => {
    let relevantProps = state.stats
    switch (action.type) {
    case types.SELECT_VIEWS:
        // for each prop, check if it fits the constraints
        return {
            ...state,
            relevantProps
        }
    default:
        return state
    }
}

const views = (state = defaultState, action) => {
    switch (action.type) {
    case types.SELECT_VIEWS:
        return state.map(v => view(v, action))
    default:
        return state
    }
}

export default views
