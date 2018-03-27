import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
import * as d3 from 'd3'
// components
import Coverage from '../elements/Coverage'
import Header from '../elements/Header'
import History from '../elements/History'
import Legend from '../elements/Legend'
import Nav from '../elements/Nav'
import PropSelector from '../elements/PropSelector'
import PlainAxis from '../elements/PlainAxis'
import SelectionZone from '../elements/SelectionZone'
// d3
import d3Timeline from '../../d3/d3Timeline'
// libs
import { getPropsLists, getSelectedConfig } from '../../lib/configLib'
import { deduplicate, getAxis, getLegend, groupTimeData } from '../../lib/dataLib'
import { getDimensions, getZoneCoord } from '../../lib/scaleLib'
// redux functions
import { setUnitDimensions } from '../../actions/dataActions'
import { getPropPalette } from '../../actions/palettesActions'
import { select, handleMouseDown, handleMouseMove, handleMouseUp } from '../../actions/selectionActions'

class Timeline extends React.PureComponent {
    constructor (props) {
        super(props)
        this.handleMouseDown = this.handleMouseDown.bind(this)
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
        const { data, config, configs, coverage, dataset, display, getPropPalette, palettes, role, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedConfig(config, zone)
        // First prop to be displayed in the bottom axis
        let coverageFormatProp1
        let nestedCoverage1
        let maxUnitsPerYear
        if (display.unitDimensions[zone][role] &&
            display.unitDimensions[zone][role].nestedCoverage1) {
            nestedCoverage1 = display.unitDimensions[zone][role].nestedCoverage1
        } else {
            coverageFormatProp1 = config.matches[0].properties[0].format || 'YYYY-MM-DD'
            nestedCoverage1 = groupTimeData(deduplicate(coverage, ['entrypoint']), 'prop1', { format: coverageFormatProp1, max: 50 })
            maxUnitsPerYear = 1
            nestedCoverage1.forEach(d => {
                if (d.values.length > maxUnitsPerYear) maxUnitsPerYear = d.values.length
            })
            this.props.setUnitDimensions({ maxUnitsPerYear, nestedCoverage1 }, zone, config.id, role, (configs.past.length === 1))
        }
        const formatProp1 = selectedConfig.properties[0].format || 'YYYY-MM-DD'
        const nestedProp1 = groupTimeData(deduplicate(data, ['entrypoint']), 'prop1', {
            format: formatProp1,
            max: 50,
            forceGroup: nestedCoverage1[0].group
        })
        const categoryProp1 = selectedConfig.properties[0].category
        const axisBottom = getAxis(nestedCoverage1, 'prop1', categoryProp1)
        // Second prop to be displayed in the legend

        const nestedProp2 = d3.nest().key(legend => legend.prop2.value).entries(data).sort((a, b) => { return b.key.localeCompare(a.key) })
        const pathProp2 = selectedConfig.properties[1].path
        const categoryProp2 = selectedConfig.properties[1].category
        const colors = getPropPalette(palettes, pathProp2, nestedProp2.length)
        const legend = getLegend(nestedProp2, 'prop2', colors, categoryProp2)
        const propsLists = getPropsLists(config, zone, dataset.labels)
        // Save to reuse in render
        this.customState = { ...this.customState, propsLists, maxUnitsPerYear, nestedCoverage1, selectedConfig, nestedProp1, legend, axisBottom }
    }
    handleMouseMove (e) {
        const { display, zone } = this.props
        if (display.selectedZone[zone].x1 !== null) this.props.handleMouseMove(e, zone, getZoneCoord(zone, display.mode, display.zonesDefPercent, display.screen))
    }
    handleMouseDown (e) {
        const { display, zone } = this.props
        this.props.handleMouseDown(e, zone, getZoneCoord(zone, display.mode, display.zonesDefPercent, display.screen))
    }
    handleMouseUp (e) {
        const { selections, zone } = this.props
        const elements = d3Timeline.getElementsInZone(this.refs.Timeline, this.props)
        if (elements.length > 0) this.props.select(elements, zone, selections)
        this.props.handleMouseUp(e, zone)
    }
    render () {
        const { axisBottom, legend } = this.customState
        const { config, data, dataset, display, role, selections, step, zone } = this.props
        // display settings
        const classN = `Timeline ${this.customState.elementName} role_${role}`
        const coreDimensions = getDimensions('core', display.zones[zone], display.viz)
        return (<g className = { classN } >
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
                ref = "Timeline"
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
                    displayedInstances = { deduplicate(data, ['entrypoint']).length } // to be fixed - works only for unit displays
                    selectedInstances = { selections.length }
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
                    propList = { this.customState.propsLists[0] }
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
                    dimensions = { getDimensions('legendLegend', display.zones[zone], display.viz, { x: 0, y: 0, width: -35, height: 0 }) }
                    propIndex = { 1 }
                    zone = { zone }
                />
                <History
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
        configs: state.configs,
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
        select: select(dispatch),
        setUnitDimensions: setUnitDimensions(dispatch)
    }
}

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps)(Timeline)

export default TimelineConnect
