import React from 'react'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import d3HeatMap from '../../d3/d3HeatMap'
import { addSelection, removeSelection } from '../../actions/selectionActions'
import Legend from '../elements/Legend'
import { getPropPalette } from '../../actions/palettesActions'
import statisticalOperator from '../../lib/statLib'
import d3Axis from '../../d3/d3Axis/d3Axis'

class HeatMap extends React.Component {
    constructor (props) {
        super(props)
        this.setLegend = this.setLegend.bind(this)
        this.addCallbackToProps = this.addCallbackToProps.bind(this)
        this.state = {}
    }

    render () {
        const { display, zone } = this.props
        return (
            <g id = "Panel" transform = { `translate(${display.zones[this.props.zone].x}, ${display.zones[this.props.zone].y})` }>
                <g id = "AxisTop" className = "AxisTop" ref = "AxisTop"></g>
                <g id = "AxisRight" className = "AxisRight" ref = "AxisRight"></g>
                <g id = "AxisBottom" className = "AxisBottom" ref = "AxisBottom"></g>
                <g id = "AxisLeft" className = "AxisLeft" ref = "AxisLeft"></g>
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
            dataStat: statisticalOperator.computeStatisticalInformation(this.props.data.filter(d => d.zone === this.props.zone)[0])
        }
    }

    componentDidMount () {
        this.initAxisBottom()
        d3HeatMap.create(this.refs.HeatMap, this.addCallbackToProps())
    }
    componentDidUpdate () {
        d3HeatMap.update(this.refs.HeatMap, this.addCallbackToProps())
    }
    componentWillUnmount () {
        d3HeatMap.destroy(this.refs.HeatMap)
    }

    initAxisBottom () {
        let data = statisticalOperator.computeStatisticalInformation(this.props.data.filter(d => d.zone === this.props.zone)[0])
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
        */
        // let ordoAxis = new d3Axis(this.refs.AxisBottom, titles, xElements, positionAbscisse, 'horizontal')
        // ordoAxis.assignBehavior('keys', 'mouseover', interactionsA.key.mouseover)
        // ordoAxis.assignBehavior('keys', 'mouseleave', interactionsA.key.mouseleave)
    }
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
