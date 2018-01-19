import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'

import d3PlainLegend from '../../d3/d3PlainLegend'

import { getDimensions } from '../../lib/scaleLib'

import { select } from '../../actions/selectionActions'

class Legend extends React.PureComponent {
    render () {
        const { display, offset, zone } = this.props
        const dimensions = getDimensions('legend', display.zones[zone], display.viz, offset)
        return (<g className = "Legend"
            transform = { `translate(${dimensions.x}, ${dimensions.y})` }
            ref = { `legend_${zone}` }
        >
        </g>)
    }
    shouldComponentUpdate (nextProps, nextState) {
        return !shallowEqual(this.props, nextProps)
    }
    componentDidMount () {
        const { zone, type } = this.props
        if (type === 'plain') {
            d3PlainLegend.create(this.refs[`legend_${zone}`], this.props)
        }
    }
    componentDidUpdate () {
        // console.log('upd')
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
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const LegendConnect = connect(mapStateToProps, mapDispatchToProps)(Legend)

export default LegendConnect
