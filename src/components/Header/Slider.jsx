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
            step: 5, // TODO: if window size < 1500 ? 50 : 25 (#68),
            value: this.props.display.vizDefPercent.aside_width
        }
    }

    drag (value) {
        const { display, setDisplay } = this.props
        this.setState({value})
        setDisplay({
            screen: display.screen,
            vizDefPercent: {
                ...display.vizDefPercent,
                aside_width: value,
                main_width: 100 - value
            }
        })
    }

    render () {
        return (
            <div className='Slider'>
                <img src = "/images/sliderone.png" alt = "single view" width="28"
                    onClick={() => this.drag(0)}   
                />
                <input
                    type='range'
                    value={this.state.value}
                    min={0}
                    max={45}
                    step={this.state.step}
                    onChange={(event) => this.drag(event.target.value)}
                />
                <img src = "/images/slidertwo.png" alt = "double view" width="28"
                    onClick={() => this.drag(45)}
                />
            </div>
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
