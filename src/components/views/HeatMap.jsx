import React from 'react'
import { connect } from 'react-redux'
import d3HeatMap from '../../d3/d3HeatMap'

class HeatMap extends React.Component {
    render () {
        const { display } = this.props
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
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
