import * as types from '../constants/ActionTypes'

export const setDisplay = (dispatch) => (display) => {
    return dispatch({
        type: types.SET_DISPLAY,
        ...display
    })
}

