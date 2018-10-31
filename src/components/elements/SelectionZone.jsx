import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { throttle } from '../../lib/scaleLib'
import { handleMouseDown, handleMouseUp } from '../../actions/selectionActions'
import * as selectionLib from '../../lib/selectionLib'

class SelectionZone extends React.PureComponent {
    constructor (props) {
        super(props)
        this.testThrottle = this.testThrottle.bind(this)
        this.state = {
            x2: null,
            y2: null
        }
        this.listener = window.addEventListener('mousemove', throttle(this.testThrottle, 200))
    }
    testThrottle(e) {
        // console.log(e)
        this.setState({ x2: e.pageX, y2: e.pageY })
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
                width = { dimensions.width }
                height = { dimensions.height }
                onMouseDown = { (e) => { console.log('toto'); this.props.handleMouseDown(e, zone, display) } }
                onMouseUp = { (e) => { console.log('toto'); this.props.handleMouseUp(e, zone, display, component, selections) } }
            ></rect>
            { this.state.x2 }
            { display.selectedZone[zone].x1 && this.state.x2 &&
                <rect
                    transform = { `translate(${-dimensions.x}, ${-dimensions.y})` }
                    fill = "#ddd"
                    fillOpacity = {0.2}
                    stroke = "#333"
                    x = { selectedZone.x1 }
                    y = { selectedZone.y1 }
                    width = { selectedZone.x2 - selectedZone.x1 }
                    height = { selectedZone.y2 - selectedZone.y1 }
                    onMouseUp = { (e) => { console.log('toto'); this.props.handleMouseUp(e, zone, display, component, selections) } }
                ></rect>
            }
        </g>)
    }
    componentWillUnMount() {
        window.removeEventListener('mousemove')
    }
}
/*
 if (display.selectedZone[zone].x1 !== null) {
            // console.log(this.refmain.getWrappedInstance().getElementsInZone({zoneDimensions:}))
            const selectedZone = selectionLib.getRectSelection({
                ...display.selectedZone[zone],
                x2: e.pageX,
                y2: e.pageY
            })
            // console.log(zone, selectedZone, display.viz[zone + '_x'])
            d3.select(this['refView']).selectAll('rect.selection')
                .data([selectedZone])
                .enter()
                .append('rect')
                .attr('class', 'selection')
                .on('mouseup', d => {
                    // console.log(d3.event.pageX, d3.event.pageY)
                    this.props.handleMouseUp({
                        pageX: d3.event.pageX - display.viz[zone + '_x'],
                        pageY: d3.event.pageY - display.viz[zone + '_top_padding'] - display.viz.top_margin
                    }, zone, display, this.refmain.getWrappedInstance(), selections)
                })
            d3.select(this['refView']).select('rect.selection')
                .attr('width', selectedZone.x2 - selectedZone.x1)
                .attr('height', selectedZone.y2 - selectedZone.y1)
                .attr('x', selectedZone.x1)
                .attr('y', selectedZone.y1)
        }*/

//  onMouseMove = { (e) => { this.props.handleMouseMove(e, zone) } }
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
