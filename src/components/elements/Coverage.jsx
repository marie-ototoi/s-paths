import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import ReactKeymaster from 'react-keymaster'

import { getCurrentConfigs, getSelectedConfig } from '../../lib/configLib'
import * as dataLib from '../../lib/dataLib'
import * as queryLib from '../../lib/queryLib'
import { getDimensions } from '../../lib/scaleLib'

import { loadData, loadDetail } from '../../actions/dataActions'

class Coverage extends React.Component {
    constructor (props) {
        super(props)
        this.detailSelection = this.detailSelection.bind(this)
        this.exploreSelection = this.exploreSelection.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }
    detailSelection () {
        const { config, configs, dataset, selections, zone } = this.props
        const activeConfigs = getCurrentConfigs(configs, 'active')
        if (selections.length > 0) {
            const selectedConfig = getSelectedConfig(config, zone)
            this.props.loadDetail({
                ...dataset,
                constraints: queryLib.makeSelectionConstraints(selections, selectedConfig, zone)
            }, activeConfigs, zone)
        }
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
    handleKeyDown (e) {
        const { data, selections, zone } = this.props
        if (e === 'enter' && selections.length > 0) {
            this.exploreSelection()
        } else if (e === 'ctrl+enter' && selections.length > 0  && dataLib.getNbDisplayed(data, zone, 'active') < 1000) {
            this.detailSelection()
        }
    }
    render () {
        const { data, dataset, display, selections, zone } = this.props
        // const activeConfigs = getCurrentConfigs(configs, 'active')
        const dimensions = getDimensions('coverage', display.zones[zone], display.viz, { x: 5, y: 5, width: -10, height: 0 })
        const { x, y, width } = dimensions
        let options = [
            { label: 'dataset', total: dataset.stats.totalInstances },
            { label: 'queried', total: dataset.stats.selectionInstances },
            { label: 'displayed', total:  dataLib.getNbDisplayed(data, zone, 'active') }/* ,
            { label: 'selected', total: selectedInstances } */
        ]
        // console.log('render', dataLib.getNbDisplayed(data, zone, 'active'))
        const itemWidth = width / 6
        // const itemHeight = itemWidth * 3 / 4
        const margin = itemWidth / 6
        // const maxBarWidth = (itemWidth * 3) + (margin * 2)

        let selectionDisabled = (selections.length > 0) ?  {} : { 'disabled' : 'disabled' }
        let detailClass = (dataLib.getNbDisplayed(data, zone, 'active') < 1000) ?  { 'className': 'button is-small is-info' } : { 'className': 'button is-info is-small is-invisible' }
        // console.log(configs)
        return (<g
            transform = { `translate(${x}, ${y})` }
            className = "Coverage"
            ref = { `coverage_${zone}` }
        >
            { ( (display.mode === 'main' && zone === 'main') || 
                (display.mode === 'aside' && zone === 'aside') ||
                ((display.mode === 'full' || display.mode === 'dev') && zone === 'main')) &&
                <g>
                    <ReactKeymaster
                        keyName = "enter"
                        onKeyDown = { this.handleKeyDown }
                    />
                    <ReactKeymaster
                        keyName = "ctrl+enter"
                        onKeyDown = { this.handleKeyDown }
                    />
                </g>
            }
            <foreignObject                 
                width = { width }
                height = { 500 }
            >
                <div className = "bars">
                    { options.map((option, i) => {
                        let percent = option.total / options[0].total
                        if (percent > 1) percent = 1
                        return (<div key = { `progress_${zone}_${i}` }>
                            <p className = "is-size-7">{ option.label } <span className = "is-pulled-right">{ option.total }</span></p>
                            <progress className = "progress is-small" value = { option.total } max = { options[0].total }>{ percent }%</progress>
                        </div>)
                    }) }
                </div>
                <div style = {{ paddingTop: '10px' }}>
                    <div style = {{ minWidth: '105px',minHeight: '45px', display: 'inline-block' }}>
                        <a
                            className = "button is-small is-info"
                            onMouseUp = { this.exploreSelection } 
                            {...selectionDisabled}
                        >Explore [⏎]</a>
                    </div>
                    <div style = {{ minWidth: '105px',minHeight: '45px', display: 'inline-block' }}>
                        <a
                            {...detailClass}
                            onMouseUp = { this.detailSelection }
                            {...selectionDisabled}
                        >Show detail [Ctrl+⏎]</a>
                    </div>
                </div>
            </foreignObject>
        </g>)
    }
}
Coverage.propTypes = {
    config: PropTypes.object,
    configs: PropTypes.object,
    data: PropTypes.object,
    dataset: PropTypes.object,
    display: PropTypes.object,
    displayedInstances: PropTypes.number,
    offset: PropTypes.number,
    selectedInstances: PropTypes.number,
    selections: PropTypes.array,
    views: PropTypes.array,
    zone: PropTypes.string,
    loadData: PropTypes.func,
    loadDetail: PropTypes.func,
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
        loadData: loadData(dispatch),
        loadDetail: loadDetail(dispatch)
    }
}

const CoverageConnect = connect(mapStateToProps, mapDispatchToProps)(Coverage)

export default CoverageConnect
