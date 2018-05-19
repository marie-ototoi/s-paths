import React from 'react'
// import pluralize from 'pluralize'
import { connect } from 'react-redux'
import PropSelector from './PropSelector'
import { getDimensions } from '../../lib/scaleLib'

class Header extends React.PureComponent {
    render () {
        const { config, dataset, display, zone } = this.props
        // const dimensions = getDimensions('header', display.zones[zone], display.viz, offset)
        // const { x, y, width, height } = dimensions
        // console.log(dataset.resources)
        return (
            <g>
                <PropSelector
                    type = "header"
                    selected = { false }
                    key = { zone + '_propselector_resources' }
                    propList = { dataset.resources.map((resource, index) => { return { total: resource.total, readablePath: [{ label: resource.label, comment: resource.comment }], path: resource.type, selected: resource.type === dataset.entrypoint } }) }
                    config = { config }
                    dimensions = { getDimensions('header', display.zones[zone], display.viz, { x: 0, y: 0, width: 0, height: 0 }) }
                    zone = { zone }
                />
            </g>
        )
        /* return (<foreignObject
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
        </foreignObject>) */
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
        dataset: state.dataset,
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
