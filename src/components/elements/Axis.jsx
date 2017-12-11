import React from 'react'
import { connect } from 'react-redux'
import { select } from '../../actions/selectionActions'
import d3Axis from '../../d3/d3Axis/d3Axis'

class Axis extends React.Component {
    constructor (props) {
        super(props)
        this.state = {}
    }

    render () {
        return (<g className = "Axis" ref = {this.props.zone + '-' + this.props.type} ></g>)
    }
    componentDidMount () {
        if (this.props.zone === undefined || this.props.type === undefined) return
        d3Axis.create(this.refs[this.props.zone + '-' + this.props.type], this.props)
    }
    componentDidUpdate () {
        if (this.props.zone === undefined || this.props.type === undefined) return
        d3Axis.update(this.refs[this.props.zone + '-' + this.props.type], this.props)
    }
    componentWillUnmount () {
        /*
        const { zone, type } = this.props
        if (type === 'plain') {
            d3PlainLegend.destroy(this.refs[`legend_${zone}`])
        }
        */
    }
}

function mapStateToProps (state) {
    return {
        /*        display: state.display,
        data: state.data,
        selections: state.selections
        */
    }
}

function mapDispatchToProps (dispatch) {
    return {
    //    select: select(dispatch)
    }
}

const AxisConnect = connect(mapStateToProps, mapDispatchToProps)(Axis)

export default AxisConnect
