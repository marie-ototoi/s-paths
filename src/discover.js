import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import reducers from './reducers'
import App from './components/App'

const store = createStore(reducers)

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers/index')
        store.replaceReducer(nextRootReducer)
    })
}

// mode = main ou aside
// env = dev overwrites mode and shows debug component
const init = () => {
    ReactDOM.render(<Provider store = { store }><App mode = "main" env = "dev"/></Provider>, document.getElementById('discover'))
}
init()

export default init
