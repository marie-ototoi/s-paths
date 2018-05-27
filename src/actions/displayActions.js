import types from '../constants/ActionTypes'
import * as scale from '../lib/scaleLib'

export const setDisplay = (dispatch) => ({ env, mode, zonesDef, gridDef, screen, vizDef }) => {
    let viewBoxDef = (env === 'dev') ? zonesDef.dev : zonesDef[mode || 'full']
    let stage = scale.scaleStage(viewBoxDef, screen)
    let viewBox = scale.scaleViewBox(viewBoxDef, stage)
    let grid = scale.getGrid(gridDef, stage)
    let zones = scale.getZones(zonesDef, stage)
    let viz = scale.getViz(vizDef, { width: zones.main.width, height: zones.main.height })
    return dispatch({
        type: types.SET_DISPLAY,
        screen,
        mode,
        viewBox,
        stage,
        grid,
        zones,
        viz
    })
}
