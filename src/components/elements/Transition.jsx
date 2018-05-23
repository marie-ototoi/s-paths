import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import * as d3Transition from '../../d3/d3Transition'

class Transition extends React.PureComponent {
    render () {
        // console.log('ici')
        const { display, zone } = this.props
        return (<g className = "Transition"
            transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
            ref = {(c) => { this[`refTransition_${zone}`] = c }}
        >
        </g>)
    }
    componentDidMount () {
        // console.log('bonjour component Transition')
        const { zone } = this.props
        d3Transition.create(this[`refTransition_${zone}`], this.props)
    }
    componentWillUnMount () {
        const { zone } = this.props
        d3Transition.destroy(this[`refTransition_${zone}`], this.props)
    }
}

Transition.propTypes = {
    display: PropTypes.object.isRequired,
    zone: PropTypes.string.isRequired
}

function mapStateToProps (state) {
    return {
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const TransitionConnect = connect(mapStateToProps, mapDispatchToProps)(Transition)

export default TransitionConnect
