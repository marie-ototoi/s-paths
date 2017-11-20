import * as types from '../constants/ActionTypes'

const removeSelection = (dispatch) => (selector) => {
    return dispatch({
        type: 'REMOVE_SELECTION',
        selector
    })
}

const isSelected = (dispatch) => (selector, zone, selections) => {
    return selections.filter(sel => (sel.selector === selector && sel.zone === zone)).length > 0
}

const addSelection = (dispatch) => (zone, selector, props) => {
    // replace by select
    return dispatch({
        type: 'ADD_SELECTION',
        selector,
        zone,
        props
    })
}

exports.addSelection = addSelection
exports.removeSelection = removeSelection
exports.isSelected = isSelected
