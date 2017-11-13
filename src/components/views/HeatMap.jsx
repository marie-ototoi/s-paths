import React from 'react'
import { connect } from 'react-redux'
import d3HeatMap from '../../d3/d3HeatMap'
import { addSelection, removeSelection } from '../../actions/selection'

class HeatMap extends React.Component {
    render () {
        const { display } = this.props
        // display.zones[this.props.zone].width
        // display.zones[this.props.zone].height
        // this.getData()

        return (<g
            className = "HeatMap { this.props.zone }"
            transform = { `translate(${display.zones[this.props.zone].x}, ${display.zones[this.props.zone].y})` }
            ref = "HeatMap"
        >
        </g>)
    }
    componentDidMount () {
        d3HeatMap.create(this.refs.HeatMap, this.props)
    }
    componentDidUpdate () {
        d3HeatMap.update(this.refs.HeatMap, this.props)
    }
    componentWillUnmount () {
        d3HeatMap.destroy(this.refs.HeatMap)
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data
    }
}

function mapDispatchToProps (dispatch) {
    return {
        addSelection: addSelection(dispatch),
        removeSelection: removeSelection(dispatch)
    }
}

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
