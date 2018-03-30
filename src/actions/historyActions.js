import * as types from '../constants/ActionTypes'
import { ActionCreators } from 'redux-undo'

const jump = (dispatch) => (newIndex, oldIndex) => {
    if (newIndex > oldIndex) {
        dispatch(ActionCreators.jumpToFuture(newIndex - oldIndex - 1))
    } else if (newIndex < oldIndex) {
        dispatch(ActionCreators.jumpToPast(newIndex))
    }
    dispatch({
        type: types.RESET_UNIT_DIMENSIONS
    })
}

exports.jump = jump
