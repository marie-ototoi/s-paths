import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { getCurrentConfigs, getSelectedConfig } from '../../lib/configLib'
import queryLib from '../../lib/queryLib'
import { getDimensions } from '../../lib/scaleLib'

import { loadData } from '../../actions/dataActions'

class Coverage extends React.PureComponent {
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
        const { dataset, displayedInstances, display, offset, selectedInstances, zone } = this.props
        // const activeConfigs = getCurrentConfigs(configs, 'active')
        const dimensions = getDimensions('coverage', display.zones[zone], display.viz, offset)
        const { x, y, width } = dimensions
        // console.log(dataset.stats)
        let options = [
            { label: 'dataset', total: dataset.stats.totalInstances },
            { label: 'queried', total: dataset.stats.selectionInstances },
            { label: 'displayed', total: displayedInstances },
            { label: 'selected', total: selectedInstances }
        ]
        const itemWidth = width / 6
        // const itemHeight = itemWidth * 3 / 4
        const margin = itemWidth / 6
        const maxBarWidth = (itemWidth * 3) + (margin * 2)

        // console.log(configs)
        return (<g className = "Coverage"
            transform = { `translate(${x}, ${y})` }
            ref = { `coverage_${zone}` }
        >
            { options.map((option, i) => {
                const barWidth = maxBarWidth * option.total / options[0].total
                return <g key = { zone + '_summary_' + i }>
                    <rect width = { maxBarWidth } height = { 12 } y = { 15 + margin + i * 16 } x = { margin * 2 + itemWidth } fill = "#E0E0E0"></rect>
                    <rect width = { barWidth } height = { 6 } y = { 18 + margin + i * 16 } x = { margin * 2 + itemWidth } fill = "#666666"></rect>
                    <text x = { margin } fill = "#666666" y = { 15 + margin + 10 + i * 16 }>{ option.label }</text>
                    <text x = { maxBarWidth + margin * 3 + itemWidth } fill = "#666666" y = { 15 + margin + 10 + i * 16 }>{ option.total }</text>
                </g>
            }) }
            <text
                x = { 100 }
                y = { 100 }
                className = "button"
                onMouseUp = { this.exploreSelection }
            >Explore Selection</text>
        </g>)
    }
}
Coverage.propTypes = {
    config: PropTypes.object,
    configs: PropTypes.object,
    dataset: PropTypes.object,
    display: PropTypes.object,
    displayedInstances: PropTypes.number,
    offset: PropTypes.number,
    selectedInstances: PropTypes.number,
    selections: PropTypes.array,
    views: PropTypes.array,
    zone: PropTypes.string,
    loadData: PropTypes.func,
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        dataset: state.dataset,
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

const CoverageConnect = connect(mapStateToProps, mapDispatchToProps)(Coverage)

export default CoverageConnect
