import * as types from '../constants/ActionTypes'
import scale from '../lib/scale'

const setDisplay = (dispatch) => ({ env, mode, zonesDef, gridDef, screen, vizDef }) => {
    let viewBoxDef = (env === 'dev') ? zonesDef.dev : zonesDef[mode||'full']
    let stage = scale.scaleStage(viewBoxDef, screen)
    let viewBox = scale.scaleViewBox(viewBoxDef, stage)
    let grid = scale.getGrid(gridDef, stage)
    let zones = scale.getZones(zonesDef, stage)
    let viz = scale.getViz(vizDef, { width: zones.main.width, height: zones.main.height })
    return dispatch({
        type: types.SET_DISPLAY,
        screen,
        viewBox,
        stage,
        grid,
        zones,
        viz
    })
}

const getScreen = () => {
    return {
        height: window.innerHeight - 5,
        width: window.innerWidth - 5
    }
}

exports.getScreen = getScreen
exports.setDisplay = setDisplay
