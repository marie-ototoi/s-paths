import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import LegendLayout from '../../d3/LegendLayout'

import { getDimensions } from '../../lib/scaleLib'

class Legend extends React.PureComponent {
    constructor (props) {
        super(props)
        this.customState = {
            elementName: `legend_${props.zone}`
        }
    }
    render () {
        const { display, offset, zone } = this.props
        const dimensions = getDimensions(zone + 'Legend', display.viz, offset)
        this.customState.dimensions = dimensions
        return (<g className = "Legend"
            transform = { `translate(${dimensions.x}, ${dimensions.y})` }
            ref = {(c) => { this[this.customState.elementName] = c }}
        >
        </g>)
    }
    componentDidMount () {
        this.layout = new LegendLayout(this[this.customState.elementName], { ...this.props, ...this.customState })
       
    }
    componentDidUpdate () {
        this.layout.update(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        this.layout.destroy(this[this.customState.elementName])
    }
}

Legend.propTypes = {
    display: PropTypes.object,
    dataset: PropTypes.object,
    offset: PropTypes.object,
    type: PropTypes.string,
    zone: PropTypes.string,
}

function mapStateToProps (state) {
    return {
        display: state.display,
        dataset: state.dataset,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const LegendConnect = connect(mapStateToProps, mapDispatchToProps)(Legend)

export default LegendConnect
