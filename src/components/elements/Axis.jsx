import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import * as d3Axis from '../../d3/d3Axis'

import { getDimensions } from '../../lib/scaleLib'

import { select } from '../../actions/selectionActions'
import { selectProperty } from '../../actions/dataActions'

class Axis extends React.PureComponent {
    constructor (props) {
        super(props)
        this.customState = {
            elementName: `ref${props.zone}_axis_${props.type}`,
            dimensions: getDimensions('axis' + props.type, props.display.zones[props.zone], props.display.viz, props.offset)
        }
    }
    render () {
        const { display, offset, type, zone } = this.props
        this.customState.dimensions = getDimensions('axis' + type, display.zones[zone], display.viz, offset)
        const { x, y, width } = this.customState.dimensions
        const x1 = (type === 'Bottom') ? x : x + width
        return (<g className = "Axis"
            transform = { `translate(${x1}, ${y})` }
            ref = {(c) => { this[this.customState.elementName] = c }}
        >
        </g>)
    }
    componentDidMount () {
        d3Axis.create(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        d3Axis.update(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        d3Axis.destroy(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
}

Axis.propTypes = {
    display: PropTypes.object,
    offset: PropTypes.number,
    type: PropTypes.string,
    zone: PropTypes.string,
}

function mapStateToProps (state) {
    return {
        display: state.display,
        selections: state.selections,
        dataset: state.dataset
    }
}

function mapDispatchToProps (dispatch) {
    return {
        select: select(dispatch),
        selectProperty: selectProperty(dispatch)
    }
}

const AxisConnect = connect(mapStateToProps, mapDispatchToProps)(Axis)

export default AxisConnect
