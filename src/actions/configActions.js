import types from '../constants/ActionTypes'

export const saveFactor = (dispatch) => (group, name, value) => {
    dispatch({
        type: types.SAVE_RANKFACTOR,
        group,
        name,
        value
    })
}

export const saveGraphs = (dispatch) => (graphs) => {
    console.log(graphs)
    dispatch({
        type: types.SAVE_GRAPHS,
        graphs
    })
}
