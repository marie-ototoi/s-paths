import types from '../constants/ActionTypes'
import * as scale from '../lib/scaleLib'

export const setDisplay = (dispatch) => ({ screen, vizDefPercent }) => {
    let viz = scale.getViz(vizDefPercent, screen)
    return dispatch({
        type: types.SET_DISPLAY,
        screen,
        viz,
        vizDefPercent
    })
}

export const hideDetail = (dispatch) => (zone) => {
    dispatch({
        type: types.HIDE_DETAIL,
        zone
    })
}

export const setModifier = (dispatch) => (on) => {
    dispatch({
        type: types.SET_MODIFIER,
        modifierPressed: on
    })
}

export const showSettings = (dispatch) => (zone) => {
    dispatch({
        type: types.SHOW_SETTINGS,
        zone
    })
}
