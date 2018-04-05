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

// mode = main / aside / full / dev
const init = () => {
    ReactDOM.render(<Provider store = { store }><App mode = "main" /></Provider>, document.getElementById('discover'))
}
init()

export default init
