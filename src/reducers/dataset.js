const initialState = {
    query: '',
    status: '',
    props: []
}

const dataset = (state = initialState, action) => {
    switch (action.type) {
    case 'SET_QUERY':
        return {
            ...state,
            status: 'fetching_props',
            query: action.query
        }
    case 'SET_PROPS':
        return {
            ...state,
            status: 'fetching_data',
            props: action.props
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
