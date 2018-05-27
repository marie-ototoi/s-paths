import types from '../constants/ActionTypes'

const initialState = [
    {
        properties: [],
        colors: [
            'hsl(180, 100%, 45%)',
            'hsl(180, 100%, 40%)',
            'hsl(190, 100%, 45%)',
            'hsl(190, 100%, 40%)',
            'hsl(200, 100%, 45%)',
            'hsl(200, 100%, 40%)',
            'hsl(210, 100%, 45%)',
            'hsl(210, 100%, 40%)',
            'hsl(220, 100%, 45%)',
            'hsl(220, 100%, 40%)',
            'hsl(230, 100%, 45%)',
            'hsl(230, 100%, 40%)',
            'hsl(240, 100%, 45%)',
            'hsl(240, 100%, 40%)'
        ]
    },
    {
        properties: [],
        colors: [
            'hsl(280, 100%, 30%)',
            'hsl(300, 100%, 30%)',
            'hsl(320, 100%, 30%)',
            'hsl(340, 100%, 30%)',
            'hsl(350, 100%, 40%)',
            'hsl(360, 100%, 40%)'
        ]
    },
    {
        properties: [],
        colors: ['#014636', '#016c59', '#02818a', '#3690c0', '#67a9cf', '#a6bddb', '#d0d1e6', '#ece2f0']
    },
    {
        properties: [],
        colors: ['#67001f', '#980043', '#ce1256', '#e7298a', '#df65b0', '#c994c7', '#d4b9da', '#e7e1ef']
    },
    {
        properties: [],
        colors: ['#4d004b', '#810f7c', '#88419d', '#8c6bb1', '#8c96c6', '#9ebcda', '#bfd3e6', '#e0ecf4']
    },
    {
        properties: [],
        colors: ['#084081', '#0868ac', '#2b8cbe', '#4eb3d3', '#7bccc4', '#a8ddb5', '#ccebc5', '#e0f3db']
    },
    {
        properties: [],
        colors: ['#7f0000', '#b30000', '#d7301f', '#ef6548', '#fc8d59', '#fdbb84', '#fdd49e', '#fee8c8']
    },
    {
        properties: [],
        colors: ['#49006a', '#7a0177', '#ae017e', '#dd3497', '#f768a1', '#fa9fb5', '#fcc5c0', '#fde0dd']
    },
    {
        properties: [],
        colors: ['#004529', '#006837', '#238443', '#41ab5d', '#78c679', '#addd8e', '#d9f0a3', '#f7fcb9']
    },
    {
        properties: [],
        colors: ['#081d58', '#253494', '#225ea8', '#1d91c0', '#41b6c4', '#7fcdbb', '#c7e9b4', '#edf8b1']
    },
    {
        properties: [],
        colors: ['#662506', '#993404', '#cc4c02', '#ec7014', '#fe9929', '#fec44f', '#fee391', '#fff7bc']
    },
    {
        properties: [],
        colors: ['#800026', '#bd0026', '#e31a1c', '#fc4e2a', '#fd8d3c', '#feb24c', '#fed976', '#ffeda0']
    },
    {
        properties: [],
        colors: ['#08306b', '#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7']
    },
    {
        properties: [],
        colors: ['#00441b', '#006d2c', '#238b45', '#41ab5d', '#74c476', '#a1d99b', '#c7e9c0', '#e5f5e0']
    },
    {
        properties: [],
        colors: ['#7f2704', '#a63603', '#d94801', '#f16913', '#fd8d3c', '#fdae6b', '#fdd0a2', '#fee6ce']
    },
    {
        properties: [],
        colors: ['#3f007d', '#54278f', '#6a51a3', '#807dba', '#9e9ac8', '#bcbddc', '#dadaeb', '#efedf5']
    },
    {
        properties: [],
        colors: ['#67000d', '#a50f15', '#cb181d', '#ef3b2c', '#fb6a4a', '#fc9272', '#fcbba1', '#fee0d2']
    }
]

const palette = (state, action) => {
    switch (action.type) {
    case types.SET_PROP_PALETTE:
        return {
            ...state,
            properties: [
                ...state.properties,
                action.property
            ]
        }
    default:
        return state
    }
}

const palettes = (state = initialState, action) => {
    switch (action.type) {
    case types.SET_PROP_PALETTE:
        return state.map((p, i) => {
            return (i === action.index) ? palette(p, action) : p
        })
    default:
        return state
    }
}

export default palettes
