import React from 'react'
import { connect } from 'react-redux'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'
import svgScale from '../svg/scale'
import explore from '../model/explore'
import select from '../model/select'
import rank from '../model/rank'


class App extends React.Component {
    constructor (props) {
        super(props)
        this.resize = this.resize.bind(this)
        window.addEventListener("resize", this.resize)
    }
    componentWillMount () {
        
    }
    componentDidMount () {
        //console.log('did Mount')
        //this.viewSelection()
        this.resize()
    }
    componentDidUpdate () {
    
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
        const { display, env, mode } = this.props
        
        return (<div 
            className = "view" 
            style = {{ width: display.screen.width + 'px' }}
        >
            <svg
                ref = "view"
                width = { display.screen.width }
                height = { display.screen.height }
                viewBox = { `${ display.viewBox.x }, ${ display.viewBox.y }, ${ display.viewBox.width }, ${ display.viewBox.height }` }
                preserveAspectRatio = "xMinYMin meet"
            >
                { env === "dev" &&
                    <Debug  />
                }
                <Main />
                <Aside />
            </svg>
        </div>)
    }

    setError(error) {
        //console.log('error', error)
      
    }

    resize () {
        const { display, env, mode } = this.props

        let screen = {}
        screen.height = window.innerHeight - 5
        screen.width = window.innerWidth - 5
        //console.log(display, this.props.display)
        let viewBoxDef = (env === 'dev')? display.zonesDefPercent.dev : display.zonesDefPercent[mode||'full']
        let stage = svgScale.scaleStage(viewBoxDef, screen)
        let viewBox = svgScale.scaleViewBox(viewBoxDef, stage)
        let grid = svgScale.getGrid(display.gridDefPercent, stage)

        let zones = {}
        zones.main =  svgScale.scaleViewBox(display.zonesDefPercent.main, stage)
        zones.aside = svgScale.scaleViewBox(display.zonesDefPercent.aside, stage)
        zones.aside.rotation = 0
        zones.full =  svgScale.scaleViewBox(display.zonesDefPercent.full, stage)
        zones.dev =  svgScale.scaleViewBox(display.zonesDefPercent.dev, stage)
        
        this.props.onResize({
            screen,
            viewBox, 
            stage, 
            grid,
            zones
        })
    }
}

function mapStateToProps(state) {
    return {
        display: state.display
    }
}

function mapDispatchToProps(dispatch) {
    return {
        initEnv: (env) => {
            dispatch({
                type: 'SET_ENV',
                env
            })
        },
        initMode: (mode) => {
            dispatch({
                type: 'SET_MODE',
                mode
            })
        },
        onResize: (display) => {
            dispatch({
                type: 'SET_DISPLAY',
                ...display
            })
        }
    }
}

const AppConnect = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppConnect
