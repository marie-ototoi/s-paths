import React from 'react'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'


const displayPercent = {
    dev: { x: 0, y: 0, width: 100, height: 100},
    full: { x: 35, y: 35, width: 40, height: 40},
    main: { x: 35, y: 35, width: 30, height: 30},
    aside: { x: 70, y: 35, width: 30, height: 30}
}
const gridPercent = {
    xPoints : [0, 30, 35, 65, 70, 85, 100],
    yPoints : [0, 30, 35, 65, 70, 85, 100]
}
//percentage

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            mode: props.mode || 'prod',
            display: props.display || 'main',
            displayRatio: null,
            screen: { 
                width: props.width || null,
                height: props.height || null
            },
            totalWidth: null,
            totalHeight: null,
            viewBox: { x: 0, y: 0, width: 100, height: 100},
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
        return (<div className = "view" style = {{ width: this.state.screen.width + 'px' }}>
            <svg
                ref = "view"
                width = { this.state.screen.width }
                height = { this.state.screen.height }
                viewBox = { `${ this.state.viewBox.x }, ${ this.state.viewBox.y }, ${ this.state.viewBox.width }, ${ this.state.viewBox.height }` }
                preserveAspectRatio = "xMinYMin meet"
            >
                { this.state.mode === "dev" &&
                    <Debug 
                        displayRatio = { this.state.displayRatio } 
                        display = { this.state.display } 
                        grid = { this.state.grid } 
                        stage = { this.state.stage } 
                    />
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
        let screen = {}
        screen.height = window.innerHeight - 5
        screen.width = window.innerWidth - 5

        // calculate ratio
        let displayRatio = Math.floor (screen.width / screen.height * 100) / 100

        let viewBoxPercent = (this.state.mode === 'dev')? displayPercent.dev : displayPercent[this.state.display]

        let stage = this.scaleStage(viewBoxPercent, screen)
        let viewBox = this.scaleViewBox(viewBoxPercent, stage, screen)
        let grid = this.getGrid(stage)
        /* console.log('viewBoxPercent', viewBoxPercent)
        console.log('viewBox', viewBox)
        console.log('grid', grid)
        console.log('stage', stage) */
        this.setState({ screen, displayRatio, viewBox, stage, grid })
    }

    scaleStage (viewBoxPercent, screen) {
        let width = Math.floor(screen.width * 100/ viewBoxPercent.width)
        let height = Math.floor(screen.height * 100/ viewBoxPercent.height)
        return { width, height }
    }

    scaleViewBox (viewBoxPercent, stage, screen) {
        let x = Math.floor(stage.width * viewBoxPercent.x / 100)
        let y = Math.floor(stage.height * viewBoxPercent.y / 100)
        let width = Math.floor(stage.width * viewBoxPercent.width / 100)
        let height = Math.floor(stage.height * viewBoxPercent.height / 100)
        return { x, y, width, height }
    }
    scaleX (xPoint, stage) {
        return Math.floor(stage.width * xPoint / 100)
    }
    scaleY (yPoint, stage) {
        return Math.floor(stage.height * yPoint / 100)
    }
    getGrid (stage) {
        let xPoints = gridPercent.xPoints.map(point => this.scaleX(point, stage))
        let yPoints = gridPercent.yPoints.map(point => this.scaleY(point, stage))
        return { xPoints, yPoints }
    }

}

export default App
