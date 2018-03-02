import React from 'react'
import { connect } from 'react-redux'

import PropSelector from '../elements/PropSelector'

import { getCurrentConfigs, getSelectedConfig } from '../../lib/configLib'
import { getPropList } from '../../lib/dataLib'
import queryLib from '../../lib/queryLib'
import { getDimensions } from '../../lib/scaleLib'

import { loadData, selectView } from '../../actions/dataActions'

class Nav extends React.PureComponent {
    render () {
        const { config, configs, dataset, displayedInstances, display, offset, selections, zone } = this.props
        const activeConfigs = getCurrentConfigs(configs, 'active')
        const dimensions = getDimensions('nav', display.zones[zone], display.viz, offset)
        const { x, y, width } = dimensions
        // console.log(dataset.stats)
        const itemWidth = width / 6
        const itemHeight = itemWidth * 3 / 4
        const margin = itemWidth / 6

        return (<g className = "Nav"
            transform = { `translate(${x}, ${y})` }
            ref = { `nav_${zone}` }
        >
            { activeConfigs.map((option, i) => {
                let selected = (config.id === option.id)
                return <g
                    key = { zone + '_thumb_' + i }
                    transform = { `translate(${(margin * (i)) + (itemWidth * i)}, ${50 - itemHeight})` }
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
            { config.constraints.map((prop, i) => {
                return <PropSelector
                    selected = { true }
                    key = { zone + '_propselector_' + i }
                    propList = { getPropList(config, zone, i, dataset.labels) }
                    config = { config }
                    dimensions = { { x: 0, y: 60 + (i * 25), width: width - 20, height: 50 } }
                    propIndex = { i }
                    zone = { zone }
                />
            }) }
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
