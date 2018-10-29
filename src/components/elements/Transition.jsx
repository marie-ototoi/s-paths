import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import TransitionLayout from '../../d3/TransitionLayout'

class Transition extends React.PureComponent {
    constructor (props) {
        super(props)
        this.customState = {
            elementName: `${props.zone}_transition`
        }
    }
    render () {
        // console.log('ici')
        const { dimensions, display, zone } = this.props
        return (<g className = "Transition"
            transform = { `translate(${dimensions.x}, ${dimensions.y + display.viz[zone + '_top_padding']})` }
            ref = {(c) => { this[this.customState.elementName] = c }}
        >
        </g>)
    }
    componentDidMount () {
        this.layout = new TransitionLayout(this[this.customState.elementName], this.props)
        this.layout.layTransition(this.props)
    }
    componentWillUnMount () {
        this.layout.destroy(this[this.customState.elementName])
    }
}

Transition.propTypes = {
    display: PropTypes.object,
    dimensions: PropTypes.object,   
    zone: PropTypes.string.isRequired
}

function mapStateToProps (state) {
    return {
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const TransitionConnect = connect(mapStateToProps, mapDispatchToProps)(Transition)

export default TransitionConnect
