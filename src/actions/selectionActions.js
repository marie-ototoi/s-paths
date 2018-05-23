import * as types from '../constants/ActionTypes'
import * as selectionLib from '../lib/selectionLib'

export const handleMouseDown = (dispatch) => (e, zone, offset) => {
    // console.log(e.pageX, e.pageY, zone, offset)
    // replace by select
    return dispatch({
        type: types.START_SELECTED_ZONE,
        x1: e.pageX - offset.x,
        y1: e.pageY - offset.y,
        zone
    })
}
export const handleMouseUp = (dispatch) => (e, zone, offset) => {
    // replace by select
    return dispatch({
        type: types.CLEAR_SELECTED_ZONE,
        zone
    })
}
export const handleMouseMove = (dispatch) => (e, zone, offset) => {
    // replace by select
    return dispatch({
        type: types.MOVE_SELECTED_ZONE,
        x2: e.pageX - offset.x,
        y2: e.pageY - offset.y,
        zone
    })
}

/* const resetSelection = (dispatch) => (zone) => {
    // replace by select
    return dispatch({
        type: types.RESET_SELECTION,
        zone
    })
} */

export const select = (dispatch) => (elements, zone, selections) => {
    // console.log(elements, selections, selectionLib.areSelected(elements, zone, selections))
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
