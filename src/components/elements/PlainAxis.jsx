import React from 'react'
import { connect } from 'react-redux'

import d3PlainAxis from '../../d3/d3PlainAxis'

import { getDimensions } from '../../lib/scaleLib'

import { select } from '../../actions/selectionActions'
import { selectProperty } from '../../actions/dataActions'

class PlainAxis extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            elementName: `${props.zone}_axis_${props.type}`,
            dimensions: getDimensions('axisBottom', props.display.zones[props.zone], props.display.viz, props.offset)
        }
    }

    render () {
        const { x, y } = this.state.dimensions
        return (<g className = "Axis"
            transform = { `translate(${x}, ${y})` }
            ref = { this.state.elementName }
        >
        </g>)
    }
    componentDidMount () {
        d3PlainAxis.create(this.refs[this.state.elementName], { ...this.props, ...this.state })
    }
    componentDidUpdate () {
        d3PlainAxis.update(this.refs[this.state.elementName], { ...this.props, ...this.state })
    }
    componentWillUnmount () {
        d3PlainAxis.destroy(this.refs[this.state.elementName], { ...this.props, ...this.state })
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        selections: state.selections,
        dataset: state.dataset.present
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
