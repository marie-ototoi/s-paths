import React from 'react'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            svg: {
                width: null,
                height: null,
                element: null
            }
        }
        this.resize = this.resize.bind(this)
        window.addEventListener("resize", this.resize)
    }
    componentDidMount () {
       this.resize()
    }
    render () {
        let divStyle = {
            width: + this.state.svg.width + 'px' 
        }
        return (<div className = "view" style = { divStyle }>
            <svg
                ref = "view"
                width = { this.state.svg.width }
                height = { this.state.svg.height }
            >
            </svg>
        </div>)
    }
    setError(error) {
        //console.log('error', error)
        this.setState({ error })
    }
    update(properties) {
        //console.log(properties)
        this.setState(properties)
    }
    resize () {
        let svg = this.state.svg
        svg.height = window.innerHeight- 10
        svg.width = window.innerWidth - 10
        this.setState({ svg })
    }
}

export default App
