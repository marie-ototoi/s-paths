import * as d3 from 'd3'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

// components
import BrushLink from './elements/BrushLink'
import Details from './elements/Details'
import Header from './Header'
import Graphs from './elements/Graphs'
import History from './elements/History'
import Settings from './elements/Settings'
import Stats from './elements/Stats'
import Transition from './elements/Transition'
import GeoMap from './views/Geo'
import HeatMap from './views/HeatMap'
import Images from './views/Images'
import InfoCard from './views/InfoCard'
import ListAllProps from './views/ListAllProps'
import SingleProp from './views/SingleProp'
import StackedChart from './views/StackedChart'
import Timeline from './views/Timeline'
import TreeMap from './views/TreeMap'
import URIWheel from './views/URIWheel'
// libs
import { getDimensions, getScreen, throttle } from '../lib/scaleLib'
import { makeSelectionConstraints } from '../lib/queryLib'
import { areLoaded, getCurrentState, getResults, getTransitionElements } from '../lib/dataLib'
import { getSelectedMatch, getSelectedView, getCurrentConfigs } from '../lib/configLib'
import * as selectionLib from '../lib/selectionLib'
// redux actions
import { setDisplay, setModifier, showGraphs, closeDetails } from '../actions/displayActions'
import { endTransition, loadDetail, loadResources } from '../actions/dataActions'
import { handleMouseUp } from '../actions/selectionActions'

