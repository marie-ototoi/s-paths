import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
import * as d3 from 'd3'
// components
import Header from '../elements/Header'
import Legend from '../elements/Legend'
import Nav from '../elements/Nav'
import PlainAxis from '../elements/PlainAxis'
import PropSelector from '../elements/PropSelector'
import SelectionZone from '../elements/SelectionZone'
// d3
import d3Timeline from '../../d3/d3Timeline'
// libs
import configLib from '../../lib/configLib'
import dataLib from '../../lib/dataLib'
import scaleLib, { getDimensions } from '../../lib/scaleLib'
// redux functions
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
        return !shallowEqual(this.props, nextProps)
    }
    prepareData (nextProps) {
        const { data, config, palettes, getPropPalette, dataset } = nextProps
        // prepare the data for display
        const selectedConfig = configLib.getSelectedConfig(config)
        // First prop to be displayed in the bottom axis
        const categoryProp1 = selectedConfig.properties[0].category
        const formatProp1 = selectedConfig.properties[0].format || 'YYYY-MM-DD' // change to selectedConfig.properties[0].format when stats will send format
        const nestedProp1 = dataLib.groupTimeData(data, 'prop1', { format: formatProp1, max: 50 })
        const axisBottom = dataLib.getAxis(nestedProp1, 'prop1', categoryProp1)
        const listProp1 = dataLib.getPropList(config, 0, dataset.labels)
        // Second prop to be displayed in the legend
        const nestedProp2 = d3.nest().key(legend => legend.prop2.value).entries(data).sort((a, b) => { return b.key.localeCompare(a.key) })
        const pathProp2 = selectedConfig.properties[1].path
        const categoryProp2 = selectedConfig.properties[1].category
        const colors = getPropPalette(palettes, pathProp2, nestedProp2.length)
        const legend = dataLib.getLegend(nestedProp2, 'prop2', colors, categoryProp2)
        const listProp2 = dataLib.getPropList(config, 1, dataset.labels)
        // Save to reuse in render
        this.customState = { ...this.customState, selectedConfig, nestedProp1, legend, axisBottom, listProp1, listProp2 }
    }
    handleMouseMove (e) {
        if (this.props.display.selectedZone.x1 !== null) this.props.handleMouseMove(e)
    }
    handleMouseUp (e) {
        const elements = d3Timeline.getElementsInZone(this.refs.Timeline, this.props)
        if (elements.length > 0) this.props.select(elements, this.props.zone, this.props.selections)
        this.props.handleMouseUp(e)
    }
    render () {
        const { axisBottom, legend, listProp1, listProp2 } = this.customState
        const { config, data, display, role, selections, step, zone } = this.props
        // display settings
        // console.log(step)
        const classN = `Timeline ${this.customState.elementName} role_${role}`
        const coreDimensions = getDimensions('core', display.zones[zone], display.viz)
        return (<g className = { classN } >
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseDown = { this.props.handleMouseDown }
                handleMouseMove = { this.handleMouseMove }
                handleMouseUp = { this.handleMouseUp }
            />
            { step !== 'launch' &&
            <g
                transform = { `translate(${coreDimensions.x}, ${coreDimensions.y})` }
                ref = "Timeline"
                onMouseMove = { this.handleMouseMove }
                onMouseUp = { this.handleMouseUp }
                onMouseDown = { this.props.handleMouseDown }
            ></g>
            }
            { role !== 'target' &&
            <g>
                <Header
                    zone = { zone }
                />
                <Nav
                    zone = { zone }
                    displayedInstances = { data.length } // to be fixed - works only for unit displays
                    selections = { selections }
                    config = { config }
                />
                <Legend
                    type = "plain"
                    zone = { zone }
                    offset = { { x: 10, y: 23, width: -20, height: -30 } }
                    legend = { legend }
                    selectElements = { this.selectElements }
                />
                <PlainAxis
                    type = "Bottom"
                    zone = { zone }
                    axis = { axisBottom }
                    propIndex = { 0 }
                    selectElements = { this.selectElements }
                />
                <PropSelector
                    type = "Legend"
                    propList = { listProp2 }
                    config = { config }
                    offset = { { x: 10, y: 0, width: -40, height: 0 } }
                    propIndex = { 1 }
                    zone = { zone }
                />
                <PropSelector
                    align = "right"
                    type = "AxisBottom"
                    propList = { listProp1 }
                    config = { config }
                    offset = { { x: 15, y: -14, width: -40, height: 0 } }
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
        if (this.props.role === 'target') {
            this.render()
            // console.log('called once when transition data are loaded and displayed')
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
        handleMouseDown: handleMouseDown(dispatch),
        handleMouseUp: handleMouseUp(dispatch),
        handleMouseMove: handleMouseMove(dispatch),
        select: select(dispatch)
    }
}

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps)(Timeline)

export default TimelineConnect
