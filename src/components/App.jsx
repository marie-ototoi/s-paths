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
import { areLoaded, getCurrentState, getResults, getTransitionElements } from '../lib/dataLib'
import { getConfigs, getCurrentConfigs } from '../lib/configLib'
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
        const { configs, dataset, views } = this.props
        // this is where it all starts
        this.props.loadData(dataset, views, configs, {})
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
        if (getCurrentState(this.props.data, 'main') === 'active' && getCurrentState(nextProps.data, 'main') === 'transition') {
            // console.log('1 - ON LANCE main')
            this.setState({ [`main_step`]: 'launch' })
        }
        if (getCurrentState(this.props.data, 'aside') === 'active' && getCurrentState(nextProps.data, 'aside') === 'transition') {
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
        // relies on data in the reducer to know if the current state is transition or active
        const statusMain = getCurrentState(this.props.data, 'main')
        const statusAside = getCurrentState(this.props.data, 'aside')
        
        const statusConfigs = (statusMain === 'transition' || statusAside === 'transition') ? 'transition' : 'active'
        const mainConfig = getConfigs(getCurrentConfigs(configs, 'active'), 'main')
        const mainTransitionConfig = getConfigs(getCurrentConfigs(configs, 'transition'), 'main')
        const MainComponent = mainConfig ? componentIds[mainConfig.id] : ''
        const MainTransitionComponent = mainTransitionConfig ? componentIds[mainTransitionConfig.id] : ''
        const asideConfig = getConfigs(getCurrentConfigs(configs, 'active'), 'aside')
        const asideTransitionConfig = getConfigs(getCurrentConfigs(configs, 'transition'), 'aside')
        const SideComponent = asideConfig ? componentIds[asideConfig.id] : ''
        const SideTransitionComponent = asideConfig ? componentIds[asideTransitionConfig.id] : ''
        // to do : avoid recalculate transition data at each render

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

                { mainConfig && this.state.main_step === 'launch' &&
                    <MainTransitionComponent
                        role = "target"
                        zone = "main"
                        status = { statusMain }
                        data = { getResults(data, 'main', 'transition') }
                        config = { getConfigs(getCurrentConfigs(configs, 'transition'), 'main') }
                        selections = { selectionLib.getSelections(selections, 'main', 'transition') }
                        ref = "maintransition"
                        handleTransition = { this.handleTransition }
                    />
                }

                { mainConfig && this.state.main_step === 'changing' &&
                    <Transition
                        zone = "main"
                        elements = { getTransitionElements(this.state.main_origin, this.state.main_target, getConfigs(getCurrentConfigs(configs, 'active'), 'main'), getConfigs(getCurrentConfigs(configs, 'transition'), 'main'), getResults(data, 'main', 'delta'), 'main') }
                        endTransition = { this.handleEndTransition }
                    />
                }

                { mainConfig && areLoaded(data, 'main', 'active') &&
                    <MainComponent
                        role = "origin"
                        zone = "main"
                        step = { this.state.main_step }
                        status = { statusMain }
                        data = { getResults(data, 'main', 'active') }
                        config = { mainConfig }
                        selections = { selectionLib.getSelections(selections, 'main', 'active') }
                        ref = "main"
                        handleTransition = { this.handleTransition }
                    />
                }

                { asideConfig && this.state.aside_step === 'launch' &&
                    <SideTransitionComponent
                        role = "target"
                        zone = "aside"
                        status = { statusAside }
                        data = { getResults(data, 'aside', 'transition') }
                        config = { getConfigs(getCurrentConfigs(configs, 'transition'), 'aside') }
                        selections = { selectionLib.getSelections(selections, 'aside', 'transition') }
                        ref = "asidetransition"
                        handleTransition = { this.handleTransition }
                    />
                }

                { asideConfig && this.state.aside_step === 'changing' &&
                    <Transition
                        zone = "aside"
                        elements = { getTransitionElements(this.state.aside_origin, this.state.aside_target, getConfigs(getCurrentConfigs(configs, 'active'), 'aside'), getConfigs(getCurrentConfigs(configs, 'transition'), 'aside'), getResults(data, 'aside', 'delta'), 'aside') }
                        endTransition = { this.handleEndTransition }
                    />
                }

                { asideConfig && areLoaded(data, 'aside', 'active') &&
                    <SideComponent
                        zone = "aside"
                        role = "origin"
                        step = { this.state.aside_step }
                        status = { statusAside }
                        data = { getResults(data, 'aside', 'active') }
                        config = { asideConfig }
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
        configs: state.configs,
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
