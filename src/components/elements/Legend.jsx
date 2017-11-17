import React from 'react'
import d3PlainLegend from '../../d3/d3PlainLegend'

class Legend extends React.Component {
    render () {
        const { zone } = this.props
        return (<g className = "legend" ref = { `legend_${zone}` }>
        </g>)
    }
    componentDidMount () {
        const { zone } = this.props
        d3PlainLegend.create(this.refs[`legend_${zone}`], this.props)
    }
    componentDidUpdate () {
        const { zone } = this.props
        d3PlainLegend.update(this.refs[`legend_${zone}`], this.props)
    }
    componentWillUnmount () {
        const { zone } = this.props
        d3PlainLegend.destroy(this.refs[`legend_${zone}`])
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data,
        selections: state.selections.present
    }
}

function mapDispatchToProps (dispatch) {
    return {
        addSelection: addSelection(dispatch),
        removeSelection: removeSelection(dispatch)
    }
}

const LegendConnect = connect(mapStateToProps, mapDispatchToProps)(Legend)

export default LegendConnect
