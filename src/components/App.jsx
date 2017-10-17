import React from 'react'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            display: props.display || 'full',
            displayRatio: 1.33,
            width: props.width || null,
            height: props.height || null,
            viewBox: { x: 0, y: 0, width: 133, height: 100 },
            ref: this.refs.view
        } 
        this.resize = this.resize.bind(this)
        window.addEventListener("resize", this.resize)
    }
    componentDidMount () {
        console.log('did Mount')
        this.resize()
       
    }
    componentWillUpdate () {
        console.log('will update')
   
     }
    render () {
        console.log('render')
        let divStyle = {
            width: + this.state.width + 'px' 
        }
        return (<div className = "view" style = { divStyle }>
            <svg
                ref = "view"
                width = { this.state.width }
                height = { this.state.height }

                viewBox = { `${this.state.viewBox.x}, ${this.state.viewBox.y},${this.state.viewBox.width},${this.state.viewBox.height}` }
                preserveAspectRatio = "xMinYMin meet"
            >
                <g transform = { `translate(${35 * this.state.displayRatio }, ${ 35 })` }>
                    <rect x = {1} y = {7} width = { 6 } height = { 19 } />
                    <rect x = {7} y = {1} width = { 35 } height = { 6 } />
                    <rect x = {7} y = {7} width = { 35 } height = { 19 } />
                    <rect x = {43} y = {7} width = { 6 } height = { 19 } />
                    <rect x = {7} y = {26} width = { 35 } height = { 6 } />
                </g>
                <g transform = { `translate(150, 35)` }>
                    <rect x = {1} y = {1} width = { 10} height = { 24 } fill = '#0F0' />
                    <rect x = {12} y = {1} width = { 30 } height = { 24 } fill = '#f00' />
                    <rect x = {1} y = {26} width = { 41 } height = { 6 } fill = '#00f' />
                </g>
            </svg>
        </div>)
    }
    setError(error) {
        //console.log('error', error)
        this.setState({ error })
    }
    resize () {
        console.log('resize')
        
        let height = window.innerHeight - 5
        let width = window.innerWidth - 5 
        // calculate ratio
        let displayRatio = Math.floor (width / height * 100) / 100
        let viewBox
        if (this.state.display === 'full') viewBox = { x: (35 * displayRatio), y: 35, width: (70 * displayRatio), height: 30 } 
        if (this.state.display === 'main') viewBox = { x: (35 * displayRatio), y: 35, width: (30 * displayRatio), height: 30 } 
        if (this.state.display === 'aside') viewBox =  { x: (70 * displayRatio), y: 35, width: (30 * displayRatio), height: 30 } 
        if (this.state.display === 'dev') viewBox = { x: 0, y: 0, width: (100 * displayRatio), height: 100 } 
        this.setState({ height, width, displayRatio, viewBox })
    }

}

export default App
