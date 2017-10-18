import React from 'react'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'

// definitions as percentage
const displayDef = {
    dev: { x: 0, y: 0, width: 100, height: 100},
    full: { x: 35, y: 35, width: 40, height: 40},
    main: { x: 35, y: 35, width: 30, height: 30},
    aside: { x: 70, y: 35, width: 30, height: 30}
}
const gridDef = {
    xPoints : [0, 30, 35, 65, 70, 85, 100],
    yPoints : [0, 30, 35, 65, 70, 85, 100]
}


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
            viewBox: { x: 0, y: 0, width: 1, height: 1 },
            mainZone: { x: 0, y: 0, width: 1, height: 1 },
            asideZone: { x: 0, y: 0, width: 1, height: 1 },
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
                <Main 
                    displayRatio = { this.state.displayRatio } 
                    display = { this.state.display } 
                    x = { this.state.mainZone.x } 
                    y = { this.state.mainZone.y } 
                    width = { this.state.mainZone.width } 
                    height = { this.state.mainZone.height } 
                />
                <Aside 
                    displayRatio = {this.state.displayRatio } 
                    display = { this.state.display } 
                    x = { this.state.asideZone.x } 
                    y = { this.state.asideZone.y } 
                    width = { this.state.asideZone.width } 
                    height = { this.state.asideZone.height } 
                />
                
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

        let viewBoxDef = (this.state.mode === 'dev')? displayDef.dev : displayDef[this.state.display]

        let stage = this.scaleStage(viewBoxDef, screen)
        let viewBox = this.scaleViewBox(viewBoxDef, stage)
        let grid = this.getGrid(stage)
        let mainZone =  this.scaleViewBox(displayDef.main, stage)
        let asideZone = this.scaleViewBox(displayDef.aside, stage)
        asideZone.rotation = 0
        /* console.log('viewBoxDef', viewBoxDef)
        console.log('viewBox', viewBox)
        console.log('grid', grid)
        console.log('stage', stage) */
        this.setState({ screen, displayRatio, viewBox, stage, grid, mainZone, asideZone })
    }

    scaleStage (viewBoxDef, screen) {
        let width = Math.floor(screen.width * 100/ viewBoxDef.width)
        let height = Math.floor(screen.height * 100/ viewBoxDef.height)
        return { width, height }
    }

    scaleViewBox (viewBoxDef, stage) {
        let x = Math.floor(stage.width * viewBoxDef.x / 100)
        let y = Math.floor(stage.height * viewBoxDef.y / 100)
        let width = Math.floor(stage.width * viewBoxDef.width / 100)
        let height = Math.floor(stage.height * viewBoxDef.height / 100)
        return { x, y, width, height }
    }
    scaleX (xPoint, stage) {
        return Math.floor(stage.width * xPoint / 100)
    }
    scaleY (yPoint, stage) {
        return Math.floor(stage.height * yPoint / 100)
    }
    getGrid (stage) {
        let xPoints = gridDef.xPoints.map(point => this.scaleX(point, stage))
        let yPoints = gridDef.yPoints.map(point => this.scaleY(point, stage))
        return { xPoints, yPoints }
    }

}

export default App
