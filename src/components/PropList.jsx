import React from 'react'
import { connect } from 'react-redux'

class PropList extends React.Component {

    render () {
        const { display, env, mode } = this.props       
        return (<g className = "PropList">
        </g>)
    }
}

function mapStateToProps(state) {
    return {
        display: state.display,
        env: state.env,
        mode: state.mode
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

const PropListConnect = connect(mapStateToProps, mapDispatchToProps)(PropList)

export default PropListConnect
