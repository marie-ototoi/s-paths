export const views = [
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
    },
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
    },
    {
        id: 'SingleProp',
        thumb : '/images/singleprop.svg',
        constraints: [
            [
                {
                    category: '*',
                    unique: { }
                }
            ]
        ]
    }
]