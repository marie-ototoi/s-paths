import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducers from '../reducers'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'
import svgScale from '../svg/scale'
import explore from '../model/explore'
import select from '../model/select'
import rank from '../model/rank'

const store = createStore(reducers);

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index')
      store.replaceReducer(nextRootReducer)
    })
}

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
const defaultZone = { x: 0, y: 0, width: 10, height: 10 }

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
            viewBox: defaultZone,
            mainZone: defaultZone,
            asideZone: defaultZone,
            selection: [],
            ref: this.refs.view
        }
        this.resize = this.resize.bind(this)
        window.addEventListener("resize", this.resize)
    }
    
    componentDidMount () {
        // console.log('did Mount')
        //this.viewSelection()
        this.resize()
    }

    addToSelection () {

    }
    
    /*viewSelection () {
        explore.exploreProperties(this.state.selection)
        .then(stats => {
            this.setState({ stats })
            return rank.rankViews(stats)
        })
        .then(views => {
            this.setState({ views })
            return select.selectView({ options: 'to_be_defined' })
        })
        .then(selectedView => {
            this.setState({ selectedView })
            return datapoint.getData(this.state.selection, this.state.selectedView)
        })
        .then(selectedView => {
            this.setState({ selectedView })
            return datapoint.getData(this.state.selection, this.state.selectedView)
        })
        .catch(err => {
            console.error(err)
        })
    }*/
    
    componentWillUpdate () {
        //console.log('will update')
    }

    render () {
        return (<div className = "view" style = {{ width: this.state.screen.width + 'px' }}>
            <Provider store = { store }>
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
            </Provider>
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
