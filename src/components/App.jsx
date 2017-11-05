import React from 'react'
import { connect } from 'react-redux'
import Main from './Main'
import Aside from './Aside'
import Debug from './Debug'
import svgScale from '../svg/scale'
import explore from '../model/explore'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.resize = this.resize.bind(this)
        window.addEventListener("resize", this.resize)
    }
    componentDidMount () {
        this.resize()
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
    render () {
        const { display, env, mode, dataset } = this.props

        console.log('render appeleé quand une prop change', dataset)
        if(dataset.present.status === 'off') {
            this.props.init()
        } else if(dataset.present.status === 'fetching_props') {
            explore.getStats(dataset.endpoint, dataset.entryPoint)
                .then(stats => {
                    this.props.setStats(stats)
                })
        }else if(dataset.present.status === 'fetching_data') {
            console.log('Fetch data now ! (to_do) ')

        }

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
        const { display, env, mode, dataset } = this.props
        
        let screen = {}
        screen.height = window.innerHeight - 5
        screen.width = window.innerWidth - 5

        let viewBoxDef = (env === 'dev') ? display.zonesDefPercent.dev : display.zonesDefPercent[mode||'full']
        let stage = svgScale.scaleStage(viewBoxDef, screen)
        let viewBox = svgScale.scaleViewBox(viewBoxDef, stage)
        let grid = svgScale.getGrid(display.gridDefPercent, stage)

        let zones = {}
        zones.main = svgScale.scaleViewBox(display.zonesDefPercent.main, stage)
        zones.aside = svgScale.scaleViewBox(display.zonesDefPercent.aside, stage)
        zones.aside.rotation = 0
        zones.full = svgScale.scaleViewBox(display.zonesDefPercent.full, stage)
        zones.dev = svgScale.scaleViewBox(display.zonesDefPercent.dev, stage)

        this.props.onResize({
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

function mapDispatchToProps (dispatch) {
    return {
        init: () => {
            dispatch({
                type: 'INIT'
            })
        },
        setStats: (stats) => {
            dispatch({
                type: 'SET_STATS',
                stats
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
