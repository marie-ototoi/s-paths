import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { setDisplay } from '../../actions/displayActions'

class Slider extends React.Component {
    constructor (props) {
        super(props)
        this.drag = this.drag.bind(this)
    }
    drag (event) {
        const { display, setDisplay } = this.props
        let asidePercent = event.target.value
        setDisplay({
            screen: display.screen,
            vizDef: { ...display.vizDefPercent, aside_width: asidePercent, main_width: 100 - asidePercent }
        })
    }
    render () {
        return (
            <input
                type='range'
                className='Slider'
                min={0}
                max={50}
                step={25}
                onChange={this.drag}
            />
        )
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
