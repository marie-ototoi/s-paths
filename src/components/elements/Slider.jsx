import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { setDisplay } from '../../actions/displayActions'

class Slider extends React.Component {
    constructor (props) {
        super(props)
        this.drag = this.drag.bind(this)
        this.dragLeave = this.dragLeave.bind(this)
        this.state = {
        }
    }
    dragLeave (e) {
        const { display, setDisplay } = this.props
        let asidePercent = Math.floor(100 * this.state.x / display.screen.width)
        this.setState({ x : null })
        if (asidePercent !== 0) {
            setDisplay({
                screen: display.screen,
                vizDef: { ...display.vizDefPercent, aside_width: asidePercent, main_width: 100 - asidePercent }
            })
        }
    }
    drag (e) {
        this.setState({ x : e.pageX })
    }
    render () {
        const { display } = this.props
        let x = this.state.x || display.viz.aside_width
        return (<line
            onDrag = { this.drag }
            onDragLeave = { this.dragLeave }
            y1 = { display.viz.top_margin }
            x1 = { x }
            y2 = { display.viz.top_margin + display.viz.useful_height }
            x2 = { x }
            className = "Slider"
        />)
    }
}

Slider.propTypes = {
    display: PropTypes.object,
    setDisplay: PropTypes.func.isRequired
}

function mapStateToProps (state) {
    return {
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
        setDisplay: setDisplay(dispatch),
    }
}

const SliderConnect = connect(mapStateToProps, mapDispatchToProps)(Slider)

export default SliderConnect
