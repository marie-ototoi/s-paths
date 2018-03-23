import React from 'react'
import * as d3 from 'd3'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
// components
import Coverage from '../elements/Coverage'
import Header from '../elements/Header'
import Legend from '../elements/Legend'
import Nav from '../elements/Nav'
import PlainAxis from '../elements/PlainAxis'
import PropSelector from '../elements/PropSelector'
import SelectionZone from '../elements/SelectionZone'
// d3
import d3HeatMap from '../../d3/d3HeatMap'
// libs
import { getPropsLists, getSelectedConfig } from '../../lib/configLib'
import { getAxis, getLegend, getThresholdsForLegend, groupTextData, groupTimeData } from '../../lib/dataLib'
import { getQuantitativeColors } from '../../lib/paletteLib'
import scaleLib, { getDimensions } from '../../lib/scaleLib'
// redux functions
import { setUnitDimensions } from '../../actions/dataActions'
import { getPropPalette } from '../../actions/palettesActions'
import { select, handleMouseDown, handleMouseMove, handleMouseUp } from '../../actions/selectionActions'

class HeatMap extends React.Component {
    constructor (props) {
        super(props)
        this.handleMouseDown = this.handleMouseDown.bind(this)
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
        const { config, configs, coverage, data, dataset, display, getPropPalette, palettes, role, selections, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedConfig(config, zone)

        let coverageFormatProp1
        let nestedCoverage1
        if (display.unitDimensions[zone][role] &&
            display.unitDimensions[zone][role].nestedCoverage1) {
            nestedCoverage1 = display.unitDimensions[zone][role].nestedCoverage1
        } else {
            coverageFormatProp1 = config.matches[0].properties[0].format || 'YYYY-MM-DD'
            nestedCoverage1 = groupTimeData(coverage, 'prop1', { format: coverageFormatProp1, max: 50 })
            this.props.setUnitDimensions({ nestedCoverage1 }, zone, config.id, role, (configs.past.length === 1))
        }

        // First prop to be displayed in the bottom axis
        const categoryProp1 = selectedConfig.properties[0].category
        const formatProp1 = selectedConfig.properties[0].format || 'YYYY-MM-DD'
        const nestedProp1 = groupTimeData(data, 'prop1', {
            format: formatProp1,
            max: 50,
            subgroup: 'prop2',
            forceGroup: nestedCoverage1[0].group
        })
        const axisBottom = getAxis(nestedCoverage1, 'prop1', categoryProp1)
        const categoryProp2 = selectedConfig.properties[1].category
        const nestedProp2 = groupTextData(data, 'prop2')
        const axisLeft = getAxis(nestedProp2, 'prop2', categoryProp2)

        const colors = getQuantitativeColors()
        const thresholds = getThresholdsForLegend(nestedProp1, 'prop2', categoryProp2, colors.length)
        const legend = getLegend(thresholds, 'countprop2', colors, 'aggregate')
        const propsLists = getPropsLists(config, zone, dataset.labels)
        const displayedInstances = data.reduce((acc, cur) => {
            // console.log(cur)
            acc += Number(cur.countprop2.value)
            return acc
        }, 0)

        // Save to reuse in render
        this.customState = {
            ...this.customState,
            propsLists,
            displayedInstances,
            selectedConfig,
            nestedProp1,
            nestedCoverage1,
            legend,
            axisBottom,
            axisLeft,
            nestedProp2
        }
    }
    handleMouseDown (e) {
        const { display, zone } = this.props
        this.props.handleMouseDown(e, zone, scaleLib.getZoneCoord(zone, display.mode, display.zonesDefPercent, display.screen))
    }
    handleMouseMove (e) {
        const { display, zone } = this.props
        if (display.selectedZone[zone].x1 !== null) this.props.handleMouseMove(e, zone, scaleLib.getZoneCoord(zone, display.mode, display.zonesDefPercent, display.screen))
    }
    handleMouseUp (e) {
        const { selections, zone } = this.props
        const elements = d3HeatMap.getElementsInZone(this.refs.HeatMap, this.props)
        if (elements.length > 0) this.props.select(elements, zone, selections)
        this.props.handleMouseUp(e, zone)
    }
    render () {
        const { axisBottom, axisLeft, legend } = this.customState
        const { data, dataset, config, display, role, selections, step, zone } = this.props
        const coreDimensions = getDimensions('core', display.zones[zone], display.viz)

        return (<g className = { `HeatMap ${this.customState.elementName} role_${role}` } >
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseDown = { this.handleMouseDown }
                handleMouseMove = { this.handleMouseMove }
                handleMouseUp = { this.handleMouseUp }
            />
            { step !== 'changing' &&
            <g
                transform = { `translate(${coreDimensions.x}, ${coreDimensions.y})` }
                ref = "HeatMap"
                onMouseMove = { this.handleMouseMove }
                onMouseUp = { this.handleMouseUp }
                onMouseDown = { this.handleMouseDown }
            ></g>
            }
            { role !== 'target' &&
            <g>
                <Header
                    zone = { zone }
                />
                <Coverage
                    zone = { zone }
                    displayedInstances = { this.customState.displayedInstances } // to be fixed - works only for unit displays
                    selectedInstances = { selections.reduce((acc, cur) => {
                        acc += Number(cur.count)
                        return acc
                    }, 0) }
                    selections = { selections }
                    config = { config }
                />
                <Nav
                    zone = { zone }
                    config = { config }
                    propsLists = { this.customState.propsLists }
                />
                <Legend
                    type = "plain"
                    zone = { zone }
                    offset = { { x: 10, y: 0, width: -20, height: 0 } }
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
                    selected = { false }
                    key = { zone + '_propselector_21' }
                    propList = { this.customState.propsLists[0] }
                    config = { config }
                    align = "right"
                    dimensions = { getDimensions('legendAxisBottom', display.zones[zone], display.viz, { x: 0, y: -15, width: -35, height: 0 }) }
                    propIndex = { 0 }
                    zone = { zone }
                />
                <PropSelector
                    selected = { false }
                    key = { zone + '_propselector_22' }
                    propList = { this.customState.propsLists[1] }
                    config = { config }
                    dimensions = { getDimensions('legendAxisLeft', display.zones[zone], display.viz, { x: 0, y: 30, width: 0, height: 0 }) }
                    propIndex = { 1 }
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
        configs: state.configs,
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
        select: select(dispatch),
        setUnitDimensions: setUnitDimensions(dispatch)
    }
}

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
