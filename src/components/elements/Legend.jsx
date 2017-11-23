import React from 'react'
import { connect } from 'react-redux'
import d3PlainLegend from '../../d3/d3PlainLegend'
import { select } from '../../actions/selectionActions'

class Legend extends React.Component {
    render () {
        const { zone } = this.props
        return (<g className = "Legend"
            transform = { `translate(${this.props.x}, ${this.props.y})` }
            ref = { `legend_${zone}` }
        >
        </g>)
    }
    componentDidMount () {
        const { zone, type } = this.props
        if (type === 'plain') {
            d3PlainLegend.create(this.refs[`legend_${zone}`], this.props)
        }
    }
    componentDidUpdate () {
        const { zone, type } = this.props
        if (type === 'plain') {
            d3PlainLegend.update(this.refs[`legend_${zone}`], this.props)
        }
    }
    componentWillUnmount () {
        const { zone, type } = this.props
        if (type === 'plain') {
            d3PlainLegend.destroy(this.refs[`legend_${zone}`])
        }
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

const LegendConnect = connect(mapStateToProps, mapDispatchToProps)(Legend)

export default LegendConnect
