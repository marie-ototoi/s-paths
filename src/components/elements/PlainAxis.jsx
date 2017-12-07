import React from 'react'
import { connect } from 'react-redux'
import d3PlainLegend from '../../d3/d3Axis/d3Axis'
import { select } from '../../actions/selectionActions'
import d3PlainAxis from '../../d3/d3PlainAxis'

class PlainAxis extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            ref: `${this.props.zone}_axis_${this.props.type}`
        }
    }

    render () {
        return (<g className = "Axis"
            transform = { `translate(${this.props.x}, ${this.props.y})` }
            ref = { this.state.ref }
        >
        </g>)
    }
    componentDidMount () {
        d3PlainAxis.update(this.refs[this.state.ref], this.props)
    }
    componentDidUpdate () {
        d3PlainAxis.update(this.refs[this.state.ref], this.props)
    }
    componentWillUnmount () {
        d3PlainAxis.destroy(this.refs[this.state.ref])
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        select: select(dispatch)
    }
}

const PlainAxisConnect = connect(mapStateToProps, mapDispatchToProps)(PlainAxis)

export default PlainAxisConnect
