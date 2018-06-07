import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import PropSelector from '../elements/PropSelector'

import { getConfigs, getCurrentConfigs } from '../../lib/configLib'
import { getDimensions } from '../../lib/scaleLib'

import { loadData, selectView } from '../../actions/dataActions'

class Nav extends React.PureComponent {
    render () {
        const { config, configs, dataset, display, offset, zone } = this.props
        // console.log(propsLists)
        const activeConfigs = getConfigs(getCurrentConfigs(configs, 'active'), zone)
        const dimensions = getDimensions('nav', display.zones[zone], display.viz, { x:0, y:10, width: 0, height: 0 })
        const { x, y, width, height } = dimensions
        // console.log(activeConfigs)
        const itemWidth = width / 6

        return (<g className = "Nav"
            transform = { `translate(${x}, ${y})` }
            ref = { `nav_${zone}` }
        >
            <foreignObject                 
                width = { width }
                height = { height }
            >
           
                { activeConfigs.map((option, i) => {
                    let selected = (config.id === option.id)
                    
                    return <span
                        key = { zone + '_thumb_' + i }
                        style = {{ minWidth: '65px',minHeight: '45px', display: 'inline-block' }}
                        
                    >
                        <a
                            className = { selected ? "button is-info is-active" : "button is-light has-background-grey-light is-active" }
                            onClick = { e => this.props.selectView(option.id, zone, activeConfigs, dataset) }
                        >
                            <img width="30" src = { option.thumb } />
                        </a>
                    </span>
                }) }
            </foreignObject>            
            { config.constraints.map((prop, i) => {
                return <PropSelector
                    selected = { true }
                    key = { zone + '_propselector_' + i }
                    propList = { this.props.propsLists[i] }
                    config = { config }
                    dimensions = { { x: 0, y: 60 + (i * 25), width: width - 20, height: 50 } }
                    propIndex = { i }
                    zone = { zone }
                />
            }) }
        </g>)
    }
}

Nav.propTypes = {
    config: PropTypes.object,
    configs: PropTypes.object,
    dataset: PropTypes.object,
    display: PropTypes.object,
    offset: PropTypes.object,
    propsLists: PropTypes.array,
    zone: PropTypes.string,
    selectView: PropTypes.func,
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
        selectView: selectView(dispatch)
    }
}

const NavConnect = connect(mapStateToProps, mapDispatchToProps)(Nav)

export default NavConnect
