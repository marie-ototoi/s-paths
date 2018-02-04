import React from 'react'
import { connect } from 'react-redux'
import shallowEqual from 'shallowequal'
// components
import HeatMap from './views/HeatMap'
import Timeline from './views/Timeline'
import Map from './views/Map'
import Transition from './elements/Transition'
import Debug from './Debug'
// libs
import { getScreen } from '../lib/scaleLib'
import dataLib from '../lib/dataLib'
import configLib from '../lib/configLib'
import selectionLib from '../lib/selectionLib'
// redux actions
import { setDisplay } from '../actions/displayActions'
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
        /* this.customState = {
            main_target: [], // these info might change often and are updated after each render
            main_origin: [] // putting them in the regular state would result in a infinite loop
        } */
        this.state = {
            main_step: 'active',
            aside_step: 'active',
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
        this.props.loadData(dataset, views, [], {})
    }
    handleTransition (props, elements) {
        const { role, status, zone } = props
        // console.log(role, status, zone, elements)
        if (role === 'origin') {
            if (JSON.stringify(elements) !== JSON.stringify(this.state[`${zone}_origin`])) {
                this.setState({ [`${zone}_origin`]: elements })
            }
            if (this.state[`${zone}_step`] === 'done' && status === 'active') {
                // console.log('on peut faire un reset ?', zone, this.state)
                this.setState({ [`${zone}_step`]: 'active' })
            }
        } else if (role === 'target' && elements.length > 0) {
            // console.log('transition target laid out', zone, role, elements)
            if (JSON.stringify(elements) !== JSON.stringify(this.state[`${zone}_target`])) {
                // console.log('2 - ON CHANGE ', zone)
                this.setState({ [`${zone}_target`]: elements, [`${zone}_step`]: 'changing' })
            }
        }
    }
    handleEndTransition (zone) {
        // console.log('transition ended', zone)
        this.setState({ [`${zone}_step`]: 'done', [`${zone}_target`]: [] })
        this.props.endTransition(zone)
    }
    componentWillUpdate (nextProps, nextState) {
        if (dataLib.getCurrentState(this.props.data, 'main') === 'active' && dataLib.getCurrentState(nextProps.data, 'main') === 'transition') {
            // console.log('1 - ON LANCE main')
            this.setState({ [`main_step`]: 'launch' })
        }
        if (dataLib.getCurrentState(this.props.data, 'aside') === 'active' && dataLib.getCurrentState(nextProps.data, 'aside') === 'transition') {
            // console.log('1 - ON LANCE aside')
            this.setState({ [`aside_step`]: 'launch' })
        }
    }
    render () {
        const { configs, data, dataset, display, env, selections } = this.props
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
        // console.log(data)
        // console.log('?????', this.state.main_step, this.state.main_origin, this.state.main_target, dataLib.getTransitionElements(this.state.main_origin, this.state.main_target))
        const statusMain = dataLib.getCurrentState(this.props.data, 'main')
        const statusAside = dataLib.getCurrentState(this.props.data, 'aside')
        // console.log('status', this.state.main_step, this.state.aside_step)
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

                { main && this.state.main_step === 'launch' &&
                    <MainComponent
                        role = "target"
                        zone = "main"
                        status = { statusMain }
                        data = { dataLib.getResults(data, 'main', 'transition') }
                        config = { configLib.getConfigs(configs, 'main', 'transition') }
                        selections = { selectionLib.getSelections(selections, 'main', 'transition') }
                        ref = "maintransition"
                        handleTransition = { this.handleTransition }
                    />
                }

                { main && this.state.main_step === 'changing' &&
                    <Transition
                        zone = "main"
                        elements = { dataLib.getTransitionElements(this.state.main_origin, this.state.main_target) }
                        endTransition = { this.handleEndTransition }
                    />
                }

                { main && dataLib.areLoaded(data, 'main', 'active') &&
                    <MainComponent
                        role = "origin"
                        zone = "main"
                        step = { this.state.main_step }
                        status = { statusMain }
                        data = { dataLib.getResults(data, 'main', 'active') }
                        config = { configLib.getConfigs(configs, 'main', 'active') }
                        selections = { selectionLib.getSelections(selections, 'main', 'active') }
                        ref = "main"
                        handleTransition = { this.handleTransition }
                    />
                }

                { aside && this.state.aside_step === 'launch' &&
                    <SideComponent
                        role = "target"
                        zone = "aside"
                        status = { statusAside }
                        data = { dataLib.getResults(data, 'aside', 'transition') }
                        config = { configLib.getConfigs(configs, 'aside', 'transition') }
                        selections = { selectionLib.getSelections(selections, 'aside', 'transition') }
                        ref = "asidetransition"
                        handleTransition = { this.handleTransition }
                    />
                }

                { aside && this.state.aside_step === 'changing' &&
                    <Transition
                        zone = "aside"
                        elements = { dataLib.getTransitionElements(this.state.aside_origin, this.state.aside_target) }
                        endTransition = { this.handleEndTransition }
                    />
                }
                { aside && dataLib.areLoaded(data, 'aside', 'active') &&
                    <SideComponent
                        zone = "aside"
                        role = "origin"
                        step = { this.state.aside_step }
                        status = { statusAside }
                        data = { dataLib.getResults(data, 'aside', 'active') }
                        config = { configLib.getConfigs(configs, 'aside', 'active') }
                        selections = { selectionLib.getSelections(selections, 'aside', 'active') }
                        ref = "aside"
                        handleTransition = { this.handleTransition }
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
