import { combineReducers } from 'redux'
import selections from './selections'
import display from './selections'
import undoable from 'redux-undo'

const discoverApp = combineReducers({
  selections: undoable(selections, {
    filter: undoFilter
  }), 
  display
})

export default discoverApp
