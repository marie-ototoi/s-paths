import * as types from '../constants/ActionTypes'

const addSelection = (dispatch) => (selector, query) => {
    return dispatch({ 
        type: 'ADD_SELECTION', 
        selector, 
        query 
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
