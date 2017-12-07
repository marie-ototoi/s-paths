import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import d3Timeline from '../../d3/d3Timeline'
import PlainAxis from '../elements/PlainAxis'
import Legend from '../elements/Legend'
import config from '../../lib/configLib'
import dataLib from '../../lib/dataLib'
import selectionLib from '../../lib/selectionLib'
import { select } from '../../actions/selectionActions'
import { getPropPalette } from '../../actions/palettesActions'


class Timeline extends React.Component {
    constructor (props) {
        super(props)
        this.setAxis = this.setAxis.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.state = {
            setAxis: this.setAxis,
            selectElements: this.selectElements
        }
    }
    componentWillMount () {
        const { data, display, zone, configs, palettes, getPropPalette, setLegend } = this.props
        if (dataLib.areLoaded(data, zone)) {
            // prepare the data for display
            const selectedConfig = config.getSelectedConfig(configs, zone)
            const dataZone = dataLib.getResults(data, zone)
            const nestedProp1 = dataLib.groupTimeData(dataZone, 'prop1', selectedConfig.selectedMatch.properties[0].format || 'YYYY-MM-DD', 100)
            //
            const nestedProp2 = d3.nest().key(legend => legend.prop2.value).entries(dataZone)
            const prop2 = selectedConfig.selectedMatch.properties[1].path
            // console.log(palettes, prop2, prop2Data.length)
            const colors = getPropPalette(palettes, prop2, nestedProp2.length)
            const palette = nestedProp2.map((p, i) => {
                return { key: p.key, color: colors[i], propName: 'prop2', label: p.values[0].labelprop2.value }
            })
            const axisBottom = nestedProp1.map(p => {
                return { key: p.key, propName: 'prop1', label: p.values[0].labelprop2.value }
            })
            const axisBottomCategory = selectedConfig.selectedMatch.properties[0].category
            this.setState({ dataZone, selectedConfig, nestedProp1, palette, axisBottom, axisBottomCategory })
        }
    }
    render () {
        // console.log('salut Timeline') 
        const { data, display, zone, configs, palettes, getPropPalette } = this.props
        const { nestedProp1 } = this.state
        const classN = `Timeline_${zone}`
        return (<g className = { classN } >
            <g
                transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
                ref = "Timeline">
            </g>
           
            <Legend 
                x = { display.zones[zone].x }
                y = { display.zones[zone].y + display.viz.useful_height + display.viz.vertical_margin }
                type = "plain"
                zone = { zone }
                width = { display.viz.horizontal_margin }
                height = { display.viz.vertical_margin }
                info = { this.state.palette }
                selectElements = { this.selectElements }
            />
            <PlainAxis
                type = "Bottom"
                zone = { zone }
                x = { display.zones[zone].x + display.viz.horizontal_margin }
                y = { display.zones[zone].y + display.viz.useful_height + display.viz.vertical_margin }
                width = { display.viz.useful_width }
                height = { display.viz.vertical_margin }
                info = { this.state.axisBottom }
                category = { this.state.axisBottomCategory }
                selectElements = { this.selectElements }
            />
        </g>)
    }
    setAxis (axis) {
        this.setState({ axis })
    }
    selectElements (prop, value) {
        const elements = d3Timeline.getElements(this.refs.Timeline, prop, value)
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
    componentDidMount () {
        // console.log(this.props.data)
        d3Timeline.create(this.refs.Timeline, { ...this.props, ...this.state })
    }
    componentDidUpdate () {
        // console.log('update')
        d3Timeline.update(this.refs.Timeline, { ...this.props, ...this.state })
    }
    componentWillUnmount () {
        d3Timeline.destroy(this.refs.Timeline)
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

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps)(Timeline)

export default TimelineConnect
