import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'

const init = () => {
    ReactDOM.render(<App />, document.getElementById('semexp'))
}
init()

export default init