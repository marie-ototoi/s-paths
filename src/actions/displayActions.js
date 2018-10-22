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

export const setModifier = (dispatch) => (modifier) => {
    dispatch({
        type: types.SET_MODIFIER,
        modifierPressed: modifier
    })
}

export const showSettings = (dispatch) => () => {
    dispatch({
        type: types.SHOW_SETTINGS
    })
}

export const showGraphs = (dispatch) => () => {
    dispatch({
        type: types.SHOW_GRAPHS        
    })
}

export const closeDetails = (dispatch) => () => {
    dispatch({
        type: types.SHOW_DETAILS,
        details: []
    })
}

export const showStats = (dispatch) => () => {
    dispatch({
        type: types.SHOW_STATS
    })
}
