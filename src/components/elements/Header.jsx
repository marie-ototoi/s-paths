import React from 'react'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import { getDimensions } from '../../lib/scaleLib'

class Header extends React.PureComponent {
    render () {
        const { data, dataset, display, offset, zone } = this.props
        const dimensions = getDimensions('header', display.zones[zone], display.viz, offset)
        const { x, y, width, height } = dimensions
        return (<foreignObject
            transform = { `translate(${x}, ${y})` }
            width = { width }
            height = { height }
        >
            <h1 >
                <strong
                    data-toggle="tooltip" data-placement="bottom"
                    title = { dataset.labels[0].comment || '' }
                >
                    { pluralize(dataset.labels[0].label || dataset.labels[0].prefUri, data.length) }
                </strong><br />
                <span>{ dataset.labels[0].comment }</span>
            </h1>
        </foreignObject>)
        // <span> in </span>
        // { this.props.dataset.endpoint }
    }
    componentDidMount () {
    }
    componentDidUpdate () {
    }
    componentWillUnmount () {
    }
}

function mapStateToProps (state) {
    return {
        dataset: state.dataset.present,
        data: state.data,
        display: state.display
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const HeaderConnect = connect(mapStateToProps, mapDispatchToProps)(Header)

export default HeaderConnect
