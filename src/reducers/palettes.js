import * as types from '../constants/ActionTypes'

const initialState = [
    {
        properties: [],
        colors: ['#e0cfe1',  '#ad8cb7', '#896aa6', '#5b4488', 
        '#54254f', '#e3cbe1', '#b794b4', '#9467a0', '#7d4489', 
        '#331b3d', '#b7c1cd', '#8eafd0', '#6385b2', '#9099d0', 
        '#9a97d0', '#404a8f', '#3b3887', '#bda5c5', '#9ac4dc', '#808bc1', 
        '#7a77ae', '#485297', '#51519b', '#a4cee7', '#538db2',
        '#507fb5', '#3568a7', '#155094', '#164686', '#173068']
    },{ 
        properties: [],
        colors: ['#c65454', '#e8bcbd', '#e17d7f', '#e39d9d',  '#b73f3e', 
          '#ea816e', '#dc4e3a', '#d03d2b','#ecb3a0',
        '#bd2319', '#ca311f', '#ea8aa6', '#e76d82', '#ed4556',
        '#e42c34', '#d61d22', '#bd191a', '#981c26', '#78252d', 
        '#533034']
    },{
        properties: [],
        colors: ['#f58ea9', '#e35168', '#e84351', '#dd3544', '#ffd7de', 
        '#ee90ab', '#ed99b3', '#ee5b77', '#ab2935', '#f7c1cf',
        '#fba3bb', '#cb5b7f', '#c1475e', '#dd4959', '#af2131', 
        '#782b31', '#f9e1e1', '#e599a6', '#b23f5e', '#c94463',
        '#9e1e2b']
    },{
        properties: [],
        colors: ['#9dbcbf', '#88bbce', '#61a6c7', '#106d8c', '#075f8d',
        '#135a8e', '#14406d', '#0b2d48', '#a6cbd1', '#5598a9',
        '#21819a', '#1d4f70', '#94c0b3', '#568980', '#48919a',
        '#1b6d78', '#30515a', '#b4beb6', '#8fa193', '#687679',
        '#39545d', '#435259', '#479683', '#276b5c', '#375a53']
    },{
        properties: [],
        colors: ['#698143', '#436835', '#455f42', '#deda90','#ded973',
        '#c5b931', '#85971f', '#7f803a', '#c5b24b','#c0aa45',
        '#8c7c27', '#625437', '#c3c093', '#9b8f45','#716d47',
        '#eee3ad', '#bd9e5b', '#aa9345', '#dcca68','#b49521',
        '#c5992c', '#aa882f', '#7d673e', '#66472a']
    }
]

const palette = (state, action) => {
    switch (action.type) {
    case 'SET_PROP_PALETTE':
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
            return (i === action.index)? palette(p, action) : p
        })
    default:
        return state
    }
}

export default palettes
