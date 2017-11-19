import React from 'react'
import { connect } from 'react-redux'
import d3Timeline from '../../d3/d3Timeline'
import Legend from '../elements/Legend'
import { addSelection, removeSelection } from '../../actions/selectionActions'
import { getPropPalette } from '../../actions/palettesActions'

class Timeline extends React.Component {
    constructor (props) {
        super(props)
        this.setLegend = this.setLegend.bind(this)
        this.addCallbackToProps = this.addCallbackToProps.bind(this)
        this.state = {}
    }
    render () {
        // console.log('salut Timeline')
        const { display, zone } = this.props
        return (<g className = "Timeline { zone }">
            <g
                transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
                ref = "Timeline">
            </g>
            { this.state.legend &&
                <Legend 
                    type = "plain" 
                    x = { display.zones[zone].x } 
                    y = { display.zones[zone].y + display.viz.useful_height + display.viz.vertical_margin }
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
        // console.log(this.props.data)
        d3Timeline.create(this.refs.Timeline, this.addCallbackToProps())
    }
    componentDidUpdate () {
        // console.log('update')
        d3Timeline.update(this.refs.Timeline, this.addCallbackToProps())
    }
    componentWillUnmount () {
        d3Timeline.destroy(this.refs.Timeline)
    }
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data,
        configs: state.configs.present,
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

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps)(Timeline)

export default TimelineConnect
