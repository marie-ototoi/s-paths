import { combineReducers } from 'redux'
import selections from './selections'
import display from './display'
import undoable from 'redux-undo'

const discoverApp = combineReducers({
  selections: undoable(selections, {
    filter: 'undoFilter'
  }), 
  display
})

export default discoverApp
