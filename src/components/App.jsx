import React from 'react'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'
import svgScale from '../svg/scale'

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
                        display = { this.state.display } 
                        grid = { this.state.grid } 
                        stage = { this.state.stage } 
                    />
                }
                <Main 
                    display = { this.state.display } 
                    x = { this.state.mainZone.x } 
                    y = { this.state.mainZone.y } 
                    width = { this.state.mainZone.width } 
                    height = { this.state.mainZone.height } 
                />
                <Aside 
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

        let viewBoxDef = (this.state.mode === 'dev')? displayDef.dev : displayDef[this.state.display]

        let stage = svgScale.scaleStage(viewBoxDef, screen)
        let viewBox = svgScale.scaleViewBox(viewBoxDef, stage)
        let grid = svgScale.getGrid(gridDef, stage)
        let mainZone =  svgScale.scaleViewBox(displayDef.main, stage)
        let asideZone = svgScale.scaleViewBox(displayDef.aside, stage)
        asideZone.rotation = 0
        this.setState({ screen, viewBox, stage, grid, mainZone, asideZone })
    }

}

export default App
