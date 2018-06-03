import PropTypes from 'prop-types'
import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
// components
import Coverage from '../elements/Coverage'
import Header from '../elements/Header'
import History from '../elements/History'
import Legend from '../elements/Legend'
import Nav from '../elements/Nav'
import Axis from '../elements/Axis'
import PropSelector from '../elements/PropSelector'
import SelectionZone from '../elements/SelectionZone'
// d3
import HeatMapLayout from '../../d3/HeatMapLayout'
// libs
import { getPropsLists, getSelectedConfig } from '../../lib/configLib'
import { getAxis, getLegend, getThresholdsForLegend, nestData } from '../../lib/dataLib'
import { getQuantitativeColors } from '../../lib/paletteLib'
import { getDimensions, getZoneCoord } from '../../lib/scaleLib'
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
            elementName: `HeatMap_${props.zone}_${props.role}`,
            selectElement: this.selectElement,
            selectElements: this.selectElements,
            handleMouseUp: this.handleMouseUp
        }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        if (!shallowEqual(this.props, nextProps)) {
            this.prepareData(nextProps)
        }
        return !shallowEqual(this.props, nextProps)
    }
    prepareData (nextProps) {
        const { config, data, dataset, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedConfig(config, zone)

        // First prop to be displayed in the bottom axis
        let categoryProp1 = selectedConfig.properties[0].category
        let nestedProp1 = nestData(data, [{
            propName: 'prop1',
            category: categoryProp1,
            max: 50
        }, { propName: 'prop2', category: 'text' }])
        const axisBottom = getAxis(nestedProp1, 'prop1', categoryProp1)
        const categoryProp2 = selectedConfig.properties[1].category
        const nestedProp2 = nestData(data, [{
            propName: 'prop2',
            category: categoryProp2
        }])
        const axisLeft = getAxis(nestedProp2, 'prop2', categoryProp2)

        const colors = getQuantitativeColors()
        const thresholds = getThresholdsForLegend(nestedProp1, 'prop2', categoryProp2, colors.length)
        const legend = getLegend(thresholds, 'countprop2', colors, 'aggregate')
        const propsLists = getPropsLists(config, zone, dataset)
        // console.log(propsLists,  dataset.labels)
        const displayedInstances = data.reduce((acc, cur) => {
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
            // nestedCoverage1,
            legend,
            axisBottom,
            axisLeft,
            nestedProp2
        }
    }
    handleMouseDown (e) {
        const { display, zone } = this.props
        this.props.handleMouseDown(e, zone, getZoneCoord(zone, display.mode, display.zonesDefPercent, display.screen))
    }
    handleMouseMove (e) {
        const { display, zone } = this.props
        if (display.selectedZone[zone].x1 !== null) this.props.handleMouseMove(e, zone, getZoneCoord(zone, display.mode, display.zonesDefPercent, display.screen))
    }
    handleMouseUp (e) {
        const { selections, zone } = this.props
        const elements = this.layout.getElementsInZone(this.props)
        if (elements.length > 0) this.props.select(elements, zone, selections)
        this.props.handleMouseUp(e, zone)
    }
    render () {
        const { axisBottom, axisLeft, legend } = this.customState
        const { config, display, dimensions, role, selections, step, zone } = this.props
        return (<g className = { `HeatMap ${this.customState.elementName} role_${role}` }>
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseDown = { this.handleMouseDown }
                handleMouseMove = { this.handleMouseMove }
                handleMouseUp = { this.handleMouseUp }
            />
            }
            { step !== 'changing' &&
            <g
                transform = { `translate(${dimensions.x}, ${dimensions.y})` }
                ref = {(c) => { this[this.customState.elementName] = c }}
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
                <Axis
                    type = "Bottom"
                    zone = { zone }
                    axis = { axisBottom }
                    propIndex = { 0 }
                    selectElements = { this.selectElements }
                />
                <Axis
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
                    align = "right"
                    dimensions = { getDimensions('legendAxisLeft', display.zones[zone], display.viz, { x: 0, y: 30, width: 0, height: 0 }) }
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
        const elements = this.layout.getElements(prop, value, category)
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
    selectElement (selection) {
        const { select, zone, selections } = this.props
        select([selection], zone, selections)
    }

    componentDidMount () {
        this.layout = new HeatMapLayout(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        this.layout.update(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        this.layout.destroy(this[this.customState.elementName])
    }
}

HeatMap.propTypes = {
    config: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    selections: PropTypes.array,
    role: PropTypes.string,
    step: PropTypes.string,
    zone: PropTypes.string,
    handleKeyDown: PropTypes.func,
    handleMouseDown: PropTypes.func,
    handleMouseMove: PropTypes.func,
    handleMouseUp: PropTypes.func,
    handleTransition: PropTypes.func,
    select: PropTypes.func
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        dataset: state.dataset,
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
