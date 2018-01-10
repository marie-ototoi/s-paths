
const initialState = [
    { zone: 'main', statements: [] },
    { zone: 'aside', statements: [] },
    { zone: 'main-aside', statements: [] }
]

const datazone = (state, action) => {
    switch (action.type) {
    case 'SET_DATA':
        if (action[state.zone] && action[state.zone].results) {
            return {
                ...state,
                statements: action[state.zone]
            }
        } else {
            return state
        }
    default:
        return state
    }
}

const data = (state = initialState, action) => {
    switch (action.type) {
    case 'SET_DATA':
        return state.map(dz => datazone(dz, action))
    default:
        return state
    }
}

export default data
