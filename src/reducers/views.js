import types from '../constants/ActionTypes'

const defaultState = [
    {
        id: 'StackedChart',
        name: 'stacked chart',
        thumb : '/images/stackedchart.svg',
        entrypoint: { min: 2, max: 1000, optimal: [4, 200] },
        weight: 7,
        constraints: [
            [
                {
                    category: 'datetime',
                    unique: { min: 2 }
                },
                {
                    category: 'text',
                    avg: { max: 70, optimal: [10, 40] },
                    unique: { min: 2, max: 150 }
                },
                {
                    category: 'uri',
                    unique: { min: 2, max: 150 }
                }
            ],
            [
                {
                    category: 'text',
                    avg: { max: 30, optimal: [10, 20] },
                    unique: { min: 2, max: 50, optimal: [4, 6] }
                },
                {
                    category: 'uri',
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
        name: 'heatmap',
        thumb : '/images/heatmap.svg',
        weight: 5,
        constraints: [
            [
                {
                    category: 'datetime',
                    unique: { min: 2 }
                },
                {
                    category: 'text',
                    avg: { max: 70, optimal: [10, 40] },
                    unique: { min: 2, max: 150 }
                },
                {
                    category: 'uri',
                    unique: { min: 2, max: 150 }
                }
            ],
            [
                {
                    category: 'text',
                    unique: { min: 2, max: 70, optimal: [10, 40] },
                    avg: { max: 70, optimal: [10, 40] }
                },
                {
                    category: 'uri',
                    unique: { min: 2, max: 70, optimal: [10, 40] }
                }
            ]
        ]
    },
    {
        id: 'Timeline',
        name: 'timeline',
        thumb : '/images/timeline.svg',
        weight: 8,
        entrypoint: { min: 2, max: 30, optimal: [10, 20] },
        constraints: [
            [
                {
                    category: 'datetime',
                    unique: { min: 2 },
                    multiple: true
                }
            ],
            [
                {
                    category: 'text',
                    unique: { min: 2 },
                    avg: { max: 70, optimal: [10, 40] }
                },
                {
                    category: 'uri',
                    unique: { min: 2 }
                }
            ]
        ]
    },
    {
        id: 'TreeMap',
        name: 'treemap',
        thumb : '/images/treemap.svg',
        weight: 5,
        constraints: [
            [
                {
                    category: 'text',
                    hierarchical: true,
                    avg: { max: 70, optimal: [10, 40] },
                    unique: { min: 5, max: 40, optimal: [10, 30] }
                },
                {
                    category: 'uri',
                    unique: { min: 5, max: 40, optimal: [10, 30] }
                }
            ]
        ]
    },
    {
        id: 'URIWheel',
        name: 'URI wheel',
        thumb : '/images/uriwheel.svg',
        weight: 4,
        constraints: [
            [
                {
                    category: 'uri',
                    avg: { max: 120, optimal: [30, 70] },
                    unique: { min: 5, max: 150, optimal: [50, 100] }
                }
            ]
        ]
    },
    {
        id: 'GeoMap',
        name: 'map',
        thumb : '/images/geomap.svg',
        entrypoint: { min: 2, max: 1000 },
        weight: 10,
        constraints: [
            [
                {
                    category: 'geo',
                    subcategory: 'latitude',
                    unique: {}
                }
            ],
            [
                {
                    category: 'geo',
                    subcategory: 'longitude',
                    unique: {}
                }
            ],
            [
                {
                    category: 'text',
                    avg: { max: 120, optimal: [30, 70] },
                    unique: {}
                }
            ],
            [
                {
                    category: 'text',
                    unique: { min: 2, max: 15, optimal: [3, 10] },
                    avg: { max: 120, optimal: [30, 70] },
                    optional: true
                }
            ]
        ]
    }/*,
    {
        id: 'ListAllProps',
        name: 'all props',
        thumb : '/images/listprop.svg',
        allProperties: true,
        entrypoint: { min: 1, max: 20, optimal: [1, 10] },
        constraints: [
            [
                {
                    category: '*',
                    unique: {}
                }
            ]
        ]
    }*/,
    {
        id: 'SingleProp',
        name: 'single prop',
        thumb : '/images/listprop.svg',
        entrypoint: { max: 50, optimal: [1, 30] },
        weight: 7,
        constraints: [
            [
                {
                    category: '*',
                    unique: {}
                }
            ]
        ]
    },
    {
        id: 'Images',
        name: 'images',
        thumb : '/images/images.svg',
        entrypoint: { min: 2, max: 500 },
        weight: 8,
        constraints: [
            [
                {
                    category: 'image',
                    unique: { max: 300 }
                }
            ],
            [
                {
                    category: 'text',
                    avg: { max: 120, optimal: [30, 70] },
                    unique: {}
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
