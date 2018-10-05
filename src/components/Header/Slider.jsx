import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setDisplay } from '../../actions/displayActions'
import './Slider.css'

class Slider extends React.Component {
    constructor (props) {
        super(props)
        this.drag = this.drag.bind(this)
        this.state = {
            step: 5 // TODO: if window size < 1500 ? 50 : 25 (#68)
        }
    }

    drag (event) {
        const { display, setDisplay } = this.props
        let asidePercent = event.target.value
        setDisplay({
            screen: display.screen,
            vizDefPercent: {
                ...display.vizDefPercent,
                aside_width: asidePercent,
                main_width: 100 - asidePercent
            }
        })
    }

    render () {
        return (
            <input
                type='range'
                className='Slider'
                value={this.props.display.vizDefPercent.aside_width}
                min={0}
                max={45}
                step={this.state.step}
                onChange={this.drag}
            />
        )
    }

    static propTypes = {
        display: PropTypes.object,
        setDisplay: PropTypes.func.isRequired
    }
}

const SliderConnect = connect(
    (state) => ({
        display: state.display
    }),
    (dispatch) => ({
        setDisplay: setDisplay(dispatch)
    })
)(Slider)

export default SliderConnect
