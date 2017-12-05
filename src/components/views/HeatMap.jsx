import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import d3HeatMap from '../../d3/d3HeatMap'
import { addSelection, removeSelection } from '../../actions/selectionActions'
import Legend from '../elements/Legend'
import Axis from '../elements/Axis'
import { getPropPalette } from '../../actions/palettesActions'
import statisticalOperator from '../../lib/statLib'

import config from '../../lib/configLib'
import dataLib from '../../lib/dataLib'

class HeatMap extends React.Component {
    constructor (props) {
        super(props)
        this.setLegend = this.setLegend.bind(this)
        this.addCallbackToProps = this.addCallbackToProps.bind(this)

        const { data, configs, zone } = this.props
        const selectedConfig = config.getSelectedConfig(configs, zone)
        const dataZone = dataLib.getResults(data, zone)

        this.state = { dataStat: statisticalOperator.computeStatisticalInformation(dataZone, selectedConfig) }
    }

    render () {
        const { display, zone } = this.props
        const { dataStat } = this.state
        return (
            <g id = "Panel" transform = { `translate(${display.zones[this.props.zone].x}, ${display.zones[this.props.zone].y})` }>
                <g className = "HeatMap { this.props.zone }" ref = "HeatMap" > </g>
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
                        keys = {d3.set(dataStat.data.map(item => item.prop2)).values()}
                        titles = {['Gender', 'TEST']}
                        behaviors = {d3HeatMap.heatMapAxisBehaviors()}
                    />
                }
                { dataStat &&
                    <Axis display = {display}
                        type = "bottom"
                        keys = {d3.set(dataStat.data.map(item => item.prop1)).values()}
                        titles = {['Date', 'TEST']}
                        behaviors = {d3HeatMap.heatMapAxisBehaviors()}
                    />
                }
            </g>
        )
    }
    setLegend (legend) {
        this.setState({ legend })
    }
    addCallbackToProps () {
        return {
            ...this.props,
            setLegend: this.setLegend,
            dataStat: this.state.dataStat
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
/*
    initAxisBottom () {
        let xElements = d3.set(data.data.map(item => item.prop1)).values()
        let yElements = d3.set(data.data.map(item => item.prop2)).values()

        let interactionsA = {
            title: { mouseover: () => {},
                mouseleave: () => {},
                click: () => {} },
            key: {
                mouseover: (name) => {
                    d3.select('#center').selectAll('rect').filter(function () {
                        return this.getAttribute('id').includes(name)
                    }).attr('fill', 'blue')
                },
                mouseleave: (name) => {
                    d3.select('#center').selectAll('rect').filter(function () {
                        return this.getAttribute('id').includes(name)
                    }).attr('fill', function () { return this.getAttribute('savFill') })
                },
                click: () => {} }
        }

        let axis = d3Axis.bottom(this.refs.AxisBottom, this.props)
        axis.addTitles([ 'Date', 'EX1' ])
            .addKeys(xElements)
            .assignBehavior('keys', 'mouseover', interactionsA.key.mouseover)
            .assignBehavior('keys', 'mouseleave', interactionsA.key.mouseleave)
        /*        d3Axis.top(this.refs.AxisTop, this.props)
        d3Axis.left(this.refs.AxisLeft, this.props)
        d3Axis.right(this.refs.AxisRight, this.props)

        // let ordoAxis = new d3Axis(this.refs.AxisBottom, titles, xElements, positionAbscisse, 'horizontal')
        // ordoAxis.assignBehavior('keys', 'mouseover', interactionsA.key.mouseover)
        // ordoAxis.assignBehavior('keys', 'mouseleave', interactionsA.key.mouseleave)
    }
    */
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data,
        configs: state.configs.present,
        selections: state.selections.present,
        palettes: state.palettes
    }
}

function mapDispatchToProps (dispatch) {
    return {
        addSelection: addSelection(dispatch),
        removeSelection: removeSelection(dispatch),
        getPropPalette: getPropPalette(dispatch)
    }
}

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
