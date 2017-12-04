import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import d3Timeline from '../../d3/d3Timeline'
import Legend from '../elements/Legend'
import config from '../../lib/configLib'
import dataLib from '../../lib/dataLib'
import selectionLib from '../../lib/selectionLib'
import { select } from '../../actions/selectionActions'
import { getPropPalette } from '../../actions/palettesActions'


class Timeline extends React.Component {
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
        const { data, display, zone, configs, palettes, getPropPalette, setLegend } = this.props
        if (dataLib.areLoaded(data, zone)) {
            const selectedConfig = config.getSelectedConfig(configs, zone)
            const dataZone = dataLib.getResults(data, zone)
            const nestedData = dataLib.groupTimeData(dataZone, 'prop1', selectedConfig.selectedMatch.properties[0].format, 150)
            //
            const prop2Data = d3.nest().key(legend => {
                return (legend.labelprop2 && legend.labelprop2.value !== '') ? legend.labelprop2.value : legend.prop2.value
            }).entries(dataZone)
            const prop2 = selectedConfig.selectedMatch.properties[1].path
            // console.log(palettes, prop2, prop2Data.length)
            const colors = getPropPalette(palettes, prop2, prop2Data.length)
            const palette = prop2Data.map((p, i) => {
                return { key: p.key, color: colors[i] }
            })
            this.setState({ dataZone, selectedConfig, nestedData, palette })
        }
    }
    render () {
        // console.log('salut Timeline') 
        const { data, display, zone, configs, palettes, getPropPalette, setLegend } = this.props

        return (<g className = "Timeline { zone }">
            <g
                transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
                ref = "Timeline">
            </g>
            { this.state.legend &&
                <Legend 
                    type = "plain"
                    x = { display.zones[zone].x }
                    y = { display.zones[zone].y + display.viz.useful_height + display.viz.vertical_margin }
                    width = { display.viz.horizontal_margin }
                    height = { display.viz.vertical_margin }
                    info = { this.state.legend }
                    zone = { zone }
                    selectElements = { this.selectElements }
                />
            }
        </g>)
    }
    setLegend (legend) {
        this.setState({ legend })
    }
    selectElements (elements) {
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
