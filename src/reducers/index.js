import { combineReducers } from 'redux'
import configs from './configs'
import data from './data'
import dataset from './dataset'
import display from './display'
import palettes from './palettes'
import views from './views'
import selections from './selections'
import undoable from 'redux-undo'

const discoverApp = combineReducers({
    configs: undoable(configs, { filter: (action, currentState, previousState) => {
        // console.log('changed', currentState, previousState, currentState !== previousState)
        return currentState !== previousState // only add to history if state changed
    }}),
    data: undoable(data, { filter: (action, currentState, previousState) => {
        return currentState !== previousState
    }}),
    dataset,
    display,
    palettes,
    selections,
    views
})

export default discoverApp
