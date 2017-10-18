import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'

const init = () => {
    ReactDOM.render(<App display = "main" mode = "dev"/>, document.getElementById('discover'))
}
init()

export default init