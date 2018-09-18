import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import BrushLinkLayout from '../../d3/BrushLinkLayout'

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
        return (<g className = "BrushLink"
            transform = { `translate(${dimensions.x + display.viz.horizontal_padding }, ${dimensions.y + display.viz[zone + '_top_padding']})` }
            ref = {(c) => { this[this.customState.elementName] = c }}
        >
        </g>)
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
    }
}

const BrushLinkConnect = connect(mapStateToProps, mapDispatchToProps)(BrushLink)

export default BrushLinkConnect
