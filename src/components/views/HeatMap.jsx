import React from 'react'
import { connect } from 'react-redux'
import d3HeatMap from '../../d3/d3HeatMap'
import { addSelection, removeSelection } from '../../actions/selectionActions'
import Legend from '../elements/Legend'
import { getPropPalette } from '../../actions/palettesActions'

class HeatMap extends React.Component {
    constructor (props) {
        super(props)
        this.setLegend = this.setLegend.bind(this)
        this.addCallbackToProps = this.addCallbackToProps.bind(this)
        this.state = {}
    }

    render () {
        const { display, zone } = this.props
        // display.zones[this.props.zone].width
        // display.zones[this.props.zone].height
        // this.getData()
        return (<g
            className = "HeatMap { this.props.zone }"
            transform = { `translate(${display.zones[this.props.zone].x}, ${display.zones[this.props.zone].y})` }
            ref = "HeatMap"
        >
            { this.state.legend &&
              <Legend
                  type = "plain"
                  x = { 0 }
                  y = { display.viz.useful_height + display.viz.vertical_margin }
                  width = { display.viz.horizontal_margin }
                  height = { display.viz.vertical_margin }
                  info = { this.state.legend }
                  zone = { zone }
              />
            }
        </g>)
    }
    setLegend (legend) {
        this.setState({ legend })
    }
    addCallbackToProps () {
        return {...this.props, setLegend: this.setLegend }
    }
    componentDidMount () {
        d3HeatMap.create(this.refs.HeatMap, this.addCallbackToProps())
    }
    componentDidUpdate () {
        d3HeatMap.update(this.refs.HeatMap, this.addCallbackToProps())
    }
    componentWillUnmount () {
        d3HeatMap.destroy(this.refs.HeatMap)
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data,
        configs: state.configs.present,
        selections: state.selections.present,
        palettes: state.palettes
    }
}

function mapDispatchToProps (dispatch) {
    return {
        addSelection: addSelection(dispatch),
        removeSelection: removeSelection(dispatch),
        getPropPalette: getPropPalette(dispatch)
    }
}

const HeatMapConnect = connect(mapStateToProps, mapDispatchToProps)(HeatMap)

export default HeatMapConnect
