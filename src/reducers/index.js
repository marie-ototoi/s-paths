import { combineReducers } from 'redux'
import selections from './selections'
import display from './selections'

const discoverApp = combineReducers({
  selections,
  display
})

export default discoverApp
