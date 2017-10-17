import React from 'react'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'


const grid = {
    xPoints: [0, 30, 35, 65, 70, 100],
    yPoints: [0, 30, 35, 65, 70, 100]
}
//percentage

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            mode: props.mode || 'prod',
            display: props.display || 'main',
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
        // console.log('did Mount')
        this.resize()
    }
    componentWillUpdate () {
        //console.log('will update')
   
     }
    render () {
        //console.log('render')
        return (<div className = "view" style = {{ width: this.state.width + 'px' }}>
            <svg
                ref = "view"
                width = { this.state.width }
                height = { this.state.height }
                viewBox = { `${ this.state.viewBox.x }, ${ this.state.viewBox.y }, ${ this.state.viewBox.width }, ${ this.state.viewBox.height }` }
                preserveAspectRatio = "xMinYMin meet"
            >
                { this.state.mode === "dev" &&
                    <Debug displayRatio = { this.state.displayRatio } display = { this.state.display } />
                }
                <Main displayRatio = { this.state.displayRatio } display = { this.state.display } />
                <Aside displayRatio = { this.state.displayRatio } display = { this.state.display } />
                
            </svg>
        </div>)
    }
    setError(error) {
        //console.log('error', error)
        this.setState({ error })
    }
    resize () {
        //console.log('resize')
        
        let height = window.innerHeight - 5
        let width = window.innerWidth - 5
        // calculate ratio
        let displayRatio = Math.floor (width / height * 100) / 100

        let viewBox
        if (this.state.mode === 'dev') {
            viewBox = { x: 0, y: 0, width: Math.floor(100 * displayRatio), height: 100 } 
        } else {
            if (this.state.display === 'full') viewBox = { x: Math.floor(35 * displayRatio), y: 35, width: Math.floor(70 * displayRatio), height: 30 } 
            if (this.state.display === 'aside') viewBox =  { x: Math.floor(70 * displayRatio), y: 35, width: Math.floor(30 * displayRatio), height: 30 } 
            if (this.state.display === 'main') viewBox = { x: Math.floor(35 * displayRatio), y: 35, width: Math.floor(30 * displayRatio), height: 30 } 
        }
        this.setState({ height, width, displayRatio, viewBox })
    }

}

export default App
