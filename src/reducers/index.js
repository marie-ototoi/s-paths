import { combineReducers } from 'redux'
import configs from './configs'
import data from './data'
import dataset from './dataset'
import display from './display'
import views from './views'
import selections from './selections'
import undoable from 'redux-undo'

const discoverApp = combineReducers({
    configs: undoable(configs, {
        filter: 'undoFilter'
    }), 
    data,
    dataset: undoable(dataset, {
        filter: 'undoFilter'
    }), 
    display,
    selections: undoable(selections, {
        filter: 'undoFilter'
    }), 
    views    
})

export default discoverApp
