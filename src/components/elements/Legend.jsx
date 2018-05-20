import PropTypes from 'prop-types'
import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'

import d3Legend from '../../d3/d3Legend'

import { getDimensions } from '../../lib/scaleLib'

class Legend extends React.PureComponent {
    constructor (props) {
        super(props)
        this.customState = {
            element_name: `legend_${props.zone}`
        }
    }
    render () {
        const { display, offset, zone } = this.props
        const dimensions = getDimensions('legend', display.zones[zone], display.viz, offset)
        this.customState.dimensions = dimensions
        return (<g className = "Legend"
            transform = { `translate(${dimensions.x}, ${dimensions.y})` }
            ref = {(c) => { this[this.customState.element_name] = c }}
        >
        </g>)
    }
    shouldComponentUpdate (nextProps, nextState) {
        return !shallowEqual(this.props, nextProps)
    }
    componentDidMount () {
        const { type } = this.props
        if (type === 'plain') {
            d3Legend.create(this[this.customState.element_name], { ...this.props, ...this.customState })
        }
    }
    componentDidUpdate () {
        // console.log('upd')
        const { type } = this.props
        if (type === 'plain') {
            d3Legend.update(this[this.customState.element_name], { ...this.props, ...this.customState })
        }
    }
    componentWillUnmount () {
        const { type } = this.props
        if (type === 'plain') {
            d3Legend.destroy(this[this.customState.element_name])
        }
    }
}

Legend.propTypes = {
    display: PropTypes.object,
    offset: PropTypes.object,
    type: PropTypes.string,
    zone: PropTypes.string,
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
