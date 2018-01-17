import React from 'react'
import { connect } from 'react-redux'

class Transition extends React.PureComponent {
    render () {
        const { dimensions, zone } = this.props
        return (<g className = "Transition"
            transform = { `translate(${dimensions.x}, ${dimensions.y})` }
            ref = { `transition_${zone}` }
        >
        </g>)
    }
}

function mapStateToProps (state) {
    return {
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const TransitionConnect = connect(mapStateToProps, mapDispatchToProps)(Transition)

export default TransitionConnect
