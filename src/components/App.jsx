// import * as d3 from 'd3'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

// components
import BrushLink from './elements/BrushLink'
import Header from './elements/Header'
import History from './elements/History'
import Settings from './elements/Settings'
import Slider from './elements/Slider'
import Transition from './elements/Transition'
import GeoMap from './views/Geo'
import HeatMap from './views/HeatMap'
import Images from './views/Images'
import ListAllProps from './views/ListAllProps'
import SingleProp from './views/SingleProp'
import StackedChart from './views/StackedChart'
import Timeline from './views/Timeline'
import TreeMap from './views/TreeMap'
import URIWheel from './views/URIWheel'
// libs
import { getDimensions, getScreen, throttle } from '../lib/scaleLib'
import { areLoaded, getCurrentState, getResults, getTransitionElements } from '../lib/dataLib'
import { getSelectedView, getCurrentConfigs } from '../lib/configLib'
import * as selectionLib from '../lib/selectionLib'
// redux actions
import { setDisplay } from '../actions/displayActions'
import { endTransition, loadResources } from '../actions/dataActions'
import { handleMouseUp } from '../actions/selectionActions'

class App extends React.PureComponent {
    constructor (props) {
        super(props)
        // resize handled in the app component only: it updates display reducer that triggers rerender if needed
        this.onResize = this.onResize.bind(this)
        // transition state is handled locally in the component, to avoid re-rendering
        this.handleMouseMove = this.handleMouseMove.bind(this)
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
            aside_transition: null
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
    }
    handleMouseMove (e, zone) {
        /* const { display, selections } = this.props
        if (display.selectedZone[zone].x1 !== null) {
            //console.log(this.refmain.getWrappedInstance().getElementsInZone({zoneDimensions:}))
            const selectedZone = selectionLib.getRectSelection({
                ...display.selectedZone[zone],
                x2: e.pageX,
                y2: e.pageY
            })
            // console.log(zone, selectedZone, display.viz[zone + '_x'])
            d3.select(this['refView']).selectAll('rect.selection')
                .data([selectedZone])
                .enter()
                .append('rect')
                .attr('class', 'selection')
                .on('mouseup', d => {
                    console.log(d3.event.pageX, d3.event.pageY)
                    this.props.handleMouseUp({
                        pageX: d3.event.pageX - display.viz[zone + '_x'],
                        pageY: d3.event.pageY - display.viz[zone + '_top_padding'] - display.viz.top_margin
                    }, zone, display, this.refmain.getWrappedInstance(), selections)
                })
            d3.select(this['refView']).select('rect.selection')
                .attr('width', selectedZone.x2 - selectedZone.x1)
                .attr('height', selectedZone.y2 - selectedZone.y1)
                .attr('x', selectedZone.x1)
                .attr('y', selectedZone.y1)
        } */
    }
    handleTransition (props, elements) {
        const { role, status, zone } = props
        const { data, configs } = this.props
        // console.log(role, status, zone)
        if (role === 'origin') {
            let updateState = {}
            if (zone === 'aside') {
                // console.log(this.state.main_origin, elements)
                if (this.state.main_origin) updateState[`${zone}_transition`] = getTransitionElements(this.state.main_origin, elements, getSelectedView(getCurrentConfigs(configs, 'aside', 'active'), 'aside'), getSelectedView(getCurrentConfigs(configs, 'main', 'active'), 'main'), getResults(data, 'main', 'delta'), 'aside')
            } 
            if (JSON.stringify(elements) !== JSON.stringify(this.state[`${zone}_origin`])) {
                // console.log('x - transition ORIGIN LAID OUT', zone, elements)
                updateState[`${zone}_origin`] =  elements
            }
            if (this.state[`${zone}_step`] === 'done' && status === 'active') {
                // console.log('4 - c est fini, on peut faire un reset ?', zone, this.state)
                updateState[`${zone}_step`] = 'active'
                updateState[`${zone}_target`] = null 
            }
            this.setState(updateState)
        } else if (role === 'target') {
            // console.log('transition target laid out', zone, role, elements)
            if (JSON.stringify(elements) !== JSON.stringify(this.state[`${zone}_target`])) {
                // console.log('2 - ON CHANGE, les elements sont modifies ', zone, elements)
                // console.log(this.props.dataset)
                let transitionElements
                if (elements.length > 0 && zone === 'main') {
                    transitionElements = getTransitionElements(this.state[`${zone}_origin`], elements, getSelectedView(getCurrentConfigs(configs, zone, 'active'), zone), getSelectedView(getCurrentConfigs(configs, zone, 'transition'), zone), getResults(data, zone, 'delta'), zone)
                } else {
                    transitionElements = { origin:this.state[`${zone}_origin`], target: [] }
                }
                // console.log(transitionElements)
                this.setState({ [`${zone}_target`]: elements, [`${zone}_transition`]: transitionElements, [`${zone}_step`]: 'changing' })
            }
        }
    }
    handleEndTransition (zone) {
        // console.log('3 - transition ended', zone)
        this.setState({ [`${zone}_step`]: 'done', [`${zone}_target`]: [] })
        if (!this.props.configs.future.length > 0) this.props.endTransition(zone)
    }
    UNSAFE_componentWillUpdate (nextProps, nextState) {
        // console.log('foutu ?', getCurrentState(this.props.data, 'main'), getCurrentState(nextProps.data, 'main'))
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
        const { configs, data, display, selections } = this.props
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
            'ListAllProps': ListAllProps,
            'SingleProp': SingleProp,
            'StackedChart': StackedChart,
            'Timeline': Timeline,
            'TreeMap': TreeMap,
            'URIWheel': URIWheel
        }
        // relies on data in the reducer to know if the current state is transition or active
        const statusMain = getCurrentState(this.props.data, 'main')
        const mainConfig = getSelectedView(getCurrentConfigs(configs, 'main', 'active'), 'main')
        // console.log(getCurrentConfigs(configs, 'transition'))
        const mainTransitionConfig = getSelectedView(getCurrentConfigs(configs, 'main', 'transition'), 'main')
        const MainComponent = mainConfig ? componentIds[mainConfig.id] : ''
        const MainTransitionComponent = mainTransitionConfig ? componentIds[mainTransitionConfig.id] : ''
        const asideConfig = getSelectedView(getCurrentConfigs(configs, 'aside', 'active'), 'aside')
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
        >
            { mainConfig &&
                <Header
                    zone = "main"
                    config = { mainConfig }
                />
            }
            { (!mainConfig || display.settingsOpen.main) &&
                <Settings
                    dimensions = { getDimensions('settings', display.viz) }
                />
            }
            <svg
                ref = {(c) => { this['refView'] = c }}
                width = { display.screen.width }
                height = { display.screen.height + 10 }
                style = {{ position: 'absolute', top: 0 }}
            >
                
