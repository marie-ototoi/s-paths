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
