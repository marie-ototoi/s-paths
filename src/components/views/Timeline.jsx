import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import d3Timeline from '../../d3/d3Timeline'
import Header from '../elements/Header'
import Legend from '../elements/Legend'
import Nav from '../elements/Nav'
import PlainAxis from '../elements/PlainAxis'
import PropSelector from '../elements/PropSelector'
import SelectionZone from '../elements/SelectionZone'
import config from '../../lib/configLib'
import dataLib from '../../lib/dataLib'
import selectionLib from '../../lib/selectionLib'
import scaleLib from '../../lib/scaleLib'
import { getPropPalette } from '../../actions/palettesActions'
import { select, handleMouseDown, handleMouseMove, handleMouseUp } from '../../actions/selectionActions'

class Timeline extends React.PureComponent {
    constructor (props) {
        super(props)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.selectElement = this.selectElement.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.customState = {
            elementName: `Timeline_${props.zone}`,
            savedData: props.data,
            selectElement: this.selectElement,
            selectElements: this.selectElements,
            handleMouseUp: this.handleMouseUp
        }
    }
    componentWillMount () {
        this.prepareData(this.props)
    }
    componentWillUpdate (nextProps, nextState) {
        if (!shallowEqual(this.props.data, nextProps.data)) {
            this.prepareData(nextProps)
        }
    }
    shouldComponentUpdate (nextProps, nextState) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
    }
    prepareData (nextProps) {
        const { data, configs, palettes, getPropPalette, dataset } = nextProps
        // prepare the data for display
        const selectedConfig = config.getSelectedConfig(configs)
        // First prop to be displayed in the bottom axis
        const categoryProp1 = selectedConfig.properties[0].category
        const formatProp1 = selectedConfig.properties[0].format || 'YYYY-MM-DD' // change to selectedConfig.properties[0].format when stats will send format
        const nestedProp1 = dataLib.groupTimeData(data, 'prop1', formatProp1, 50)
        const axisBottom = dataLib.getAxis(nestedProp1, 'prop1', categoryProp1)
        const listProp1 = dataLib.getPropList(configs, 0, dataset.labels)
        // Second prop to be displayed in the legend
        const nestedProp2 = d3.nest().key(legend => legend.prop2.value).entries(data).sort((a, b) => { return b.key.localeCompare(a.key) })
        const pathProp2 = selectedConfig.properties[1].path
        const categoryProp2 = selectedConfig.properties[1].category
        const colors = getPropPalette(palettes, pathProp2, nestedProp2.length)
        const legend = dataLib.getLegend(nestedProp2, colors, categoryProp2)
        const listProp2 = dataLib.getPropList(configs, 1, dataset.labels)
        // Save to reuse in render
        this.customState = { ...this.customState, selectedConfig, nestedProp1, legend, axisBottom, listProp1, listProp2 }
    }
    handleMouseMove (e) {
        if (this.props.display.selectedZone.x1 !== null) this.props.handleMouseMove(e)
    }
    handleMouseUp (e) {
        const elements = d3Timeline.getElementsInZone(this.refs.Timeline, this.props)
        if (elements.length > 0 &&
            (Math.abs(e.pageX - this.props.display.selectedZone.x1) > 1 &&
            Math.abs(e.pageY - this.props.display.selectedZone.y1) > 1)) this.props.select(elements, this.props.zone, this.props.selections)
        this.props.handleMouseUp(e)
    }
    render () {
        const { axisBottom, legend, listProp1, listProp2 } = this.customState
        const { configs, data, display, role, selections, status, zone } = this.props
        // display settings
        const classN = `Timeline ${this.customState.elementName} status_${status}`
        return (<g className = { classN } >
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseDown = { this.props.handleMouseDown }
                handleMouseMove = { this.handleMouseMove }
                handleMouseUp = { this.handleMouseUp }
            />
            <g
                transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
                ref = "Timeline"
                onMouseMove = { this.handleMouseMove }
                onMouseUp = { this.handleMouseUp }
                onMouseDown = { this.props.handleMouseDown }
            >
            </g>
            { role !== 'transition' &&
            <g>
                <Header
                    zone = { zone }
                    dimensions = { scaleLib.getDimensions('header', display.zones[zone], display.viz, { x: 0, y: 0, width: 0, height: 0 }) }
                />
                <Nav
                    zone = { zone }
                    displayedInstances = { data.length }
                    selections = { selections }
                    dimensions = { scaleLib.getDimensions('nav', display.zones[zone], display.viz, { x: 0, y: 0, width: 0, height: 0 }) }
                />
                <Legend
                    type = "plain"
                    zone = { zone }
                    dimensions = { scaleLib.getDimensions('legend', display.zones[zone], display.viz, { x: 10, y: 23, width: -20, height: -30 }) }
                    legend = { legend }
                    selectElements = { this.selectElements }
                />
                <PlainAxis
                    type = "Bottom"
                    zone = { zone }
                    axis = { axisBottom }
                    dimensions = { scaleLib.getDimensions('axisBottom', display.zones[zone], display.viz) }
                    propIndex = { 0 }
                    selectElements = { this.selectElements }
                />
                <PropSelector
                    propList = { listProp2 }
                    configs = { configs }
                    dimensions = { scaleLib.getDimensions('propSelectorLegend', display.zones[zone], display.viz, { x: 10, y: 0, width: -40, height: 0 }) }
                    selectElements = { this.selectElements }
                    propIndex = { 1 }
                    zone = { zone }
                />
                <PropSelector
                    align = "right"
                    propList = { listProp1 }
                    configs = { configs }
                    dimensions = { scaleLib.getDimensions('propSelectorAxisBottom', display.zones[zone], display.viz, { x: 15, y: -14, width: -40, height: 0 }) }
                    selectElements = { this.selectElements }
                    propIndex = { 0 }
                    zone = { zone }
                />
            </g>
            }
        </g>)
    }
    selectElements (prop, value, category) {
        const elements = d3Timeline.getElements(this.refs.Timeline, prop, value, category)
        // console.log(prop, value, elements)
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
    selectElement (selection) {
        const { select, zone, selections } = this.props
        select([selection], zone, selections)
    }
    componentDidMount () {
        // console.log(this.props.data)
        d3Timeline.create(this.refs.Timeline, { ...this.props, ...this.customState })
        if (this.props.role === 'transition') {
            console.log('called once when transition data are loaded and displayed')   
        }
    }
    componentDidUpdate () {
        // console.log('update', this.props.selections)
        d3Timeline.update(this.refs.Timeline, { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        d3Timeline.destroy(this.refs.Timeline, { ...this.props, ...this.customState })
    }
}

function mapStateToProps (state) {
    return {
        dataset: state.dataset.present,
        display: state.display,
        palettes: state.palettes
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getPropPalette: getPropPalette(dispatch),
        select: select(dispatch),
        handleMouseDown: handleMouseDown(dispatch),
        handleMouseUp: handleMouseUp(dispatch),
        handleMouseMove: handleMouseMove(dispatch)
    }
}

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps)(Timeline)

export default TimelineConnect
