import React from 'react'
import pluralize from 'pluralize'
import { connect } from 'react-redux'

class Nav extends React.PureComponent {
    render () {
        const { data, dataset, dimensions, displayedInstances, selections, zone } = this.props
        // console.log(dataset.stats)
        let options = [
            { label: 'endpoint', total: dataset.stats.totalInstances },
            { label: 'query', total: dataset.stats.selectionInstances },
            { label: 'displayed', total: displayedInstances },
            { label: 'selected', total: selections.length }
        ]
        const itemWidth = this.props.dimensions.width / 6
        const itemHeight = itemWidth * 3 / 4
        const margin = itemWidth / 6
        const maxBarWidth = (itemWidth * 4) + (margin * 3)

        // console.log(dataset.labels)
        return (<g className = "Nav"
            transform = { `translate(${dimensions.x}, ${dimensions.y})` }
            ref = { `nav_${zone}` }
        >
            { [0, 1, 2, 3, 4].map((option, i) => {
                return <rect key = { this.props.zone + '_thumb_' + i } width = { itemWidth } height = { itemHeight } y = { 60 - itemHeight } x = { (margin * (i + 1)) + (itemWidth * i) } fill = "#E0E0E0"></rect>
            }) }
            { options.map((option, i) => {
                const barWidth = maxBarWidth * option.total / options[0].total
                return <g key = { this.props.zone + '_summary_' + i }>
                    <rect width = { barWidth } height = { 12 } y = { 60 + margin + i * 16 } x = { margin + maxBarWidth - barWidth } fill = "#E0E0E0"></rect>
                    <text textAnchor = "end" x = { maxBarWidth + margin - 2 } fill = "#666666" y = { 60 + margin + 10 + i * 16 }>{ option.label }</text>
                    <text x = { maxBarWidth + margin * 2 } fill = "#333333" y = { 60 + margin + 10 + i * 16 }>{ option.total }</text>
                </g>
            }) }
        </g>)
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
        data: state.data
    }
}

function mapDispatchToProps (dispatch) {
    return {
    }
}

const NavConnect = connect(mapStateToProps, mapDispatchToProps)(Nav)

export default NavConnect
