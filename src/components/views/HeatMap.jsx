import React from 'react'
import { connect } from 'react-redux'

class HeatMap extends React.Component {
    render () {
        const { display, env, mode } = this.props
        return (<g className = "HeatMap">
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

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