                { mainConfig && 
                    this.state.main_step === 'changing' &&
                    <Transition
                        zone = "main"
                        dimensions = { getDimensions('mainbrush', display.viz) }
                        elements = { this.state.main_transition }
                        endTransition = { this.handleEndTransition }
                    />
                }
                { asideConfig && data.past.length > 1 &&
                    this.state.main_step === 'active' &&
                    this.state.aside_transition &&
                    display.viz.aside_width > 500 &&
                    <BrushLink
                        zone = "aside"
                        dimensions = { getDimensions('asidebrush', display.viz) }
                        elements = { this.state.aside_transition }
                        step = { this.state.main_step }
                    />
                }
                { this.state.main_transition &&
                    <BrushLink
                        zone = "main"
                        dimensions = { getDimensions('mainbrush', display.viz) }
                        elements = { this.state.main_transition }
                        step = { this.state.main_step }
                    />
                }
               
                <History
                    zone = "main"
                />
            </svg>
            <div style = {{ position: 'absolute', width: display.viz.aside_width + 'px', height: display.screen.height - 10 + 'px' }}> 
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
                        handleMouseMove = { this.handleMouseMove }
                        handleTransition = { this.handleTransition }
                    />
                }
                
            
            </div>
            <div style = {{ position: 'absolute', left: display.viz.aside_width + 'px', width: display.viz.main_width + 'px', height: display.screen.height - 10 + 'px' }}>
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
                        config = { getSelectedView(getCurrentConfigs(configs, 'main', 'transition'), 'main') }
                        selections = { selectionLib.getSelections(selections, 'main', 'transition') }
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
                        handleMouseMove = { this.handleMouseMove }
                        handleTransition = { this.handleTransition }
                    />
                }
            
            </div>
            <Slider />
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
    loadResources: PropTypes.func,
    select: PropTypes.func,
    setDisplay: PropTypes.func.isRequired
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
        endTransition: endTransition(dispatch),
        loadResources: loadResources(dispatch),
        setDisplay: setDisplay(dispatch),
        handleMouseUp: handleMouseUp(dispatch)
    }
}

const AppConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(App)

export default AppConnect
