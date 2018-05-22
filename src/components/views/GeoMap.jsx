import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import * as d3GeoMap from '../../d3/d3GeoMap'
import Legend from '../elements/Legend'
import History from '../elements/History'
import { select } from '../../actions/selectionActions'
import { getPropPalette } from '../../actions/palettesActions'

class GeoMap extends React.Component {
    constructor (props) {
        super(props)
        this.setLegend = this.setLegend.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.state = {
            setLegend: this.setLegend,
            selectElements: this.selectElements,
            elementName: `refGeoMap_${props.zone}`
        }
    }
    render () {
        // console.log('salut GeoMap')
        const { display, zone } = this.props
        const classN = `GeoMap `
        return (<g className = { classN } >
            <g
                transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
                ref = {(c) => { this[this.state.elementName] = c }} >
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
    setLegend (legend) {
        this.setState({ legend })
    }
    selectElements (elements) {
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
    componentDidMount () {
        // console.log(this.props.data)
        d3GeoMap.create(this[this.state.elementName], { ...this.props, ...this.state })
    }
    componentDidUpdate () {
        // console.log('update')
        d3GeoMap.update(this[this.state.elementName], { ...this.props, ...this.state })
    }
    componentWillUnmount () {
        d3GeoMap.destroy(this[this.state.elementName], { ...this.props, ...this.state })
    }
}

GeoMap.propTypes = {
    display: PropTypes.object,
    selections: PropTypes.array,
    zone: PropTypes.string,
    select: PropTypes.func,
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data,
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

const GeoMapConnect = connect(mapStateToProps, mapDispatchToProps)(GeoMap)

export default GeoMapConnect
