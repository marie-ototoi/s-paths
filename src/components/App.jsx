import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
// components
import Detail from './elements/Detail'
import GeoMap from './views/GeoMap'
import HeatMap from './views/HeatMap'
import ListAllProps from './views/ListAllProps'
import SingleProp from './views/SingleProp'
import Timeline from './views/Timeline'
import TreeMap from './views/TreeMap'
import URIWheel from './views/URIWheel'
import Transition from './elements/Transition'
import Debug from './Debug'
// libs
import { getDimensions, getScreen } from '../lib/scaleLib'
import { areLoaded, getCurrentState, getResults, getTransitionElements } from '../lib/dataLib'
import { getSelectedView, getCurrentConfigs } from '../lib/configLib'
import * as selectionLib from '../lib/selectionLib'
// redux actions
import { setDisplay } from '../actions/displayActions'
import { endTransition, loadResources } from '../actions/dataActions'

class App extends React.PureComponent {
    constructor (props) {
        super(props)
        // resize handled in the app component only: it updates display reducer that triggers rerender if needed
        this.onResize = this.onResize.bind(this)
        window.addEventListener('resize', this.onResize)
        // transition state is handled locally in the component, to avoid re-rendering
        this.handleTransition = this.handleTransition.bind(this)
        this.handleEndTransition = this.handleEndTransition.bind(this)
        this.state = {
            main_step: 'active',
            aside_step: 'active',
            main_target: null,
            main_origin: null,
            aside_target: null,
            aside_origin: null,
            main_transition: null,
            aside_transition: []
        }
    }
    componentDidMount () {
        this.onResize()
        const { dataset, views } = this.props
        // this is where it all starts
        this.props.loadResources(dataset, views)
    }
    handleTransition (props, elements) {
        const { role, status, zone } = props
        const { data, configs } = this.props
        // console.log(role, status, zone)
        if (role === 'origin') {
            if (JSON.stringify(elements) !== JSON.stringify(this.state[`${zone}_origin`])) {
                // console.log('x - transition ORIGIN LAID OUT', zone, elements)
                this.setState({ [`${zone}_origin`]: elements })
            }
            if (this.state[`${zone}_step`] === 'done' && status === 'active') {
                console.log('4 - c est fini, on peut faire un reset ?', zone, this.state)
                this.setState({ [`${zone}_step`]: 'active', [`${zone}_target`]: null })
            }
        } else if (role === 'target') {
            console.log('transition target laid out', zone, role, elements)
            if (JSON.stringify(elements) !== JSON.stringify(this.state[`${zone}_target`])) {
                console.log('2 - ON CHANGE, les elements sont modifies ', zone, elements)
                let transitionElements 
                if (elements.length > 0) {
                    transitionElements = getTransitionElements(this.state[`${zone}_origin`], elements, getSelectedView(getCurrentConfigs(configs, 'active'), zone), getSelectedView(getCurrentConfigs(configs, 'transition'), zone), getResults(data, zone, 'delta'), zone)
                } else {
                    transitionElements = { origin:this.state[`${zone}_origin`], target: [] }
                }
                console.log(transitionElements)
                this.setState({ [`${zone}_target`]: elements, [`${zone}_transition`]: transitionElements, [`${zone}_step`]: 'changing' })
            }
        }
    }
    handleEndTransition (zone) {
        console.log('3 - transition ended', zone)
        this.setState({ [`${zone}_step`]: 'done', [`${zone}_target`]: [] })
        if (!this.props.configs.future.length > 0) this.props.endTransition(zone)
    }
    UNSAFE_componentWillUpdate (nextProps, nextState) {
        // console.log('foutu ?', getCurrentState(this.props.data, 'main'), getCurrentState(nextProps.data, 'main'))
        if (getCurrentState(this.props.data, 'main') === 'active' && getCurrentState(nextProps.data, 'main') === 'transition') {
            console.log('1 - ON LANCE main')
            this.setState({ [`main_step`]: 'launch' })
        }
        if (getCurrentState(this.props.data, 'aside') === 'active' && getCurrentState(nextProps.data, 'aside') === 'transition') {
            console.log('1 - ON LANCE aside')
            this.setState({ [`aside_step`]: 'launch' })
        }
    }
    render () {
        const { configs, data, display, mode, selections } = this.props
        // debug logs
        // console.log('env', env)
        // console.log('mode', mode)
        // console.log('display', display)
        // console.log('views', this.props.views)
        // console.log('dataset', this.props.dataset)
        // console.log('configs', configs)
        // console.log('data', data)
        // console.log('selections', selections)
        const componentIds = {
            'HeatMap': HeatMap,
            'Timeline': Timeline,
            'TreeMap': TreeMap,
            'GeoMap': GeoMap,
            'URIWheel': URIWheel,
            'ListAllProps': ListAllProps,
            'SingleProp': SingleProp
        }
        // relies on data in the reducer to know if the current state is transition or active
        const statusMain = getCurrentState(this.props.data, 'main')
        const statusAside = getCurrentState(this.props.data, 'aside')
        const mainConfig = getSelectedView(getCurrentConfigs(configs, 'active'), 'main')
        // console.log(getCurrentConfigs(configs, 'transition'))
        const mainTransitionConfig = getSelectedView(getCurrentConfigs(configs, 'transition'), 'main')
        const MainComponent = mainConfig ? componentIds[mainConfig.id] : ''
        const MainTransitionComponent = mainTransitionConfig ? componentIds[mainTransitionConfig.id] : ''
        const asideConfig = getSelectedView(getCurrentConfigs(configs, 'active'), 'aside')
        const asideTransitionConfig = getSelectedView(getCurrentConfigs(configs, 'transition'), 'aside')
        const SideComponent = asideConfig ? componentIds[asideConfig.id] : ''
        const SideTransitionComponent = asideTransitionConfig ? componentIds[asideTransitionConfig.id] : ''
        const coreDimensionsMain = getDimensions('core', display.zones['main'], display.viz)
        const coreDimensionsAside = getDimensions('core', display.zones['aside'], display.viz)
        // console.log( getResults(data, 'aside', 'active') )
        // console.log( this.state.main_step)
        // to do : avoid recalculate transition data at each render
        return (<div
            className = "view"
            style = {{ width: display.screen.width + 'px' }}
        >
            <svg
                ref = {(c) => { this['refView'] = c }}
                width = { display.screen.width }
                height = { display.screen.height }
                viewBox = { `${display.viewBox.x}, ${display.viewBox.y}, ${display.viewBox.width}, ${display.viewBox.height}` }
                preserveAspectRatio = "xMinYMin meet"
            >

                { mode === 'dev' &&
                    <Debug />
                }

                { mainConfig && this.state.main_step === 'launch' &&
                    <MainTransitionComponent
                        role = "target"
                        zone = "main"
                        status = { statusMain }
                        dimensions = { coreDimensionsMain }
                        data = { getResults(data, 'main', 'transition') }
                        // coverage = { getResults(data, 'main', 'coverage') }
                        config = { getSelectedView(getCurrentConfigs(configs, 'transition'), 'main') }
                        selections = { selectionLib.getSelections(selections, 'main', 'transition') }
                        ref = {(c) => { this.refMainTransition = c }}
                        handleTransition = { this.handleTransition }
                    />
                }

                { mainConfig && this.state.main_step === 'changing' &&
                    <Transition
                        zone = "main"
                        dimensions = { coreDimensionsMain }
                        elements = { this.state.main_transition }
                        endTransition = { this.handleEndTransition }
                    />
                }

                { mainConfig && areLoaded(data, 'main', 'active') &&
                    <MainComponent
                        role = "origin"
                        zone = "main"
                        step = { this.state.main_step }
                        status = { statusMain }
                        dimensions = { coreDimensionsMain }
                        // coverage = { getResults(data, 'main', 'coverage') }
                        data = { getResults(data, 'main', 'active') }
                        config = { mainConfig }
                        selections = { selectionLib.getSelections(selections, 'main', 'active') }
                        ref = {(c) => { this.refMain = c }}
                        handleTransition = { this.handleTransition }
                    />
                }
                
                { display.detail.main &&
                    <Detail
                        zone = "main"
                        dimensions = { getDimensions('core', display.zones['main'], display.viz, { x: 5, y:5, width: -10, height: -10 }) }
                        elements = { getResults(data, 'main', 'detail') }
                    />
                }

                { asideConfig && this.state.aside_step === 'launch' &&
                    <SideTransitionComponent
                        role = "target"
                        zone = "aside"
                        status = { statusAside }
                        dimensions = { coreDimensionsAside }
                        data = { getResults(data, 'aside', 'transition') }
                        // coverage = { getResults(data, 'aside', 'coverage') }
                        config = { getSelectedView(getCurrentConfigs(configs, 'transition'), 'aside') }
                        selections = { selectionLib.getSelections(selections, 'aside', 'transition') }
                        ref = {(c) => { this.refAsideTransition = c }}
                        handleTransition = { this.handleTransition }
                    />
                }

                { asideConfig && this.state.aside_step === 'changing' &&
                    <Transition
                        zone = "aside"
                        dimensions = { coreDimensionsAside }
                        elements = { this.state.aside_transition }
                        endTransition = { this.handleEndTransition }
                    />
                }

                { asideConfig && areLoaded(data, 'aside', 'active') &&
                    <SideComponent
                        zone = "aside"
                        role = "origin"
                        dimensions = { coreDimensionsAside }
                        step = { this.state.aside_step }
                        status = { statusAside }
                        data = { getResults(data, 'aside', 'active') }
                        // coverage = { getResults(data, 'aside', 'coverage') }
                        config = { asideConfig }
                        selections = { selectionLib.getSelections(selections, 'aside', 'active') }
                        ref = {(c) => { this.refAside = c }}
                        handleTransition = { this.handleTransition }
                    />
                }

                { display.detail.aside &&
                    <Detail
                        zone = "aside"
                        dimensions = { getDimensions('core', display.zones['aside'], display.viz, { x: 5, y:5, width: -10, height: -10 }) }
                        elements = { getResults(data, 'aside', 'detail') }
                    />
                }
            </svg>
        </div>)
    }

    onResize () {
        const { display, mode } = this.props
        // change this for an action function
        this.props.setDisplay({
            mode,
            zonesDef: display.zonesDefPercent,
            gridDef: display.gridDefPercent,
            screen: getScreen(),
            vizDef: display.vizDefPercent
        })
    }
}

App.propTypes = {
    configs: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    display: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    selections: PropTypes.array.isRequired,
    role: PropTypes.string,
    step: PropTypes.string,
    views: PropTypes.array.isRequired,
    zone: PropTypes.string,
    endTransition: PropTypes.func.isRequired,
    handleTransition: PropTypes.func,
    loadResources: PropTypes.func.isRequired,
    setDisplay: PropTypes.func.isRequired
}

function mapStateToProps (state) {
    return {
        data: state.data,
        display: state.display,
        dataset: state.dataset,
        views: state.views,
        configs: state.configs,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        endTransition: endTransition(dispatch),
        loadResources: loadResources(dispatch),
        setDisplay: setDisplay(dispatch)
    }
}

const AppConnect = connect(mapStateToProps, mapDispatchToProps)(App)

export default AppConnect