class App extends React.PureComponent {
    constructor (props) {
        super(props)
        // resize handled in the app component only: it updates display reducer that triggers rerender if needed
        this.onResize = this.onResize.bind(this)
        // transition state is handled locally in the component, to avoid re-rendering
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
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
            aside_transition: null,
            showConfig: (new URLSearchParams(window.location.search)).has('admin')
        }
        this.refmain = React.createRef()
        this.refaside = React.createRef()
    }
    componentDidMount () {
        this.onResize()
        const { dataset, views } = this.props
        // this is where it all starts
        this.props.loadResources(dataset, views)
        window.addEventListener('resize', throttle(this.onResize, 500))
        document.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('keyup', this.handleKeyUp)
    }
    handleTransition (props, elements) {
        const { role, status, zone } = props
        const { display, data, configs } = this.props
        // console.log(role, status, zone)
        if (role === 'origin') {
            let updateState = {}
            if ((!this.state[`${zone}_origin`] || elements.length !== this.state[`${zone}_origin`].length) ||
            (elements[0] && this.state[`${zone}_origin`][0] && elements[0].zone.width !== this.state[`${zone}_origin`][0].zone.width)) {
                // console.log('x - transition ORIGIN LAID OUT', zone, elements)
                updateState[`${zone}_origin`] =  elements
            }
            if (this.state[`${zone}_step`] === 'done' && status === 'active') {
                // console.log('4 - c est fini, on peut faire un reset ?', zone, this.state)
                updateState[`${zone}_step`] = 'active'
                updateState[`${zone}_target`] = null
            }
            // console.log(this.state.main_origin, this.state.aside_origin)
            if (zone === 'main' && this.state.aside_origin && display.viz.aside_width > 500 && configs.past.length > 1) {
                updateState.main_brush = getTransitionElements(elements, this.state.aside_origin, getSelectedView(getCurrentConfigs(configs, 'main', 'active')) , getSelectedView(getCurrentConfigs(configs, 'aside', 'active')), getResults(data, 'main', 'active'), 'main')
                updateState.side_brush = getTransitionElements(this.state.aside_origin, elements, getSelectedView(getCurrentConfigs(configs, 'aside', 'active')) , getSelectedView(getCurrentConfigs(configs, 'main', 'active')), getResults(data, 'main', 'delta'), 'aside')
            }
            //if (updateState[`${zone}_origin`] || updateState[`${zone}_step`] || updateState[`${zone}_target`] || updateState.main_brush) {
            this.setState(updateState)
            //}
        } else if (role === 'target' && zone === 'main') {
            // console.log('transition target laid out', zone, role, elements)
            if (!this.state[`${zone}_target`]) {
                // console.log('2 - ON CHANGE, les elements sont modifies ', zone, elements)
                // console.log(this.props.dataset)
                let transitionElements
                if (elements && elements.length > 0) {
                    transitionElements = getTransitionElements(this.state.main_origin, elements, getSelectedView(getCurrentConfigs(configs, 'aside', 'active')) , getSelectedView(getCurrentConfigs(configs, 'main', 'transition')), getResults(data, 'main', 'delta'), zone)
                }                
                //console.log(transitionElements)                
                this.setState({ [`${zone}_transition`]: transitionElements, [`${zone}_step`]: 'changing' })
            }
        }
    }
    handleEndTransition (zone) {
        const { display, data, configs } = this.props
        // console.log('3 - transition ended', zone, !this.props.configs.future.length > 0, this.props.configs.future)        
        this.setState({ [`${zone}_step`]: 'done', [`${zone}_target`]: [] })
        if (!this.props.configs.future.length > 0) {
            this.props.endTransition(zone)
            this.render()
        }
    }
    UNSAFE_componentWillUpdate (nextProps, nextState) {
        // console.log('foutu ?', getCurrentState(this.props.data, 'main'), getCurrentState(nextProps.data, 'main'))
        if (getCurrentState(this.props.data, 'main') === 'active' && getCurrentState(nextProps.data, 'main') === 'transition') {
            // console.log('1 - ON LANCE main')
            this.setState({ [`main_step`]: 'launch', [`aside_step`]: 'launch' })
        }
    }
    handleKeyDown (event) {
        // console.log('down', event.keyCode)
        let { dataset, display, configs, selections } = this.props
        // console.log('eee', event.which, event.key, event.metaKey, event)
        if (event.keyCode === 13) {
            this['refHeader'].getWrappedInstance().handleKeyDown(event)
        }
        if (event.keyCode === 32 || event.keyCode === 16 || event.keyCode === 18) {
            this.props.setModifier(event.which)
        }
        if (event.keyCode === 69 && (event.metaKey || event.ctrlKey)) {
            this.props.showGraphs()
        }
        if (event.keyCode === 73 && (event.metaKey || event.ctrlKey)) {
            if (display.details.length > 0) {
                this.props.closeDetails()
            } else {
                let zone = (selections.some(s => s.zone === 'main')) ? 'main' : 'aside'
                let activeConfigs = getCurrentConfigs(configs, 'main', 'active')
                let config = getSelectedView(activeConfigs)
                if (selections.length > 0) {
                    let selectedConfig = getSelectedMatch(config, zone)
                    let constraints
                    let entrypoint = dataset.entrypoint
                    
                    constraints = makeSelectionConstraints([selections], selectedConfig, zone, { ...dataset, entrypoint, stats: activeConfigs.stats })
                    // let { constraints, zone } = this['refHeader'].getWrappedInstance().getDetailSelection(event)
                    this.props.loadDetail({ ...dataset, entrypoint, stats: activeConfigs.stats, constraints }, activeConfigs, zone)
                }
            }
        }
    }
    handleKeyUp (event) {
        // console.log('up', event.which)
        if (event.which === 16 || event.which === 32 || event.which === 18) {
            this.props.setModifier(null)
        }
    }
    render () {
        const { configs, data, dataset, display, selections } = this.props
        // debug logs
        // console.log('display', display)
        // console.log('views', this.props.views)
        // console.log('dataset', this.props.dataset)
        // console.log('configs', configs)
        // console.log('data', data)
        // console.log('selections', selections)
        const componentIds = {
            'GeoMap': GeoMap,
            'HeatMap': HeatMap,
            'Images': Images,
            'InfoCard': InfoCard,
            'ListAllProps': ListAllProps,
            'SingleProp': SingleProp,
            'StackedChart': StackedChart,
            'Timeline': Timeline,
            'TreeMap': TreeMap,
            'URIWheel': URIWheel
        }
        // relies on data in the reducer to know if the current state is transition or active
        const statusMain = getCurrentState(this.props.data, 'main')
        let mainConfig = (dataset.resources.length === 0) ? undefined : getSelectedView(getCurrentConfigs(configs, 'main', 'active'))
        //console.log(statusMain, dataset.resources, getCurrentConfigs(configs, 'main', 'active'), this.state.main_step, mainConfig)
        const mainTransitionConfig = getSelectedView(getCurrentConfigs(configs, 'main', 'transition'))
        const MainComponent = mainConfig ? componentIds[mainConfig.id] : ''
        const MainTransitionComponent = mainTransitionConfig ? componentIds[mainTransitionConfig.id] : ''
        const asideConfig = getSelectedView(getCurrentConfigs(configs, 'aside', 'active'))
        const SideComponent = asideConfig ? componentIds[asideConfig.id] : ''
        const coreDimensionsMain = getDimensions('main', display.viz)
        const coreDimensionsAside = getDimensions('aside', display.viz)
        // console.log(mainConfig, getCurrentConfigs(configs, 'main', 'active'))
        // console.log(mainTransitionConfig, getCurrentConfigs(configs, 'main', 'transition'))
        // console.log(asideConfig, getCurrentConfigs(configs, 'aside', 'active'))
        // console.log(getResults(data, 'aside', 'active'))
        // to do : avoid recalculate transition data at each render
        return (<div
            className = "view"
            style = {{ width: display.screen.width + 'px' }}
            tabIndex = { 0 }
            autoFocus = { true }
        >
            { mainConfig &&
                <Header
                    ref = {(c) => { this['refHeader'] = c }}
                    zone = "main"
                    config = { mainConfig }
                    step = { this.state.main_step }
                    elements = { this.state.main_transition }
                />
            }
            
            <div style = {{ position: 'absolute' }} className = "asideComponent"> 
                
                { asideConfig && data.past.length > 1 && 
                    this.state.main_step === 'active' && 
                    areLoaded(data, 'aside', 'active') &&
                    display.viz.aside_width > 500 &&
                    <SideComponent
                        zone = "aside"
                        role = "origin"
                        dimensions = { coreDimensionsAside }
                        step = { this.state.main_step }
                        status = { statusMain }
                        data = { getResults(data, 'aside', 'active') }
                        // coverage = { getResults(data, 'aside', 'coverage') }
                        config = { asideConfig }
                        selections = { selections }
                        ref = {(c) => { this.refaside = c }}
                        handleMouseDown = { this.handleMouseDown }
                        handleTransition = { this.handleTransition }
                    />
                }
                
            
            </div>
            <div style = {{ position: 'absolute', left: display.viz.aside_width + 'px' }} className = "mainComponent">
                { mainConfig && 
                    this.state.main_step === 'launch' &&
                    <MainTransitionComponent
                        role = "target"
                        zone = "main"
                        status = { statusMain }
                        step = { this.state.main_step }
                        dimensions = { coreDimensionsMain }
                        data = { getResults(data, 'main', 'transition') }
                        // coverage = { getResults(data, 'main', 'coverage') }
                        config = { getSelectedView(getCurrentConfigs(configs, 'main', 'transition')) }
                        selections = { [] }
                        ref = {(c) => { this.refMainTransition = c }}
                        handleTransition = { this.handleTransition }
                    />
                }
                
                { mainConfig &&
                    areLoaded(data, 'main', 'active') &&
                    <MainComponent
                        role = "origin"
                        zone = "main"
                        step = { this.state.main_step }
                        status = { statusMain }
                        dimensions = { coreDimensionsMain }
                        // coverage = { getResults(data, 'main', 'coverage') }
                        data = { getResults(data, 'main', 'active') }
                        config = { mainConfig }
                        selections = { selections }
                        ref = {(c) => { this.refmain = c }}
                        handleMouseDown = { this.handleMouseDown }
                        handleTransition = { this.handleTransition }
                    />
                }
            
            </div>
            { (!mainConfig || display.statsOpen) && this.state.showConfig &&
                <Stats
                    dimensions = { getDimensions('stats', display.viz) }
                />
            }
            { (display.settingsOpen) &&
                <Settings
                    dimensions = { getDimensions('settings', display.viz, { x: 0, y: 10, width: -10, height: 0 }) }
                />
            }
            { display.graphsOpen &&
                <Graphs
                    dimensions = { getDimensions('graphs', display.viz, { x: 2, y: -60, width: 0, height: 0 }) }
                    zone = "main"
                />
            }
            { (display.details.length > 0) &&
                <Details
                    dimensions = { getDimensions('details', display.viz, { x: 1, y: 0, width: 0, height: 0 }) }
                    elements = { display.details }
                    zone = "main"
                />
            }
            
            { mainConfig && 
                this.state.main_step === 'changing' &&
                <Transition
                    zone = "main"
                    dimensions = { getDimensions('mainbrush', display.viz) }
                    elements = { this.state.main_transition || { origin: [], target: [] } }
                    endTransition = { this.handleEndTransition }
                />
            }
            { asideConfig && data.past.length > 1 &&
                this.state.side_brush &&
                display.viz.aside_width > 500 &&
                !display.selectedZone.aside.x1 &&
                !selections.some(sel => sel.zone === 'aside') &&
                <BrushLink
                    zone = "aside"
                    dimensions = { getDimensions('asidebrush', display.viz) }
                    elements = { this.state.side_brush }
                    step = { this.state.main_step }
                />
            }
            { this.state.main_brush &&
            display.viz.aside_width > 500 &&
            !display.selectedZone.main.x1 &&
            !selections.some(sel => sel.zone === 'main') &&
                <BrushLink
                    zone = "main"
                    dimensions = { getDimensions('mainbrush', display.viz) }
                    elements = { this.state.main_brush }
                    step = { this.state.main_step }
                />
            }
            <History
                zone = "main"
            />
        </div>)
    }

    onResize () {
        const { display } = this.props
        // change this for an action function
        // Throttled function
        this.props.setDisplay({
            screen: getScreen(),
            vizDefPercent: display.vizDefPercent
        })
        
    }
}

App.propTypes = {
    configs: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    display: PropTypes.object.isRequired,
    selections: PropTypes.array.isRequired,
    role: PropTypes.string,
    step: PropTypes.string,
    views: PropTypes.array.isRequired,
    endTransition: PropTypes.func.isRequired,
    handleTransition: PropTypes.func,
    handleMouseUp: PropTypes.func,
    closeDetails: PropTypes.func,
    loadDetail: PropTypes.func,
    loadResources: PropTypes.func,
    select: PropTypes.func,
    setDisplay: PropTypes.func.isRequired,
    setModifier: PropTypes.func,
    showGraphs: PropTypes.func
}

function mapStateToProps (state) {
    return {
        data: state.data,
        display: state.display,
        dataset: state.dataset,
        views: state.views,
        configs: state.configs,
        select: state.select,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        closeDetails: closeDetails(dispatch),
        endTransition: endTransition(dispatch),
        loadDetail: loadDetail(dispatch),
        loadResources: loadResources(dispatch),
        setDisplay: setDisplay(dispatch),
        setModifier: setModifier(dispatch),
        showGraphs: showGraphs(dispatch),
        handleMouseUp: handleMouseUp(dispatch)
    }
}

const AppConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(App)

export default AppConnect
