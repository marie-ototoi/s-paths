import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import * as d3History from '../../d3/d3History'

import { getDimensions } from '../../lib/scaleLib'

import { jump } from '../../actions/historyActions'

class History extends React.PureComponent {
    constructor (props) {
        super(props)
        this.jumpHistory = this.jumpHistory.bind(this)
        this.state = {
            elementName: `${props.zone}_history`
        }
        this.customState = {
            jumpHistory: this.jumpHistory
        }
    }
    jumpHistory (index) {
        // console.log(index, this.customState.currentIndex)
        this.props.jump(index, this.customState.currentIndex)
    }
    render () {
        const { configs, display, offset, zone } = this.props
        this.customState.currentIndex = configs.past.length
        // console.log(this.customState.currentIndex)
        this.customState.configs = [
            ...configs.past,
            configs.present,
            ...configs.future
        ]
            .map(c => {
                return c.filter(cz => cz.zone === zone)[0]
            })
        // console.log(this.customState.configs)
        const dimensions = getDimensions('history', display.zones[zone], display.viz, offset)
        const { x, y } = dimensions
        return (<g
            className = "History"
            ref = { this.state.elementName }
            transform = { `translate(${x}, ${y})` }
        >
        </g>)
    }
    componentDidMount () {
        d3History.create(this[this.state.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        d3History.update(this[this.state.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        d3History.destroy(this[this.state.elementName], { ...this.props, ...this.customState })
    }
}

History.propTypes = {
    configs: PropTypes.object,
    display: PropTypes.object,
    offset: PropTypes.number,
    zone: PropTypes.string,
    jump: PropTypes.func,
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
        jump: jump(dispatch)
    }
}

const HistoryConnect = connect(mapStateToProps, mapDispatchToProps)(History)

export default HistoryConnect
