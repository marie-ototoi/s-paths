import * as types from '../constants/ActionTypes'
import selectionLib from '../lib/selectionLib'

const removeSelection = (dispatch) => (selector, zone) => {
    return dispatch({
        type: 'REMOVE_SELECTION',
        selector,
        zone
    })
}

const addSelection = (dispatch) => (selector, zone, props) => {
    // replace by select
    return dispatch({
        type: 'ADD_SELECTION',
        selector,
        zone,
        props
    })
}

const handleMouseDown = (dispatch) => (e) => {
    // replace by select
    return dispatch({
        type: 'START_SELECTED_ZONE',
        x1: e.pageX,
        y1: e.pageY
    })
}
const handleMouseUp = (dispatch) => (e) => {
    // replace by select
    return dispatch({
        type: 'CLEAR_SELECTED_ZONE'
    })
}
const handleMouseMove = (dispatch) => (e) => {
    // replace by select
    return dispatch({
        type: 'MOVE_SELECTED_ZONE',
        x2: e.pageX,
        y2: e.pageY
    })
}

const resetSelection = (dispatch) => (zone) => {
    // replace by select
    return dispatch({
        type: 'RESET_SELECTION',
        zone
    })
}

const select = (dispatch) => (elements, zone, selections) => {
    // console.log(elements, selections, selectionLib.areSelected(elements, zone, selections))
    if (selectionLib.areSelected(elements, zone, selections)) {
        return dispatch({
            type: 'REMOVE_SELECTION',
            elements,
            zone
        })
    } else {
        return dispatch({
            type: 'ADD_SELECTION',
            elements,
            zone
        })
    }
    // console.log(selections)
}

exports.addSelection = addSelection
exports.removeSelection = removeSelection
exports.select = select
exports.handleMouseDown = handleMouseDown
exports.handleMouseMove = handleMouseMove
exports.handleMouseUp = handleMouseUp
