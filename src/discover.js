import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

const init = () => {
    ReactDOM.render(<App display = "full" mode = "dev"/>, document.getElementById('discover'))
}
init()

export default init