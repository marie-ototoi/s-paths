import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import ReactKeymaster from 'react-keymaster'

import { getCurrentConfigs, getSelectedMatch } from '../../lib/configLib'
import * as dataLib from '../../lib/dataLib'
import * as queryLib from '../../lib/queryLib'
import { getDimensions } from '../../lib/scaleLib'

import { loadSelection } from '../../actions/dataActions'

class Coverage extends React.Component {
    constructor (props) {
        super(props)
        this.exploreSelection = this.exploreSelection.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }
    exploreSelection () {
        const { config, configs, dataset, selections, views, zone } = this.props
        const activeConfigs = getCurrentConfigs(configs, 'active')
        if (selections.length > 0) {
            const selectedConfig = getSelectedMatch(config, zone)
            let newConstraints = queryLib.makeSelectionConstraints(selections, selectedConfig, zone)
            let newDataset = {
                ...dataset,
                constraints: newConstraints
            }
            this.props.loadSelection(newDataset, views, activeConfigs, dataset)
        }
    }
    handleKeyDown (e) {
        const { data, selections, zone } = this.props
        if (e === 'enter' && selections.length > 0) {
            this.exploreSelection()
        }
    }
    render () {
        const { data, dataset, display, selections, zone } = this.props
        // const activeConfigs = getCurrentConfigs(configs, 'active')
        const dimensions = getDimensions('coverage', display.zones[zone], display.viz, { x: 5, y: 5, width: -10, height: 0 })
        const { x, y, width } = dimensions
        let options = [
            { label: 'in dataset', total: dataset.stats.totalInstances },
            { label: 'queried', total: dataset.stats.selectionInstances },
            { label: 'displayed', total:  dataLib.getNbDisplayed(data, zone, 'active') }/* ,
            { label: 'selected', total: selectedInstances } */
        ]

        let selectionDisabled = (selections.filter(s => s.zone === zone).length > 0) ?  {} : { 'disabled' : 'disabled' }
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
                    <div style = {{ minWidth: '105px',minHeight: '30px', display: 'inline-block' }}>
                        <a
                            className = "button is-small is-info"
                            onMouseUp = { this.exploreSelection } 
                            {...selectionDisabled}
                        >Explore [⏎]</a>
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
    loadSelection: PropTypes.func,
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        dataset: state.dataset,
        data: state.data,
        display: state.display,
        selections: state.selections,
        views: state.views
    }
}

function mapDispatchToProps (dispatch) {
    return {
        loadSelection: loadSelection(dispatch)
    }
}

const CoverageConnect = connect(mapStateToProps, mapDispatchToProps)(Coverage)

export default CoverageConnect
