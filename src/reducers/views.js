import types from '../constants/ActionTypes'

const defaultState = [
    {
        id: 'Timeline',
        thumb : '/images/timeline.svg',
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
                    avg: { max: 30, optimal: [10, 20] },
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
        thumb : '/images/heatmap.svg',
        constraints: [
            [
                {
                    category: 'datetime',
                    unique: { min: 2 }
                },
                {
                    category: 'text',
                    avg: { max: 50, optimal: [10, 40] },
                    unique: { min: 2, max: 150 }
                }
            ],
            [
                {
                    category: 'text',
                    unique: { min: 2, max: 50, optimal: [10, 40] }
                }
            ]
        ]
    },
    {
        id: 'TreeMap',
        thumb : '/images/treemap.svg',
        constraints: [
            [
                {
                    category: 'text',
                    hierarchical: true,
                    avg: { max: 50, optimal: [10, 40] },
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
        thumb : '/images/uriwheel.svg',
        constraints: [
            [
                {
                    category: 'uri',
                    avg: { max: 120, optimal: [30, 70] },
                    unique: { min: 25, max: 150, optimal: [50, 100] }
                }
            ]
        ]
    }/* ,
    {
        id: 'GeoMap',
        thumb : '/images/geomap.svg',
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
            ]/* ,
            [
                {
                    category: 'geo',
                    subcategory: 'longitude',
                    optional: true,
                    unique: { min: 2 }
                }
            ]
        ]
    } */,
    {
        id: 'ListAllProps',
        thumb : '/images/listprop.svg',
        entrypoint: { min: 1, max: 100, optimal: [1, 40] },
        constraints: [
            [
                {
                    category: '*',
                    unique: { min: 1 }
                }
            ]
        ]
    },
    {
        id: 'SingleProp',
        thumb : '/images/listprop.svg',
        entrypoint: { min: 1, max: 200, optimal: [1, 100] },
        constraints: [
            [
                {
                    category: '*',
                    unique: { min: 1 }
                }
            ]
        ]
    },
    {
        id: 'Images',
        thumb : '/images/images.svg',
        entrypoint: { min: 1, max: 400 },
        constraints: [
            [
                {
                    category: 'image',
                    unique: { min: 1, max: 300 }
                }
            ],
            [
                {
                    category: 'text',
                    avg: { max: 120, optimal: [30, 70] },
                    unique: { }
                }
            ]
        ]
    }
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
