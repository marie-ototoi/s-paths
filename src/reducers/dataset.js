const initialState = {
    endpoint: 'http://data.nobelprize.org/snorql/?query=', // 'http://wilda.lri.fr:3030/dataset.html'
    entryPoint: '<http://data.nobelprize.org/terms/LaureateAward>',
    constraint: '',
    status: 'off',
    stats: []
}

const dataset = (state = initialState, action) => {
    switch (action.type) {
    case 'INIT':
        return {
            ...state,
            status: 'fetching_props'
        }
    case 'SET_ENTRYPOINT':
        return {
            ...state,
            endpoint: action.endpoint,
            entryPoint: action.entryPoint,
            constraint: action.constraint || '',
            status: 'fetching_props'
        }
    case 'SET_STATS':
        return {
            ...state,
            status: 'fetching_data',
            stats: action.stats
        }
    case 'SET_DATA':
        return {
            ...state,
            status: 'ok'
        }
    default:
        return state
    }
}

export default dataset
