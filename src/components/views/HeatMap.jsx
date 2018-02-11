import React from 'react'
import * as d3 from 'd3'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
// components
import Header from '../elements/Header'
import Legend from '../elements/Legend'
import Nav from '../elements/Nav'
import PlainAxis from '../elements/PlainAxis'
import PropSelector from '../elements/PropSelector'
import SelectionZone from '../elements/SelectionZone'
// d3
import d3HeatMap from '../../d3/d3HeatMap'
// libs
import configLib from '../../lib/configLib'
import dataLib from '../../lib/dataLib'
import { getQuantitativeColors } from '../../lib/paletteLib'
import scaleLib, { getDimensions } from '../../lib/scaleLib'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { select, handleMouseDown, handleMouseMove, handleMouseUp } from '../../actions/selectionActions'

class HeatMap extends React.Component {
    constructor (props) {
        super(props)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.selectElement = this.selectElement.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.customState = {
            elementName: `HeatMap_${props.zone}`,
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
        const { data, dataset, config, palettes, getPropPalette, zone } = nextProps
        // prepare the data for display
        const selectedConfig = configLib.getSelectedConfig(config, zone)
        // First prop to be displayed in the bottom axis
        const categoryProp1 = selectedConfig.properties[0].category
        const formatProp1 = selectedConfig.properties[0].format || 'YYYY-MM-DD' // change to selectedConfig.properties[0].format when stats will send format
        const nestedProp1 = dataLib.groupTimeData(data, 'prop1', {
            format: formatProp1,
            max: 50,
            subgroup: 'prop2'
        })
        const axisBottom = dataLib.getAxis(nestedProp1, 'prop1', categoryProp1)
        const listProp1 = dataLib.getPropList(config, zone, 0, dataset.labels)
        const categoryProp2 = selectedConfig.properties[1].category
        const nestedProp2 = dataLib.groupTextData(data, 'prop2')
        const axisLeft = dataLib.getAxis(nestedProp2, 'prop2', categoryProp2)
        const listProp2 = dataLib.getPropList(config, zone, 1, dataset.labels)

        const colors = getQuantitativeColors()
        const thresholds = dataLib.getThresholdsForLegend(nestedProp1, 'prop2', categoryProp2, colors.length)
        const legend = dataLib.getLegend(thresholds, 'countprop2', colors, 'aggregate')
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            selectedConfig,
            nestedProp1,
            legend,
            axisBottom,
            axisLeft,
            listProp1,
            listProp2,
            nestedProp2
        }
    }
    handleMouseMove (e) {
        if (this.props.display.selectedZone.x1 !== null) this.props.handleMouseMove(e)
    }
    handleMouseUp (e) {
        const elements = d3HeatMap.getElementsInZone(this.refs.HeatMap, this.props)
        if (elements.length > 0) this.props.select(elements, this.props.zone, this.props.selections)
        this.props.handleMouseUp(e)
    }
    render () {
        const { axisBottom, axisLeft, legend, listProp1, listProp2 } = this.customState
        const { data, config, display, role, selections, step, zone } = this.props
        const coreDimensions = getDimensions('core', display.zones[zone], display.viz)

        return (<g className = { `HeatMap ${this.customState.elementName} role_${role}` } >
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseDown = { this.props.handleMouseDown }
                handleMouseMove = { this.handleMouseMove }
                handleMouseUp = { this.handleMouseUp }
            />
            { step !== 'changing' &&
            <g
                transform = { `translate(${coreDimensions.x}, ${coreDimensions.y})` }
                ref = "HeatMap"
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
                    offset = { { x: 10, y: 0, width: -20, height: -30 } }
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
                <PlainAxis
                    type = "Left"
                    zone = { zone }
                    axis = { axisLeft }
                    propIndex = { 1 }
                    selectElements = { this.selectElements }
                />
                <PropSelector
                    type = "AxisLeft"
                    propList = { listProp2 }
                    config = { config }
                    align = "right"
                    offset = { { x: 20, y: 30, width: -15, height: 0 } }
                    selectElements = { this.selectElements }
                    propIndex = { 1 }
                    zone = { zone }
                />
                <PropSelector
                    type = "AxisBottom"
                    propList = { listProp1 }
                    align = "right"
                    config = { config }
                    offset = { { x: 20, y: -15, width: -50, height: 0 } }
                    selectElements = { this.selectElements }
                    propIndex = { 0 }
                    zone = { zone }
                />
            </g>
            }
        </g>)
    }

    selectElements (prop, value, category) {
        const elements = d3HeatMap.getElements(this.refs.HeatMap, prop, value, category)
        // console.log(prop, value, elements, category)
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
    selectElement (selection) {
        const { select, zone, selections } = this.props
        select([selection], zone, selections)
    }

    componentDidMount () {
        d3HeatMap.create(this.refs.HeatMap, { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        d3HeatMap.update(this.refs.HeatMap, { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        d3HeatMap.destroy(this.refs.HeatMap, { ...this.props, ...this.customState })
    }
}

function mapStateToProps (state) {
    return {
        dataset: state.dataset.present,
        display: state.display,
        palettes: state.palettes,
        selections: state.selections
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

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
