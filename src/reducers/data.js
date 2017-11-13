const initialZone = { zone: 'new', statements: {} }

const initialState = [
    { zone: 'main', statements: {} },
    { zone: 'aside', statements: {} },
    { zone: 'main-aside', statements: {} }
]

const datazone = (state = initialZone, action) => {
    switch (action.type) {
    case 'SET_DATA':
        if (state.zone !== action.zone || !action.statements) return state
        return {
            ...state,
            statements: action.statements
        }
    case 'ADD_DATAZONE':
        return {
            ...state,
            zone: action.zone
        }
    default:
        return state
    }
}

const data = (state = initialState, action) => {
    switch (action.type) {
    case 'SET_DATA':
        return state.map(dz => datazone(dz, action))
    case 'ADD_DATAZONE':
        return [
            ...state,
            datazone(undefined, action)
        ]
    default:
        return state
    }
}

export default data
