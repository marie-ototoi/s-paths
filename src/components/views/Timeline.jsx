import React from 'react'
import { connect } from 'react-redux'

class Timeline extends React.Component {
    render () {
        const { display, env, mode } = this.props
        return (<g className = "Timeline">
        </g>)
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        env: state.env,
        mode: state.mode
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps)(Timeline)

export default TimelineConnect
