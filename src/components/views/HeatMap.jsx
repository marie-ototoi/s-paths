import * as d3 from 'd3'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
// components
import Legend from '../elements/Legend'
import Axis from '../elements/Axis'
import PropSelector from '../elements/PropSelector'
import SelectionZone from '../elements/SelectionZone'
// d3
import HeatMapLayout from '../../d3/HeatMapLayout'
// libs
import { getSelectedMatch } from '../../lib/configLib'
import { getAxis, getLegend, getThresholdsForLegend, nestData } from '../../lib/dataLib'
import { getQuantitativeColors } from '../../lib/paletteLib'
import { getDimensions } from '../../lib/scaleLib'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'

class HeatMap extends React.Component {
    constructor (props) {
        super(props)
        this.selectEnsemble = this.selectEnsemble.bind(this)
        this.customState = {
            elementName: `HeatMap_${props.zone}_${props.role}`
        }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        let dataChanged = (this.props.data.length !== nextProps.data.length ||
            (this.props.data[0] && nextProps.data[0] && this.props.data[0].prop1.value !== nextProps.data[0].prop1.value))
        let selectionChanged = this.props.selections.length !== nextProps.selections.length
        let dimensionsChanged = this.props.dimensions.width !== nextProps.dimensions.width ||
            this.props.dimensions.height !== nextProps.dimensions.height || 
            this.props.display.selectedZone[this.props.zone].x1 !== nextProps.display.selectedZone[this.props.zone].x1 ||
            this.props.display.selectedZone[this.props.zone].x2 !== nextProps.display.selectedZone[this.props.zone].x2 ||
            this.props.display.selectedZone[this.props.zone].y1 !== nextProps.display.selectedZone[this.props.zone].y1 ||
            this.props.display.selectedZone[this.props.zone].y2 !== nextProps.display.selectedZone[this.props.zone].y2 
            
        if (dataChanged) {
            this.prepareData(nextProps)
        }
        return dataChanged ||
            selectionChanged ||
            dimensionsChanged ||
            this.props.step !== nextProps.step
    }
    prepareData (nextProps) {
        const { config, data, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
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

        //const colors = getQuantitativeColors()
        // console.log(d3.scaleOrdinal(d3.schemeCategory10)('toto'), d3.scaleOrdinal(d3.schemeCategory10)('tata'))

        const thresholds = getThresholdsForLegend(nestedProp1, 'prop2', categoryProp2, 7)
        //console.log(thresholds)
        let thedomain = [thresholds[0].key[0], thresholds[thresholds.length-1].key[1]]
        // console.log('av', thedomain)
        thedomain[0] = thedomain[0] - Math.floor(thedomain[0] * 0.2)
        // console.log('ap', thedomain)
        let interpolate = d3.scaleSequential().domain(thedomain).interpolator(d3.interpolateYlOrRd);
        let colors = thresholds.map(line => interpolate(line.key[1]))
        const legend = getLegend(thresholds, 'countprop2', colors, 'aggregate')
        const propsLists = config.propList
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            propsLists,
            selectedConfig,
            nestedProp1,
            // nestedCoverage1,
            legend,
            axisBottom,
            axisLeft,
            nestedProp2
        }
    }
    render () {
        const { axisBottom, axisLeft, legend } = this.customState
        const { config, display, dimensions, role, selections, step, zone } = this.props
        return (<svg
            width = { display.viz[zone + '_width'] }
            height = { display.screen.height - 10 }
            className = { `HeatMap ${this.customState.elementName} role_${role}` } ref = {(c) => { this.refHeatMap = c }}
        >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { dimensions }
                component = { this }
                selections = { selections }
                handleMouseMove = { this.props.handleMouseMove }
            />
            }
            { step !== 'changing' &&
            <g
                className = "content"
                transform = { `translate(${dimensions.x + dimensions.horizontal_padding }, ${dimensions.y + dimensions.top_padding})` }
                ref = { (c) => { this[this.customState.elementName] = c } }
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this, selections) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            ></g>
            }
            { role !== 'target' && step !== 'changing' &&
            <g>
                <Legend
                    type = "plain"
                    zone = { zone }
                    offset = { { x: 0, y: 0, width:0, height: 0 } }
                    legend = { legend }
                    selectElements = { this.selectEnsemble }
                />
                <Axis
                    type = "Bottom"
                    zone = { zone }
                    axis = { axisBottom }
                    propIndex = { 0 }
                    selectElements = { this.selectEnsemble }
                />
                <Axis
                    type = "Left"
                    zone = { zone }
                    axis = { axisLeft }
                    propIndex = { 1 }
                    selectElements = { this.selectEnsemble }
                />
                <PropSelector
                    selected = { false }
                    key = { zone + '_propselector_21' }
                    propList = { this.customState.propsLists[0] }
                    config = { config }
                    align = "right"
                    dimensions = { getDimensions(zone + 'LegendAxisBottom', display.viz, { x: 0, y: -15, width: -35, height: 0 }) }
                    propIndex = { 0 }
                    zone = { zone }
                />
                <PropSelector
                    selected = { false }
                    key = { zone + '_propselector_22' }
                    propList = { this.customState.propsLists[1] }
                    config = { config }
                    align = "right"
                    dimensions = { getDimensions(zone + 'LegendAxisLeft', display.viz, { x: 0, y: 30, width: 0, height: 0 }) }
                    propIndex = { 1 }
                    zone = { zone }
                />
            </g>
            }
        </svg>)
    }
    getElementsInZone (zoneDimensions) {
        return this.layout.getElementsInZone({ ...this.props, zoneDimensions })
    }
    selectEnsemble (prop, value, category) {
        const elements = this.layout.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections, 16)
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
    configs: PropTypes.object,
    data: PropTypes.array,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    selections: PropTypes.array,
    role: PropTypes.string,
    step: PropTypes.string,
    zone: PropTypes.string,
    handleMouseDown: PropTypes.func,
    handleMouseMove: PropTypes.func,
    handleMouseUp: PropTypes.func,
    handleTransition: PropTypes.func,
    selectElements: PropTypes.func,
    getElementsInZone: PropTypes.func
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        dataset: state.dataset,
        display: state.display,
        palettes: state.palettes
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getPropPalette: getPropPalette(dispatch),
        handleMouseDown: handleMouseDown(dispatch),
        handleMouseUp: handleMouseUp(dispatch),
        selectElements: selectElements(dispatch)
    }
}

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(HeatMap)

export default HeatMapConnect
