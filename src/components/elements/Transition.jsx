import React from 'react'
import { connect } from 'react-redux'
import d3Transition from '../../d3/d3Transition'

class Transition extends React.PureComponent {
    render () {
        // console.log('ici')
        const { display, zone } = this.props
        return (<g className = "Transition"
            transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
            ref = { `transition_${zone}` }
        >
        </g>)
    }
    componentDidMount () {
        // console.log('bonjour component Transition')
        const { zone } = this.props
        d3Transition.create(this.refs[`transition_${zone}`], this.props)
    }
    componentWillUnMount () {
        const { zone } = this.props
        d3Transition.destroy(this.refs[`transition_${zone}`], this.props)
    }
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
