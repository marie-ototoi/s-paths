import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { handleMouseDown, handleMouseUp } from '../../actions/selectionActions'
import * as selectionLib from '../../lib/selectionLib'

class SelectionZone extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {
            x2: null,
            y2: null
        }
       
    }
    render () {
        const { dimensions, display, component, selections, zone } = this.props

        const selectedZone = selectionLib.getRectSelection({
            x1: display.selectedZone[zone].x1,
            y1: display.selectedZone[zone].y1,
            x2: this.state.x2,
            y2: this.state.y2
        })
        return (<g className = "SelectionZone">
            <rect
                ref = { `selectionZone_${zone}` }
                fill = "transparent"
                width = { dimensions.width - (display.viz.horizontal_padding * 2 ) }
                height = { dimensions.height  - (display.viz.top_margin /2 )  }
                transform = { `translate(${dimensions.x + dimensions.horizontal_padding }, ${dimensions.y})` }
                onMouseMove = { (e) => { this.setState({ x2: e.pageX, y2: e.pageY }) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, component, selections) } }
            ></rect>
            { display.selectedZone[zone].x1 && this.state.x2 &&
                <rect
                    fill = "#ddd"
                    fillOpacity = {0.2}
                    stroke = "#666"
                    strokeWidth = {0.5}
                    x = { selectedZone.x1 }
                    y = { selectedZone.y1 }
                    transform = { `translate(${-(dimensions.x + display.viz[zone+'_x'])}, 0)` }
                    width = { selectedZone.x2 - selectedZone.x1 }
                    height = { selectedZone.y2 - selectedZone.y1 }
                    onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, component, selections) } }
                ></rect>
            }
        </g>)
    }
}
SelectionZone.propTypes = {
    dimensions: PropTypes.object,
    display: PropTypes.object,
    component: PropTypes.object,
    selections: PropTypes.array,
    zone: PropTypes.string,
    handleMouseDown: PropTypes.func,
    handleMouseUp: PropTypes.func,
    handleMouseMove: PropTypes.func
}

function mapStateToProps (state) {
    return {
        dataset: state.dataset,
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
        handleMouseDown: handleMouseDown(dispatch),
        handleMouseUp: handleMouseUp(dispatch)
    }
}

const SelectionZoneConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(SelectionZone)

export default SelectionZoneConnect
