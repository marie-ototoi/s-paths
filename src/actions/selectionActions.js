import types from '../constants/ActionTypes'
import * as d3 from 'd3'
import * as selectionLib from '../lib/selectionLib'

export const handleMouseDown = (dispatch) => (e, zone, display) => {
    // console.log('handleMouseDown', e.pageX, e.pageY)
    return dispatch({
        type: types.START_SELECTED_ZONE,
        x1: e.pageX,
        y1: e.pageY,
        zone
    })
}
export const handleMouseUp = (dispatch) => (e, zone, display, component, selections) => {    
    // console.log('handleMouseUp', component.getElementsInZone)
    let selectionZone = {
        x1: display.selectedZone[zone].x1 || e.pageX,
        y1: display.selectedZone[zone].y1 || e.pageY,
        x2: e.pageX,
        y2: e.pageY
    }
    d3.select('rect.selection').remove()
    const zoneDimensions = selectionLib.getRectSelection(selectionZone)
    let elementsInZone = component.getElementsInZone(zoneDimensions)
    // console.log(elementsInZone)
    if (elementsInZone && elementsInZone.length > 0) {
        selectElements(dispatch)(elementsInZone, zone, selections, display.modifierPressed)
    } else {
        dispatch({
            type: types.CLEAR_SELECTED_ZONE,
            zone
        })
    }
    
}

export const resetSelection = (dispatch) => (zone) => {
    // replace by select
    return dispatch({
        type: types.RESET_SELECTION,
        zone
    })
}
export const selectElements = (dispatch) => (elements, zone, selections, modifierPressed) => {
    // console.log(modifierPressed)
    if (modifierPressed) {
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
    } else {
        console.log(elements, selections, modifierPressed)
        return dispatch({
            type: types.REPLACE_SELECTION,
            elements,
            zone
        })
    }
    // console.log(selections)
}
