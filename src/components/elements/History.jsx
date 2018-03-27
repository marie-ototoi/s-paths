import React from 'react'
import pluralize from 'pluralize'
import { connect } from 'react-redux'

import d3History from '../../d3/d3History'

import { getDimensions } from '../../lib/scaleLib'

class History extends React.PureComponent {
    constructor (props) {
        super(props)
        this.customState = {
            elementName: `${props.zone}_history`
        }
    }
    render () {
        const { configs, display, offset, zone } = this.props
        console.log(configs.past.map(c => c.filter(z => z.zone === zone)[0].views))
        // this.customState.configs = configs.filter(c => c[0].status === 'active')
        const dimensions = getDimensions('history', display.zones[zone], display.viz, offset)
        const { x, y, width, height } = dimensions
        return (<g
            transform = { `translate(${x}, ${y})` }
        >
        </g>)
    }
    componentDidMount () {
        d3History.create(this.refs[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        d3History.update(this.refs[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        d3History.destroy(this.refs[this.customState.elementName], { ...this.props, ...this.customState })
    }
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const HistoryConnect = connect(mapStateToProps, mapDispatchToProps)(History)

export default HistoryConnect
