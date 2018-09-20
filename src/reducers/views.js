import types from '../constants/ActionTypes'

const defaultState = [
    {
        id: 'StackedChart',
        name: 'stacked chart',
        thumb : '/images/stackedchart.svg',
        entrypoint: { min: 2, max: 1000, optimal: [4, 200] },
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
        entrypoint: { min: 2, max: 30, optimal: [4, 20] },
        constraints: [
            [
                {
                    category: 'datetime',
                    unique: { min: 1 }
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
    /* {
        id: 'Pyramid',
        name: 'pyramid - this is a vega test',
        thumb : '/images/pyramid.svg',
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
                    unique: { min: 2, max: 70, optimal: [10, 40] }
                },
                {
                    category: 'uri',
                    unique: { min: 2, max: 70, optimal: [10, 40] }
                }
            ]
        ]
    }, */
    {
        id: 'Timeline',
        name: 'timeline',
        thumb : '/images/timeline.svg',
        constraints: [
            [
                {
                    category: 'datetime',
                    unique: { min: 1 },
                    multiple: true
                }
            ],
            [
                {
                    category: 'text',
                    unique: { min: 2, max: 70, optimal: [10, 40] }
                },
                {
                    category: 'uri',
                    unique: { min: 2, max: 70, optimal: [10, 40] }
                }
            ]
        ]
    },
    {
        id: 'TreeMap',
        name: 'treemap',
        thumb : '/images/treemap.svg',
        constraints: [
            [
                {
                    category: 'text',
                    hierarchical: true,
                    avg: { max: 70, optimal: [10, 40] },
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
        name: 'URI wheel',
        thumb : '/images/uriwheel.svg',
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
        entrypoint: { min: 2 },
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
            ]
        ]
    },
    {
        id: 'ListAllProps',
        name: 'all props',
        thumb : '/images/listprop.svg',
        allProperties: true,
        entrypoint: { min: 1, max: 100, optimal: [1, 40] },
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
        id: 'SingleProp',
        name: 'single prop',
        thumb : '/images/listprop.svg',
        entrypoint: { max: 200, optimal: [1, 100] },
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
        entrypoint: { min: 2, max: 400 },
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
