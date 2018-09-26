import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { setDisplay } from '../../actions/displayActions'

class Slider extends React.Component {
    constructor (props) {
        super(props)
        this.drag = this.drag.bind(this)
        this.state = {
            step: 25 // TODO: if window size < 1500 ? 50 : 25 (#68)
        }
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
                value={this.props.display.vizDefPercent.aside_width}
                min={0}
                max={50}
                step={this.state.step}
                onChange={this.drag}
                style = {{
                    top: Math.floor((this.props.display.viz.top_margin - 155)/2) + 'px'
                }}
            />
        )
    }

    static propTypes = {
        display: PropTypes.object,
        setDisplay: PropTypes.func.isRequired
    }
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
