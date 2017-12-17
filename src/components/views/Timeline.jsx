import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import d3Timeline from '../../d3/d3Timeline'
import Legend from '../elements/Legend'
import PlainAxis from '../elements/PlainAxis'
import PropSelector from '../elements/PropSelector'
import config from '../../lib/configLib'
import dataLib from '../../lib/dataLib'
import selectionLib from '../../lib/selectionLib'
import scaleLib from '../../lib/scaleLib'
import { getPropPalette } from '../../actions/palettesActions'
import { select } from '../../actions/selectionActions'

class Timeline extends React.PureComponent {
    constructor (props) {
        super(props)
        this.selectElement = this.selectElement.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.customState = {
            elementName: `Timeline_${props.zone}`,
            savedData: props.data,
            selectElement: this.selectElement,
            selectElements: this.selectElements
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
        const { data, configs, palettes, getPropPalette } = nextProps
        // prepare the data for display
        const selectedConfig = config.getSelectedConfig(configs)
        // First prop to be displayed in the bottom axis
        const categoryProp1 = selectedConfig.properties[0].category
        const formatProp1 = selectedConfig.properties[0].format || 'YYYY-MM-DD' // change to selectedConfig.properties[0].format when stats will send format
        const nestedProp1 = dataLib.groupTimeData(data, 'prop1', formatProp1, 100)
        const axisBottom = dataLib.getAxis(nestedProp1, 'prop1', categoryProp1)
        const listProp1 = dataLib.getPropList(configs, 0)
        // Second prop to be displayed in the legend
        const nestedProp2 = d3.nest().key(legend => legend.prop2.value).entries(data)
        const pathProp2 = selectedConfig.properties[1].path
        const categoryProp2 = selectedConfig.properties[1].category
        const colors = getPropPalette(palettes, pathProp2, nestedProp2.length)
        const legend = dataLib.getLegend(nestedProp2, colors, categoryProp2)
        const listProp2 = dataLib.getPropList(configs, 1)
        // Save to reuse in render
        this.customState = { ...this.customState, selectedConfig, nestedProp1, legend, axisBottom, listProp1, listProp2 }
    }
    render () {
        const { axisBottom, legend, listProp1, listProp2 } = this.customState
        const { data, configs, display, zone } = this.props
        // display settings
        const classN = `Timeline ${this.customState.elementName}`
        return (<g className = { classN } >
            <g
                transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
                ref = "Timeline">
            </g>
            <Legend
                type = "plain"
                zone = { zone }
                dimensions = { scaleLib.getDimensions('legend', display.zones[zone], display.viz, { x: 10, y: 22, width: -20, height: -30 }) }
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
                dimensions = { scaleLib.getDimensions('propSelectorLegend', display.zones[zone], display.viz, { x: 10, y: - 5, width: -80, height: 0 }) }
                selectElements = { this.selectElements }
                propIndex = { 1 }
                zone = { zone }
            />
            <PropSelector
                propList = { listProp1 }
                configs = { configs }
                dimensions = { scaleLib.getDimensions('propSelectorAxisBottom', display.zones[zone], display.viz, { x: 20, y: - 20, width: -40, height: 0 }) }
                selectElements = { this.selectElements }
                propIndex = { 0 }
                zone = { zone }
            />
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
        display: state.display,
        palettes: state.palettes
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getPropPalette: getPropPalette(dispatch),
        select: select(dispatch)
    }
}

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps)(Timeline)

export default TimelineConnect
