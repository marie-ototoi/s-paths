import { combineReducers } from 'redux'
import data from './data'
import dataset from './dataset'
import display from './display'
import views from './views'
import selections from './selections'
import undoable from 'redux-undo'

const discoverApp = combineReducers({
    selections: undoable(selections, {
        filter: 'undoFilter'
    }), 
    dataset: undoable(dataset, {
        filter: 'undoFilter'
    }), 
    display,
    views,
    data
})

export default discoverApp
