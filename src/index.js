import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from './reducers'
import App from './components/App'

const store = createStore(
    reducers,
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const render = Component =>
    // eslint-disable-next-line react/no-render-return-value
    ReactDOM.render(
        <Provider store={store}>
            <AppContainer>
                <Component mode="dev" />
            </AppContainer>
        </Provider>,
        document.getElementById('root')
    )

render(App);

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers')
        store.replaceReducer(nextRootReducer)
    })
    module.hot.accept('./components/App', () => render(App))
}

// mode = main / aside / full / dev
