import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import AxisLayout from '../../d3/AxisLayout'

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
        const { x, y } = this.customState.dimensions
        return (<g className = "Axis"
            transform = { `translate(${x}, ${y})` }
            ref = {(c) => { this[this.customState.elementName] = c }}
        >
        </g>)
    }
    componentDidMount () {
        this.layout = new AxisLayout(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        this.layout.update({ ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        this.layout.destroy()
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
