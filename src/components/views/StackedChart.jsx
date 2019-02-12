import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
// components
import Legend from '../elements/Legend'
import PropSelector from '../elements/PropSelector'
import Axis from '../elements/Axis'
import SelectionZone from '../elements/SelectionZone'
// d3
import StackedChartLayout from '../../d3/StackedChartLayout'
// libs
import { getSelectedMatch } from '../../lib/configLib'
import { deduplicate, getAxis, getLegend, nestData } from '../../lib/dataLib'
import { getDimensions } from '../../lib/scaleLib'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'

class StackedChart extends React.Component {
    constructor (props) {
        super(props)
        this.selectEnsemble = this.selectEnsemble.bind(this)
        this.customState = {
            elementName: `StackedChart_${props.zone}`
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
        let { data, config, zone } = nextProps
        // prepare the data for display
        data = deduplicate(data, ['entrypoint'])
        const selectedConfig = getSelectedMatch(config, zone)
        // First prop to be displayed in the bottom axis
        let maxUnitsPerYear
        /* const nestedProp1 = nestData(data, [{
            propName: 'prop1',
            category: 'datetime',
            max: 50,
            sortValues: 'prop2',
            sortValuesOrder: 'DESC'
        }]) */
        let categoryProp1 = selectedConfig.properties[0].category
        let nestedProp1 = nestData(data, [{
            propName: 'prop1',
            category: categoryProp1,
            max: 50,
            sortValues: 'prop2',
            sortValuesOrder: 'DESC'
        }])
        // const categoryProp1 = selectedConfig.properties[0].category
        const axisBottom = getAxis(nestedProp1, 'prop1', categoryProp1)
        // Second prop to be displayed in the legend
        const nestedProp2 = d3.nest().key(legend => legend.prop2.value).entries(data).sort((a, b) => { return b.key.localeCompare(a.key) })
        // const pathProp2 = selectedConfig.properties[1].path
        const categoryProp2 = selectedConfig.properties[1].category
        //const colors = getPropPalette(palettes, pathProp2, nestedProp2.length)
        // console.log(colors)
        let interpolate = d3.scaleOrdinal().domain([...nestedProp2.map(prop => prop.key), 'fake', 'fake', 'fake','fake']).range(nestedProp2.map((val, i) => {
            return d3.interpolateBlues(i / (nestedProp2.length - 1) + 0.4)
        }))
        //
        // let avoidpale = [interpolate("trop pale"), interpolate("trop pales"), interpolate("trop trop pale")]
        // console.log(interpolate('toto'), interpolate('titi'))
        let colors = nestedProp2.map(line => {
            return interpolate(line.key)
        })
        const legend = getLegend(nestedProp2, 'prop2', colors, categoryProp2)
        const propsLists = config.propList
        // console.log(propsLists)
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            propsLists,
            maxUnitsPerYear,
            selectedConfig,
            nestedProp1,
            legend,
            axisBottom
        }
    }
    selectEnsemble (prop, value, category) {
        const elements = this.layout.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections, this.props.display.modifierPressed)
    }
    render () {
        const { axisBottom, legend } = this.customState
        const { config, dimensions, display, role, selections, step, zone } = this.props
        // display settings
        const classN = `StackedChart ${this.customState.elementName} role_${role}`
        return (<svg
            width = { display.viz[zone + '_width'] }
            height = { display.screen.height - 10 }
            transform = { `translate(${dimensions.x}, 0)` }
            className = { classN }
        >
            { step !== 'changing' &&
            <g
                transform = { `translate(${dimensions.horizontal_padding}, ${dimensions.y + dimensions.top_padding})` }
                ref = {(c) => { this[this.customState.elementName] = c }}
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this, selections) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            ></g>
            }
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { dimensions }
                component = { this }
                selections = { selections }
            />
            }
            { role !== 'target' && step !== 'changing' &&
            <g>
                <Legend
                    type = "plain"
                    zone = { zone }
                    offset = { { x: 0, y: 0, width: 0, height: 0 } }
                    legend = { legend }
                    selectElements = { this.selectEnsemble }
                />
                <Axis
                    type = "Bottom"
                    zone = { zone }
                    axis = { axisBottom }
                    propIndex = { 0 }
                    propList = { this.customState.propsLists[0] }
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
                    dimensions = { getDimensions(zone + 'LegendLegend', display.viz, { x: 0, y: 0, width: -13, height: 0 }) }
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
    componentDidMount () {
        // console.log(this.props.data)
        this.layout = new StackedChartLayout(this[this.customState.elementName], { ...this.props, ...this.customState })
        if (this.props.role === 'target') {
            this.render()
            // console.log('called once when transition data are loaded and displayed')
        }
    }
    componentDidUpdate () {
        this.layout.update(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        this.layout.destroy(this[this.customState.elementName])
    }
}

StackedChart.propTypes = {
    config: PropTypes.object,
    data: PropTypes.array,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    selections: PropTypes.array,
    role: PropTypes.string,
    step: PropTypes.string,
    zone: PropTypes.string,
    handleMouseDown: PropTypes.func,
    handleMouseMove: PropTypes.func,
    handleMouseUp: PropTypes.func,
    selectElements: PropTypes.func
}

function mapStateToProps (state) {
    return {
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
        selectElements: selectElements(dispatch)
    }
}

const StackedChartConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(StackedChart)

export default StackedChartConnect
