import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import d3HeatMap from '../../d3/d3HeatMap'
import { select, addSelection, removeSelection } from '../../actions/selectionActions'
import Legend from '../elements/Legend'
import Axis from '../elements/Axis'
import { getPropPalette } from '../../actions/palettesActions'
import statisticalOperator from '../../lib/statLib'
import {getQuantitativeColors} from '../../lib/paletteLib.js'
import config from '../../lib/configLib'
import dataLib from '../../lib/dataLib'

class HeatMap extends React.Component {
    constructor (props) {
        super(props)
        this.setLegend = this.setLegend.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.state = {
            setLegend: this.setLegend,
            selectElements: this.selectElements
        }
    }

    componentWillMount () {
        const { data, zone } = this.props
        if (!dataLib.areLoaded(data, zone)) return

        const { configs } = this.props
        const selectedConfig = config.getSelectedConfig(configs, zone)
        const dataZone = dataLib.getResults(data, zone)
        const dataStat = statisticalOperator.computeStatisticalInformation(dataZone, selectedConfig)
        const paletteObj = []
        let nbColor = dataStat.max - dataStat.min + 1
        const colors = getQuantitativeColors(nbColor)
        //        const colors = getPropPalette(palettes, prop2, prop2Data.length)
        let step = (dataStat.max - dataStat.min + 1) / colors.length
        for (var i = 0; i < colors.length; i++) {
            let key = (dataStat.min + ((i + 1) * step)).toFixed(0)
            paletteObj.push({ key: key, color: colors[i] })
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
    }

    render () {
        const { display, zone } = this.props
        const { dataStat } = this.state
        let axisbehavior = d3HeatMap.heatMapAxisBehaviors()
        for (var item in axisbehavior) {
            for (var fun in axisbehavior[item]) {
                axisbehavior[item][fun] = axisbehavior[item][fun].bind(this, this.state.selectElements)
            }
        }
        return (
            <g className = "HeatMap { this.props.zone }" ref = "HeatMap" transform = { `translate(${display.zones[this.props.zone].x}, ${display.zones[this.props.zone].y})` } >
                { this.state.legend &&
                    <Legend
                        type = "plain"
                        x = { 0 }
                        y = { display.viz.useful_height + display.viz.vertical_margin }
                        width = { display.viz.horizontal_margin }
                        height = { display.viz.vertical_margin }
                        info = { this.state.legend }
                        zone = { zone }
                    />
                }
                { dataStat &&
                    <Axis display = {display}
                        type = "left"
                        zone = { zone }
                        keys = {d3.set(dataStat.data.map(item => item.prop2)).values()}
                        titles = {['Gender', 'TEST']}
                        behaviors = {axisbehavior}
                    />
                }
                { dataStat &&
                    <Axis display = {display}
                        type = "bottom"
                        zone = { zone }
                        keys = {d3.set(dataStat.data.map(item => item.prop1)).values()}
                        titles = {['Date', 'TEST']}
                        behaviors = {axisbehavior}
                    />
                }
            </g>
        )
    }
    setLegend (legend) {
        this.setState({ legend })
    }
    selectElements (elements) {
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
    addCallbackToProps () {
        return {
            ...this.props,
            ...this.state
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
        data: state.data,
        configs: state.configs.present,
        selections: state.selections,
        palettes: state.palettes
    }
}

function mapDispatchToProps (dispatch) {
    return {
        addSelection: addSelection(dispatch),
        removeSelection: removeSelection(dispatch),
        getPropPalette: getPropPalette(dispatch),
        select: select(dispatch)
    }
}

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
