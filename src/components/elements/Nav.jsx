import React from 'react'
import { connect } from 'react-redux'

import { getCurrentConfigs, getSelectedConfig } from '../../lib/configLib'
import queryLib from '../../lib/queryLib'
import { getDimensions } from '../../lib/scaleLib'

import { loadData, selectView } from '../../actions/dataActions'

class Nav extends React.PureComponent {
    constructor (props) {
        super(props)
        this.exploreSelection = this.exploreSelection.bind(this)
    }
    exploreSelection () {
        const { config, configs, dataset, selections, views, zone } = this.props
        const activeConfigs = getCurrentConfigs(configs, 'active')
        if (selections.length > 0) {
            const selectedConfig = getSelectedConfig(config, zone)
            let newConstraints = queryLib.makeSelectionConstraints(selections, selectedConfig, zone)
            let newDataset = {
                ...dataset,
                constraints: newConstraints
            }
            this.props.loadData(newDataset, views, activeConfigs, dataset)
        }
    }
    render () {
        const { config, configs, dataset, displayedInstances, display, offset, selections, zone } = this.props
        const activeConfigs = getCurrentConfigs(configs, 'active')
        const dimensions = getDimensions('nav', display.zones[zone], display.viz, offset)
        const { x, y, width } = dimensions
        // console.log(dataset.stats)
        let options = [
            { label: 'dataset', total: dataset.stats.totalInstances },
            { label: 'queried', total: dataset.stats.selectionInstances },
            { label: 'displayed', total: displayedInstances },
            { label: 'selected', total: selections.length }
        ]
        const itemWidth = width / 6
        const itemHeight = itemWidth * 3 / 4
        const margin = itemWidth / 6
        const maxBarWidth = (itemWidth * 3) + (margin * 2)

        // console.log(configs)
        return (<g className = "Nav"
            transform = { `translate(${x}, ${y})` }
            ref = { `nav_${zone}` }
        >
            { activeConfigs.map((option, i) => {
                let selected = (config.id === option.id)
                return <g
                    key = { zone + '_thumb_' + i }
                    transform = { `translate(${(margin * (i + 1)) + (itemWidth * i)}, ${60 - itemHeight})` }
                    onClick = { e => this.props.selectView(option.id, zone, activeConfigs, dataset) }
                >
                    <rect
                        width = { itemWidth }
                        height = { itemHeight }
                        fill = { selected ? '#333333' : '#E0E0E0' }>
                    </rect>
                    <text
                        y = "10"
                        x = "4"
                        fill = { selected ? '#E0E0E0' : '#333333' }
                    >{ option.id.substr(0, 1) }</text>
                </g>
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
        configs: state.configs,
        dataset: state.dataset.present,
        data: state.data,
        display: state.display,
        views: state.views
    }
}

function mapDispatchToProps (dispatch) {
    return {
        loadData: loadData(dispatch),
        selectView: selectView(dispatch)
    }
}

const NavConnect = connect(mapStateToProps, mapDispatchToProps)(Nav)

export default NavConnect
