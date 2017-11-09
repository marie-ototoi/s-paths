import React from 'react'
import { connect } from 'react-redux'
import d3HeatMap from '../../d3/d3HeatMap'

class HeatMap extends React.Component {
    getData() {
        const { data } = this.props
        return data.filter(d => d.zone === this.props.zone)[0].statements
    }
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
            <rect x = { 10 } y = { 20 } width = { 100 } height = { 100 } />
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
    }
}

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
