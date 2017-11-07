import React from 'react'
import { connect } from 'react-redux'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'
import scale from '../svg/scale'
import { getScreen, getZones, setDisplay } from '../actions/display'
import { loadData, init, setStats } from '../actions/data'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.onResize = this.onResize.bind(this)
        window.addEventListener("resize", this.onResize)
    }
    componentDidMount () {
        this.onResize()
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
    onResize () {
        const { display, env, mode } = this.props
        
        this.props.setDisplay({
            env, 
            mode, 
            zonesDef: display.zonesDefPercent, 
            gridDef: display.gridDefPercent, 
            screen : getScreen()

        })

/*        this.props.setDisplay({
            screen,
            viewBox,
            stage,
            grid,
            zones
        })*/
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        dataset: state.dataset
    }
}

function mapDispatchToProps (dispatch) {
    return {
        init: init(dispatch),
        loadData: loadData(dispatch),
        setDisplay: setDisplay(dispatch)
    }
}

const AppConnect = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppConnect
