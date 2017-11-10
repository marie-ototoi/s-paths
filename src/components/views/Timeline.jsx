import React from 'react'
import { connect } from 'react-redux'
import d3Timeline from '../../d3/d3Timeline'
import { addSelection, removeSelection } from '../../actions/selection'

class Timeline extends React.Component {
    render () {
        const { display, env, mode } = this.props
        return (<g className = "Timeline">
        </g>)
    }
    componentDidMount () {
        d3Timeline.create(this.refs.HeatMap, this.props)
    }
    componentDidUpdate () {
        d3Timeline.update(this.refs.HeatMap, this.props)
    }
    componentWillUnmount () {
        d3Timeline.destroy(this.refs.HeatMap)
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
        addSelection: addSelection(dispatch),
        removeSelection: removeSelection(dispatch)
    }
}

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps)(Timeline)

export default TimelineConnect
