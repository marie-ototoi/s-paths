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
            selectElements: this.selectElements,
            elementName: `Timeline_${props.zone}`
        }
    }
    componentWillMount () {
        const { data, display, zone, configs, palettes, getPropPalette, setLegend } = this.props
        if (dataLib.areLoaded(data, zone)) {
            // prepare the data for display
            const selectedConfig = config.getSelectedConfig(configs, zone)
            const dataZone = dataLib.getResults(data, zone)
            const nestedProp1 = dataLib.groupTimeData(dataZone, 'prop1', selectedConfig.selectedMatch.properties[0].format || 'YYYY-MM-DD', 100)
            const axisBottom = {
                info: nestedProp1.map(p => {
                    let values
                    const catProp1 = selectedConfig.selectedMatch.properties[0].category
                    if (catProp1 === 'datetime') {
                        values = [d3.min(p.values, d => Number(d.year)), d3.max(p.values, d => Number(d.year))]
                    } else if (catProp1 === 'text' || catProp1 === 'uri') {
                        values = p.key
                    } else if (catProp1 === 'number') {
                        values = [d3.min(p.values, d => Number(d.prop1.value)), d3.max(p.values, d => Number(d.prop1.value))]
                    }
                    return {
                        key: p.key,
                        propName: 'prop1',
                        values,
                        category: catProp1
                    }
                }),
                category: selectedConfig.selectedMatch.properties[0].category,
                configs: selectedConfig.matches
            }
            //
            const nestedProp2 = d3.nest().key(legend => legend.prop2.value).entries(dataZone)
            const prop2 = selectedConfig.selectedMatch.properties[1].path
            const catProp2 = selectedConfig.selectedMatch.properties[1].category
            // console.log(palettes, prop2, prop2Data.length)
            const colors = getPropPalette(palettes, prop2, nestedProp2.length)
            const palette = nestedProp2.map((p, i) => {
                return {
                    key: p.key,
                    color: colors[i],
                    propName: 'prop2',
                    label: p.values[0].labelprop3.value,
                    category: catProp2
                }
            })
            //
            this.setState({ dataZone, selectedConfig, nestedProp1, palette, axisBottom })
        }
    }
    render () {
        // console.log('salut Timeline')
        const { data, display, zone, configs, palettes, getPropPalette } = this.props
        const { nestedProp1 } = this.state
        const classN = `Timeline ${this.refs.elementName}`
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
                refsvg = { this.props.refsvg }
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
                refsvg = { this.props.refsvg }
                info = { this.state.axisBottom.info }
                category = { this.state.axisBottom.category }
                label = { this.state.axisBottom.labels }
                selectElements = { this.selectElements }
                configs = { this.state.axisBottom.configs }
            />
        </g>)
    }
    setAxis (axis) {
        this.setState({ axis })
    }
    selectElements (prop, value, category) {
        const elements = d3Timeline.getElements(this.refs.Timeline, prop, value, category)
        console.log(elements)
        // console.log(prop, value, elements)
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
        d3Timeline.destroy(this.refs.Timeline, { ...this.props, ...this.state })
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
