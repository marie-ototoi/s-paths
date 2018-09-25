import types from '../constants/ActionTypes'
import * as scale from '../lib/scaleLib'

export const setDisplay = (dispatch) => ({ screen, vizDef }) => {
    let viz = scale.getViz(vizDef, { width: screen.width, height: screen.height })
    return dispatch({
        type: types.SET_DISPLAY,
        screen,
        viz,
        vizDef
    })
}

export const hideDetail = (dispatch) => (zone) => {
    dispatch({
        type: types.HIDE_DETAIL,
        zone
    })
}

export const showSettings = (dispatch) => (zone) => {
    dispatch({
        type: types.SHOW_SETTINGS,
        zone
    })
}
