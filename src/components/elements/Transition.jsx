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
        return (<svg
            className = "Transition"
            width = { dimensions.width }
            height = { dimensions.height + 10 }
            style = {{ position: 'absolute', top: 0 }}
            transform = { `translate(${dimensions.x}, ${dimensions.y})` }
        >
            <g
                ref = {(c) => { this[this.customState.elementName] = c }}
            >
            </g>
        </svg>)
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
