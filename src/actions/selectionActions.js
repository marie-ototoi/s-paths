import types from '../constants/ActionTypes'
import * as selectionLib from '../lib/selectionLib'

export const handleMouseDown = (dispatch) => (e, zone, display) => {
    let offset = { x: (display.viz[zone + '_x'] + display.viz['horizontal_padding']), y: (display.viz['top_margin'] + display.viz[zone + '_top_padding']) }
    // console.log('handleMouseDown', e.pageX - offset.x, e.pageY - offset.y)
    return dispatch({
        type: types.START_SELECTED_ZONE,
        x1: e.pageX - offset.x,
        y1: e.pageY - offset.y,
        zone
    })
}
export const handleMouseUp = (dispatch) => (e, zone, display, layout, selections) => {    
    // console.log('handleMouseUp')
    let offset = { x: (display.viz[zone + '_x'] + display.viz['horizontal_padding']), y: (display.viz['top_margin'] + display.viz[zone + '_top_padding']) }
    let selectionZone = {
        x1: display.selectedZone[zone].x1 || e.pageX - offset.x,
        y1: display.selectedZone[zone].y1 || e.pageY - offset.y,
        x2: e.pageX - offset.x,
        y2: e.pageY - offset.y
    }
    const zoneDimensions = selectionLib.getRectSelection(selectionZone)
    let elementsInZone = layout.getElementsInZone({ display, zone, zoneDimensions })
    if (elementsInZone && elementsInZone.length > 0) selectElements(dispatch)(elementsInZone, zone, selections)
    dispatch({
        type: types.CLEAR_SELECTED_ZONE,
        zone
    })
}
export const resetSelection = (dispatch) => (zone) => {
    // replace by select
    return dispatch({
        type: types.RESET_SELECTION,
        zone
    })
}
export const selectElements = (dispatch) => (elements, zone, selections) => {
    if (selectionLib.areSelected(elements, zone, selections)) {
        return dispatch({
            type: types.REMOVE_SELECTION,
            elements,
            zone
        })
    } else {
        return dispatch({
            type: types.ADD_SELECTION,
            elements,
            zone
        })
    }
    // console.log(selections)
}
