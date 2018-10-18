import types from '../constants/ActionTypes'

export const saveFactors = (dispatch) => () => {
    dispatch({
        type: types.SAVE_RANKFACTORS
    })
}
