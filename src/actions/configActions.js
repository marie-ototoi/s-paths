import types from '../constants/ActionTypes'

export const saveFactor = (dispatch) => (group, name, value) => {
    dispatch({
        type: types.SAVE_RANKFACTOR,
        group,
        name,
        value
    })
}
