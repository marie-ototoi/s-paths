import React from 'react'
import * as d3 from 'd3'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
import d3HeatMap from '../../d3/d3HeatMap'
import { select, addSelection, removeSelection } from '../../actions/selectionActions'
import Legend from '../elements/Legend'
import Axis from '../elements/Axis'
import { getPropPalette } from '../../actions/palettesActions'
import statisticalOperator from '../../lib/statLib'
import {getQuantitativeColors} from '../../lib/paletteLib.js'
import config from '../../lib/configLib'
import scaleLib from '../../lib/scaleLib'
import dataLib from '../../lib/dataLib'
import PlainAxis from '../elements/PlainAxis'
import PropSelector from '../elements/PropSelector'

class HeatMap extends React.Component {
    constructor (props) {
        super(props)
        /*
        this.setLegend = this.setLegend.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.legendBehavior = this.legendBehavior.bind(this)
        this.axisBehavior = this.axisBehavior.bind(this)
        this.state = {
            setLegend: this.setLegend,
            selectElements: this.selectElements,
            legendBehavior: this.legendBehavior,
            axisBehavior: this.axisBehavior,
            elementName: `HeatMap_${props.zone}`
        }
*/
        this.selectElement = this.selectElement.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.customState = {
            elementName: `HeatMap_${props.zone}`,
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
        const dataStat = statisticalOperator.computeStatisticalInformation(data, selectedConfig)
        // First prop to be displayed in the bottom axis
        const categoryProp1 = selectedConfig.properties[0].category
        const formatProp1 = selectedConfig.properties[0].format || 'YYYY-MM-DD' // change to selectedConfig.properties[0].format when stats will send format
        const nestedProp1 = dataLib.groupTimeData(data, 'prop1', formatProp1, 50)
        const axisBottom = dataLib.getAxis(nestedProp1, 'prop1', categoryProp1)
        const listProp1 = dataLib.getPropList(configs, 0)

        const paletteObj = []
        let nbColor = dataStat.max - dataStat.min + 1
        const colors = getQuantitativeColors(nbColor)
        let step = (dataStat.max - dataStat.min + 1) / colors.length
        for (var i = 0; i < colors.length; i++) {
            let key = (dataStat.min + ((i + 1) * step)).toFixed(0)
            paletteObj.push({
                key: key,
                color: colors[i],
                label: key,
                category: colors[i],
                propName: 'none'
            })
        }

        for (i = 0; i < dataStat.data.length; i++) {
            for (var j = 0; j < colors.length; j++) {
                if (!(Number(dataStat.min) + ((j + 1) * step) < dataStat.data[i].value)) {
                    dataStat.data[i].color = paletteObj.filter(p => (p.key === (dataStat.min + ((j + 1) * step)).toFixed(0)))[0].color
                    break
                }
            }
        }
        const legend = { info: paletteObj }
        // Second prop to be displayed in the legend
        const nestedProp2 = d3.nest().key(legend => legend.prop2.value).entries(data)
        const pathProp2 = selectedConfig.properties[1].path
        const categoryProp2 = selectedConfig.properties[1].category
        // const colors = getPropPalette(palettes, pathProp2, nestedProp2.length)
        //  const legend = dataLib.getLegend(nestedProp2, colors, categoryProp2)
        const listProp2 = dataLib.getPropList(configs, 1)

        // Save to reuse in render
        this.customState = { ...this.customState, selectedConfig, nestedProp1, legend, axisBottom, listProp1, listProp2, dataStat }
    }

    aaa (nextProps) {
        const { data, zone } = this.props
        const { configs } = this.props
        const selectedConfig = config.getSelectedConfig(configs, zone)
        const dataStat = statisticalOperator.computeStatisticalInformation(data, selectedConfig)
        const paletteObj = []
        let nbColor = dataStat.max - dataStat.min + 1
        const colors = getQuantitativeColors(nbColor)
        //        const colors = getPropPalette(palettes, prop2, prop2Data.length)
        let step = (dataStat.max - dataStat.min + 1) / colors.length
        for (var i = 0; i < colors.length; i++) {
            let key = (dataStat.min + ((i + 1) * step)).toFixed(0)
            paletteObj.push({
                key: key,
                color: colors[i],
                label: key,
                category: colors[i]
            })
        }
        for (i = 0; i < dataStat.data.length; i++) {
            for (var j = 0; j < colors.length; j++) {
                if (!(Number(dataStat.min) + ((j + 1) * step) < dataStat.data[i].value)) {
                    dataStat.data[i].color = paletteObj.filter(p => (p.key === (dataStat.min + ((j + 1) * step)).toFixed(0)))[0].color
                    break
                }
            }
        }
        this.state = { ...this.state,
            dataStat: dataStat,
            palette: paletteObj,
            selectedConfig: selectedConfig
        }
        this.state.setLegend(paletteObj)
    }

    render () {
        const { axisBottom, legend, listProp1, listProp2, dataStat } = this.customState
        const { data, configs, display, zone } = this.props

        //  const { display, zone } = this.props
        // const { dataStat, axisBehavior } = this.state

        /*      let axisbehavior = d3HeatMap.heatMapAxisBehaviors()
        for (var item in axisbehavior) {
            for (var fun in axisbehavior[item]) {
                axisbehavior[item][fun] = axisbehavior[item][fun].bind(this, this.state.selectElements)
            }
        }

        let heatMapLegendBehavior = d3HeatMap.heatMapLegendBehavior() */
        const classN = `HeatMap ${this.customState.elementName}`
        return (<g className = { classN } >
            <g
                transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
                ref = "HeatMap">
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
            { dataStat &&
                <Axis display = {display}
                    type = "left"
                    zone = { zone }
                    keys = {d3.set(dataStat.data.map(item => item.prop2)).values()}
                    keysDisplay = "simple"
                    titles = {['Title', 'TEST']}
                />}
            <PropSelector
                propList = { listProp2 }
                configs = { configs }
                dimensions = { scaleLib.getDimensions('propSelectorLegend', display.zones[zone], display.viz, { x: 10, y: -5, width: -80, height: 0 }) }
                selectElements = { this.selectElements }
                propIndex = { 1 }
                zone = { zone }
            />
            <PropSelector
                propList = { listProp1 }
                configs = { configs }
                dimensions = { scaleLib.getDimensions('propSelectorAxisBottom', display.zones[zone], display.viz, { x: 20, y: -20, width: -40, height: 0 }) }
                selectElements = { this.selectElements }
                propIndex = { 0 }
                zone = { zone }
            />
        </g>)
        /*
        { dataStat &&
            <Axis display = {display}
                type = "left"
                zone = { zone }
                keys = {d3.set(dataStat.data.map(item => item.prop2)).values()}
                keysDisplay = "simple"
                titles = {['Gender', 'TEST']}
                behaviors = {axisBehavior}
            />
        }
        */
    }
    /*
    setLegend (legend) {
        this.setState({ legend })
    }

    legendBehavior (prop, value, category) {
        const { select, zone, selections } = this.props
        let elements = d3HeatMap.heatMapLegendBehavior(category)
        select(elements, zone, selections)
    }

    axisBehavior (item, type, category) {
        // console.log(item, type)
        const { select, zone, selections } = this.props
        if (item === 'key' && type === 'click') {
            let elements = d3HeatMap.heatMapAxisBehaviors(category)
            select(elements, zone, selections)
        }
    }

    selectElements (elements) {
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
*/

    selectElements (prop, value, category) {
        let elements = []
        if (category !== undefined) d3HeatMap.getElements(this.refs.HeatMap, category)
        else elements = prop
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
    selectElement (selection) {
        const { select, zone, selections } = this.props
        select([selection], zone, selections)
    }

    addCallbackToProps () {
        return {
            ...this.props,
            ...this.customState
        }
    }

    componentDidMount () {
        d3HeatMap.create(this.refs.HeatMap, this.addCallbackToProps())
    }
    componentDidUpdate () {
        d3HeatMap.update(this.refs.HeatMap, this.addCallbackToProps())
    }
    componentWillUnmount () {
        d3HeatMap.destroy(this.refs.HeatMap)
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

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
