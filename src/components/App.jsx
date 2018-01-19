import React from 'react'
import { connect } from 'react-redux'
// components
import HeatMap from './views/HeatMap'
import Timeline from './views/Timeline'
import Map from './views/Map'
import Transition from './elements/Transition'
import Debug from './Debug'
// libs
import scale from '../lib/scaleLib'
import dataLib from '../lib/dataLib'
import configLib from '../lib/configLib'
import selectionLib from '../lib/selectionLib'
// redux actions
import { getScreen, setDisplay } from '../actions/displayActions'
import { endTransition, loadData } from '../actions/dataActions'

class App extends React.Component {
    constructor (props) {
        super(props)
        // resize handled in the app component only: it updates display reducer that triggers rerender if needed
        this.onResize = this.onResize.bind(this)
        window.addEventListener('resize', this.onResize)
        // transition state is handled locally in the component, to avoid re-rendering
        this.handleTransition = this.handleTransition.bind(this)
        this.handleEndTransition = this.handleEndTransition.bind(this)
        this.customState = {
            main_target: [],
            main_origin: [],
            aside_target: [],
            aside_origin: []
        }
    }
    componentDidMount () {
        this.onResize()
        const { dataset, views } = this.props
        // this is where it all starts
        this.props.loadData(dataset, views)
    }
    handleTransition (view, state, elements) {
        this.customState[`${view}_${state}`] = elements
        // when both main and aside target are displayed
        if (this.customState.main_target.length > 0) { // && this.customState.aside_target.length > 0
            // launch transitions
            this.customState.step = 'launch'
            this.render()
        }
    }
    handleEndTransition (view) {
        this.customState[`${view}_target`] = []
        // when both main and aside transitions are done (could actually react to the first call since they are in the same timing)
        if (this.customState.main_target.length === 0) { // && this.customState.aside_target.length === 0
            // stop transitions
            this.customState.step = 'done'
            this.props.endTransition()
        }
    }
    render () {
        const { configs, display, env, data, selections } = this.props
        // debug logs
        // console.log('env', env)
        // console.log('mode', mode)
        // console.log('display', display)
        // console.log('views', views)
        // console.log('dataset', dataset)
        // console.log('configs', configs)
        // console.log('data', data)
        // console.log('selections', selections)
        const componentIds = {
            'HeatMap': HeatMap,
            'Timeline': Timeline
        }
        const main = configLib.getConfigs(configs, 'main')
        const MainComponent = main ? componentIds[main.id] : ''
        const aside = configLib.getConfigs(configs, 'aside')
        const SideComponent = aside ? componentIds[aside.id] : ''
        // relies data in the reducer to know if the current state is transition or active
        const status = dataLib.getCurrentState(data)
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
                { main && status === 'transition' && dataLib.areLoaded(data, 'main', 'transition') &&
                    <MainComponent
                        role = "target"
                        zone = "main"
                        data = { dataLib.getResults(data, 'main', 'transition') }
                        configs = { configLib.getConfigs(configs, 'main', 'transition') }
                        selections = { selectionLib.getSelections(selections, 'main', 'transition') }
                        ref = "main"
                        handleTransition = { this.handleTransition }
                    />
                }
                { main && status === 'transition' && this.customState.step === 'launch' &&
                    <Transition
                        zone = "main"
                        elements = { dataLib.getTransitionElements(this.customState.main_origin, this.customState.main_target) }
                        endTransition = { this.handleEndTransition }
                    />
                }
                { main && dataLib.areLoaded(data, 'main', 'active') &&
                    <MainComponent
                        role = "origin"
                        zone = "main"
                        step = { this.customState.step }
                        data = { dataLib.getResults(data, 'main', 'active') }
                        configs = { configLib.getConfigs(configs, 'main', 'active') }
                        selections = { selectionLib.getSelections(selections, 'main', 'active') }
                        ref = "transition"
                        handleTransition = { this.handleTransition }
                    />
                }
                { aside && dataLib.areLoaded(data, 'aside', 'active') && false &&
                    <SideComponent
                        zone = "aside"
                        data = { dataLib.getResults(data, 'aside', 'active') }
                        configs = { configLib.getConfigs(configs, 'aside', 'active') }
                        selections = { selectionLib.getSelections(selections, 'aside', 'active') }
                    />
                }
            </svg>
        </div>)
    }

    onResize () {
        const { display, env, mode } = this.props
        // change this for an action function
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
        configs: state.configs.present,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        endTransition: endTransition(dispatch),
        loadData: loadData(dispatch),
        setDisplay: setDisplay(dispatch)
    }
}

const AppConnect = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppConnect
