import React from 'react'
import { connect } from 'react-redux'

import d3PlainAxis from '../../d3/d3PlainAxis'

import { getDimensions } from '../../lib/scaleLib'

import { select } from '../../actions/selectionActions'
import { selectProperty } from '../../actions/dataActions'

class PlainAxis extends React.PureComponent {
    constructor (props) {
        super(props)
        this.customState = {
            elementName: `${props.zone}_axis_${props.type}`,
            dimensions: getDimensions('axis' + props.type, props.display.zones[props.zone], props.display.viz, props.offset)
        }
    }
    render () {
        const { display, offset, type, zone } = this.props
        this.customState.dimensions = getDimensions('axis' + type, display.zones[zone], display.viz, offset)
        const { x, y, width, height } = this.customState.dimensions
        const x1 = (type === 'Bottom') ? x : x + width
        return (<g className = "Axis"
            transform = { `translate(${x1}, ${y})` }
            ref = { this.customState.elementName }
        >
        </g>)
    }
    componentDidMount () {
        d3PlainAxis.create(this.refs[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        d3PlainAxis.update(this.refs[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        d3PlainAxis.destroy(this.refs[this.customState.elementName], { ...this.props, ...this.customState })
    }
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

const PlainAxisConnect = connect(mapStateToProps, mapDispatchToProps)(PlainAxis)

export default PlainAxisConnect
