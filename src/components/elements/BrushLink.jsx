import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import BrushLinkLayout from '../../d3/BrushLinkLayout'
import { handleMouseDown } from '../../actions/selectionActions'

class BrushLink extends React.PureComponent {
    constructor (props) {
        super(props)
        this.customState = {
            elementName: `${props.zone}_brushlink`
        }
    }
    render () {
        // console.log('ici')
        const { dimensions, display, zone } = this.props
        return (<svg
            className = "BrushLink" 
            width = { dimensions.width }
            height = { dimensions.height }
            style = {{ position: 'absolute', top: 0 }}
            transform = { `translate(${dimensions.x + 1}, ${dimensions.y})` }
            onMouseDown = { (e) => this.props.handleMouseDown(e, zone, display) }
        >
            <g      
                ref = {(c) => { this[this.customState.elementName] = c }}
            >
            </g>
        </svg>)
    }
    componentDidMount () {
        this.layout = new BrushLinkLayout(this[this.customState.elementName], this.props)
    }
    componentDidUpdate () {
        this.layout.update(this[this.customState.elementName], this.props)
    }
    componentWillUnMount () {
        this.layout.destroy(this[this.customState.elementName])
    }
}

BrushLink.propTypes = {
    display: PropTypes.object,
    dimensions: PropTypes.object,
    selections:  PropTypes.array,
    handleMouseDown: PropTypes.func,
    zone: PropTypes.string.isRequired
}

function mapStateToProps (state) {
    return {
        display: state.display,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        handleMouseDown: handleMouseDown(dispatch),
    }
}

const BrushLinkConnect = connect(mapStateToProps, mapDispatchToProps)(BrushLink)

export default BrushLinkConnect
