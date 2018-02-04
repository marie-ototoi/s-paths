import React from 'react'
import { connect } from 'react-redux'

import configLib from '../../lib/configLib'
import queryLib from '../../lib/queryLib'
import { getDimensions } from '../../lib/scaleLib'

import { loadData } from '../../actions/dataActions'

class Nav extends React.PureComponent {
    constructor (props) {
        super(props)
        this.exploreSelection = this.exploreSelection.bind(this)
    }
    exploreSelection () {
        if (this.props.selections.length > 0) {
            const selectedConfig = configLib.getSelectedConfig(this.props.config, this.props.zone)
            let newConstraints = queryLib.makeSelectionConstraints(this.props.selections, selectedConfig, this.props.zone)
            let newDataset = {
                ...this.props.dataset,
                constraints: newConstraints
            }
            this.props.loadData(newDataset, this.props.views, this.props.configs, this.props.dataset)
        }
    }
    render () {
        const { dataset, displayedInstances, display, offset, selections, zone } = this.props
        const dimensions = getDimensions('nav', display.zones[zone], display.viz, offset)
        const { x, y, width } = dimensions
        // console.log(dataset.stats)
        let options = [
            { label: 'endpoint', total: dataset.stats.totalInstances },
            { label: 'query', total: dataset.stats.selectionInstances },
            { label: 'displayed', total: displayedInstances },
            { label: 'selected', total: selections.length }
        ]
        const itemWidth = width / 6
        const itemHeight = itemWidth * 3 / 4
        const margin = itemWidth / 6
        const maxBarWidth = (itemWidth * 3) + (margin * 2)

        // console.log(dataset.labels)
        return (<g className = "Nav"
            transform = { `translate(${x}, ${y})` }
            ref = { `nav_${zone}` }
        >
            { [0, 1, 2, 3, 4].map((option, i) => {
                return <rect key = { zone + '_thumb_' + i } width = { itemWidth } height = { itemHeight } y = { 60 - itemHeight } x = { (margin * (i + 1)) + (itemWidth * i) } fill = "#E0E0E0"></rect>
            }) }
            { options.map((option, i) => {
                const barWidth = maxBarWidth * option.total / options[0].total
                return <g key = { zone + '_summary_' + i }>
                    <rect width = { maxBarWidth } height = { 12 } y = { 60 + margin + i * 16 } x = { margin * 2 + itemWidth } fill = "#E0E0E0"></rect>
                    <rect width = { barWidth } height = { 6 } y = { 63 + margin + i * 16 } x = { margin * 2 + itemWidth } fill = "#666666"></rect>
                    <text x = { margin } fill = "#666666" y = { 60 + margin + 10 + i * 16 }>{ option.label }</text>
                    <text x = { maxBarWidth + margin * 3 + itemWidth } fill = "#666666" y = { 60 + margin + 10 + i * 16 }>{ option.total }</text>
                </g>
            }) }
            <text
                y = { 200 }
                className = "button"
                onMouseUp = { this.exploreSelection }
            >Explore Selection</text>
        </g>)
    }
}

function mapStateToProps (state) {
    return {
        configs: state.configs.present,
        dataset: state.dataset.present,
        data: state.data,
        display: state.display,
        views: state.views
    }
}

function mapDispatchToProps (dispatch) {
    return {
        loadData: loadData(dispatch)
    }
}

const NavConnect = connect(mapStateToProps, mapDispatchToProps)(Nav)

export default NavConnect
