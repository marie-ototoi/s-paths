import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

class SelectionZone extends React.PureComponent {
    render () {
        const { dimensions, zone } = this.props
        return (<rect
            className = "SelectionZone"
            ref = { `selectionZone_${zone}` }
            fill = "transparent"
            width = { dimensions.width }
            height = { dimensions.height }
            onMouseDown = { this.props.handleMouseDown }
            onMouseUp = { this.props.handleMouseUp }
            onMouseMove = { this.props.handleMouseMove }
            transform = { `translate(${dimensions.x}, ${dimensions.y})` }
        ></rect>)
    }
}

SelectionZone.propTypes = {
    dimensions: PropTypes.object,
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
    }
}

const SelectionZoneConnect = connect(mapStateToProps, mapDispatchToProps)(SelectionZone)

export default SelectionZoneConnect
