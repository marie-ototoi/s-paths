import React from 'react'

class App extends React.Component {
    constructor (props) {
        super(props)
        let viewBox = '0 0 100 100'
        if (props.display === 'main') viewBox = '0 0 50 100' 
        if (props.display === 'aside') viewBox = '50 0 50 100' 
        this.state = {
            svg: {
                width: props.width || null,
                height: props.height || null,
                viewBox: viewBox ,
                ref: this.refs.view
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
        <p>test</p>
            <svg
                ref = "view"
                width = { this.state.svg.width }
                height = { this.state.svg.height }
                viewBox = { this.state.svg.viewBox }
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
        svg.height = window.innerHeight
        svg.width = window.innerWidth
        this.setState({ svg })
    }
}

export default App
