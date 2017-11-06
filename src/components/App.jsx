import React from 'react'
import { connect } from 'react-redux'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'
import resize from '../svg/resize'
import scale from '../svg/scale'
import { loadData, init, setDisplay, setStats } from '../actions'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.resize = this.resize.bind(this)
        window.addEventListener("resize", this.resize)
    }
    componentDidMount () {
        this.resize()
        this.props.init()
        const { dataset, views } = this.props
        this.props.loadData(dataset.present.endpoint, dataset.present.entryPoint, dataset.present.constraints, views)
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
                viewBox = { `${display.viewBox.x}, ${display.viewBox.y}, ${display.viewBox.width}, ${display.viewBox.height}` }
                preserveAspectRatio = "xMinYMin meet"
            >
                { env === 'dev' &&
                    <Debug />
                }
                <Main />
                <Aside />
            </svg>
        </div>)
    }
    resize () {
        const { display, env, mode } = this.props
        
        let screen = resize.getScreen()

        let viewBoxDef = (env === 'dev') ? display.zonesDefPercent.dev : display.zonesDefPercent[mode||'full']
        let stage = scale.scaleStage(viewBoxDef, screen)
        let viewBox = scale.scaleViewBox(viewBoxDef, stage)
        let grid = scale.getGrid(display.gridDefPercent, stage)

        let zones = resize.getZones(display.zonesDefPercent, stage)

        this.props.setDisplay({
            screen,
            viewBox,
            stage,
            grid,
            zones
        })
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        dataset: state.dataset
    }
}

function mapDispatchToProps (dispatch, getState) {
    return {
        init: init(dispatch, getState),
        loadData: loadData(dispatch, getState),
        setDisplay: setDisplay(dispatch, getState)
    }
}

const AppConnect = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppConnect
