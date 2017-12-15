import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import d3Map from '../../d3/d3Map'
import Legend from '../elements/Legend'
import config from '../../lib/configLib'
import dataLib from '../../lib/dataLib'
import selectionLib from '../../lib/selectionLib'
import { select } from '../../actions/selectionActions'
import { getPropPalette } from '../../actions/palettesActions'

class Map extends React.Component {
    constructor (props) {
        super(props)
        console.log('mapconstructor')
        this.setLegend = this.setLegend.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.legendBehavior = this.legendBehavior.bind(this)
        this.axisBehavior = this.axisBehavior.bind(this)
        this.selectElementsAxis = this.selectElementsAxis.bind(this)
        this.state = {
            setLegend: this.setLegend,
            selectElements: this.selectElements,
            legendBehavior: this.legendBehavior,
            axisBehavior: this.axisBehavior,
            elementName: `Map_${props.zone}`
        }
    }
    componentWillMount () {

    }
    render () {
        // console.log('salut Timeline')
        const { data, display, zone } = this.props
        const classN = `Map ${this.refs.elementName}`
        return (<g className = { classN } >
            <g
                transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
                ref = "Map">
            </g>
        </g>)
    }
    /*    setAxis (axis) {
        this.setState({ axis })
    }
    selectElements (prop, value, category) {
        const elements = d3Timeline.getElements(this.refs.Timeline, prop, value, category)
        console.log(elements)
        // console.log(prop, value, elements)
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
    */
    componentDidMount () {
        // console.log(this.props.data)
        d3Map.create(this.refs.Map, { ...this.props, ...this.state })
    }
    componentDidUpdate () {
        // console.log('update')
        d3Map.update(this.refs.Map, { ...this.props, ...this.state })
    }
    componentWillUnmount () {
        d3Map.destroy(this.refs.Map, { ...this.props, ...this.state })
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data,
        configs: state.configs.present,
        palettes: state.palettes,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getPropPalette: getPropPalette(dispatch),
        select: select(dispatch)
    }
}

const MapConnect = connect(mapStateToProps, mapDispatchToProps)(Map)

export default MapConnect
