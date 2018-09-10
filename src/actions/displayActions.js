import types from '../constants/ActionTypes'
import * as scale from '../lib/scaleLib'

export const setDisplay = (dispatch) => ({ env, mode, zonesDef, gridDef, screen, vizDef }) => {
    let grid = scale.getGrid(gridDef, screen)
    let zones = scale.getZones(zonesDef, screen)
    let viz = scale.getViz(vizDef, { width: zones.main.width, height: zones.main.height })
    return dispatch({
        type: types.SET_DISPLAY,
        screen,
        mode,
        grid,
        zones,
        viz
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