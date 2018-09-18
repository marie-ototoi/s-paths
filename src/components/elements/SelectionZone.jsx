import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { handleMouseDown, handleMouseUp } from '../../actions/selectionActions'

class SelectionZone extends React.PureComponent {
    render () {
        const { dimensions, display, component, selections, zone } = this.props
        return (<rect
            className = "SelectionZone"
            ref = { `selectionZone_${zone}` }
            fill = "transparent"
            width = { dimensions.width }
            height = { dimensions.height }
            onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, component, selections) } }
            transform = { `translate(${dimensions.x}, ${dimensions.y})` }
        ></rect>)
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
