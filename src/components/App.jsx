import React from 'react'
import { connect } from 'react-redux'
import Main from './Main'

import HeatMap from './views/HeatMap'
import Timeline from './views/Timeline'
import Map from './views/Map'

import Aside from './Aside'
import Debug from './Debug'
import scale from '../lib/scaleLib'
import dataLib from '../lib/dataLib'
import { getScreen, getZones, setDisplay } from '../actions/displayActions'
import { loadData, init, setStats } from '../actions/dataActions'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.onResize = this.onResize.bind(this)
        window.addEventListener('resize', this.onResize)
    }
    getMainConfig () {
        const { configs } = this.props
        return configs.filter(c => c.zone === 'main')[0]
    }
    getSideConfig () {
        const { configs } = this.props
        return configs.filter(c => c.zone === 'aside')[0]
    }
    componentDidMount () {
        this.onResize()
        this.props.init()
        const { dataset, views } = this.props
        this.props.loadData(dataset, views)
    }
    render () {
        const { configs, display, env, mode, views, dataset, data } = this.props
        // console.log('env', env)
        // console.log('mode', mode)
        // console.log('display', display)
        // console.log('views', views)
        // console.log('dataset', dataset)
        // console.log('configs', configs)
        // console.log('data', data)
        const componentIds = {
            'HeatMap': Map,
            'Timeline': Timeline
        }

        const main = this.getMainConfig()
        const MainComponent = main ? componentIds[main.id] : ''
        const aside = this.getSideConfig()
        const SideComponent = aside ? componentIds[aside.id] : ''
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
                { main && dataLib.areLoaded(this.props.data, 'main') &&
                    <MainComponent zone = "main"/>
                }
                { aside && dataLib.areLoaded(this.props.data, 'aside') &&
                    <SideComponent zone = "aside" />
                }
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
            screen: getScreen(),
            vizDef: display.vizDefPercent
        })
    }
}

function mapStateToProps (state) {
    return {
        data: state.data,
        display: state.display,
        dataset: state.dataset.present,
        views: state.views,
        configs: state.configs.present
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
