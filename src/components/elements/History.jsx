import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import HistoryLayout from '../../d3/HistoryLayout'

import { getDimensions } from '../../lib/scaleLib'

import { jump } from '../../actions/historyActions'

class History extends React.PureComponent {
    constructor (props) {
        super(props)
        this.jumpHistory = this.jumpHistory.bind(this)
        this.customState = {
            elementName: `${props.zone}_history`,
            jumpHistory: this.jumpHistory
        }
    }
    jumpHistory (index) {
        // console.log(index, this.customState.currentIndex)
        this.props.jump(index, this.customState.currentIndex)
    }
    render () {
        const { configs, display, offset, zone } = this.props        
        // console.log(this.customState.currentIndex)
        this.customState.historyConfigs = [
            ...configs.past,
            configs.present,
            ...configs.future
        ]
        this.customState.currentIndex = configs.past.length
        // console.log(this.customState.currentIndex)
        const dimensions = getDimensions('history', display.viz, {x:0, y:-10, width:0, height:0})
        const { x, y } = dimensions
        return (<svg
            className = "History"
            width = { dimensions.width }
            height = { dimensions.height }
            style = {{ position: 'absolute', zIndex: 30, top: y + 'px', left: x + 'px' }}
        >
            <g
                ref = {(c) => { this[this.customState.elementName] = c }}
                transform = { `translate(0, 5)` }
            >
            </g>
        </svg>)
    }
    componentDidMount () {
        this.layout = new HistoryLayout(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        this.layout.update(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        this.layout.destroy(this[this.customState.elementName])
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
