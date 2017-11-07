import * as types from '../constants/ActionTypes'
import scale from '../svg/scale'

const setDisplay = (dispatch) => ({ env, mode, zonesDef, gridDef, screen }) => {
    let viewBoxDef = (env === 'dev') ? zonesDef.dev : display.zonesDef[mode||'full']
    let stage = scale.scaleStage(viewBoxDef, screen)
    let viewBox = scale.scaleViewBox(viewBoxDef, stage)
    let grid = scale.getGrid(gridDef, stage)
    let zones = scale.getZones(zonesDef, stage)
    return dispatch({
        type: types.SET_DISPLAY,
        screen,
        viewBox,
        stage,
        grid,
        zones
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
