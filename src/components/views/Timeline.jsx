import React from 'react'
import { connect } from 'react-redux'
import d3Timeline from '../../d3/d3Timeline'
import { addSelection, removeSelection } from '../../actions/selection'

class Timeline extends React.Component {
    render () {
        //console.log('salut Timeline')
        const { display, zone } = this.props
        return (<g className = "Timeline { this.props.zone }" 
            transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
            ref = "Timeline">
        </g>)
    }
    componentDidMount () {
        // console.log(this.props.data)
        d3Timeline.create(this.refs.Timeline, this.props)
    }
    componentDidUpdate () {
        //console.log('update')
        d3Timeline.update(this.refs.Timeline, this.props)
    }
    componentWillUnmount () {
        d3Timeline.destroy(this.refs.Timeline)
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data,
        configs: state.configs.present
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
