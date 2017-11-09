import * as types from '../constants/ActionTypes'

const addSelection = (dispatch) => (selector, props) => {
    return dispatch({ 
        type: 'ADD_SELECTION', 
        selector, 
        props
    })
}

exports.addSelection = addSelection

const removeSelection = (dispatch) => (selector) => {
    return dispatch({ 
        type: 'REMOVE_SELECTION', 
        selector
    })
}

exports.removeSelection = removeSelection
