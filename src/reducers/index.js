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
    configs: undoable(configs, {
        filter: 'undoFilter'
    }), 
    data,
    dataset: undoable(dataset, {
        filter: 'undoFilter'
    }), 
    display,
    palettes,
    selections: undoable(selections, {
        filter: 'undoFilter'
    }), 
    views    
})

export default discoverApp
