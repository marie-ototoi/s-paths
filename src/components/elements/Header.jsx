import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { getConfigs, getCurrentConfigs } from '../../lib/configLib'
import { getDimensions } from '../../lib/scaleLib'
import { getNbDisplayed } from '../../lib/dataLib'

import { selectResource } from '../../actions/dataActions'

class Header extends React.PureComponent {
    constructor (props) {
        super(props)
        this.displayResource = this.displayResource.bind(this)
        let displayedResource = props.dataset.resources[0]
        this.state = {
            resourceList: props.dataset.resources.map((resource) => {
                if (resource.selected) displayedResource = resource
                return {
                    total: resource.total,
                    readablePath: [{ label: resource.label, comment: resource.comment }],
                    path: resource.type, selected: resource.type === props.dataset.entrypoint
                }
            }),
            selectedResource: 0,
            displayedResource,
            isLoading: false
        }
    }
    displayResource () {
        const { dataset, views } = this.props
        let selectedResource = dataset.resources[this.state.selectedResource]
        this.props.selectResource({ ...dataset, entrypoint: selectedResource.type, totalInstances: selectedResource.total, constraints: `` }, views)
        this.setState({ isLoading: true })
    }
    render () {
        const { config, configs, data, dataset, display, selections, zone } = this.props
        const dimensions = getDimensions('header', display.zones[zone], display.viz, { x:0, y:0, width:0, height: 0 })
        const { x, y, width, height } = dimensions
        const fieldWidth = (display.viz.useful_width * 2 / 3) + display.viz.horizontal_margin
        const barWidth = (display.viz.useful_width / 3)
        const activeConfigs = getConfigs(getCurrentConfigs(configs, 'active'), zone)
        let options = [
            { label: 'entities', total: dataset.stats.totalInstances },
            { label: 'selected', total: dataset.stats.selectionInstances },
            { label: 'displayed', total: getNbDisplayed(data, zone, 'active') }
        ]
        options = options.map(option => {
            let percent = option.total / options[0].total
            if (percent > 1) percent = 1
            return {
                ...option,
                percent
            }
        })
        let selectResourceEnabled = (dataset.resources[this.state.selectedResource].type !== this.state.displayedResource.type) ?  {} : { 'disabled' : 'disabled' }
        let selectionEnabled = (selections.filter(s => s.zone === zone).length > 0) ?  {} : { 'disabled' : 'disabled' }
        // console.log(dataset.resources)
        // let selectionDisabled = (selections.filter(s => s.zone === zone).length > 0) ?  {} : { 'disabled' : 'disabled' }
        
        return (
            <g className = "Header">
                <foreignObject
                    transform = { `translate(${x}, ${y})` }
                    width = { width }
                    height = { height }
                >
                    <div>
                        <div className = "line">
                            <div className = "field" style = {{ width: fieldWidth + 'px' }}>
                                <label className = "label" style = {{ width: display.viz.horizontal_margin + 'px' }}>Set of resources</label>
                                <div className = "control">
                                    <div className = "select is-small">
                                        <select
                                            value = { this.state.selectedResource }
                                            onChange = { (e) => {
                                                this.setState({ selectedResource: e.target.value })
                                            } }
                                        >
                                            { this.state.resourceList.map((resource, i) => {
                                                return <option
                                                    key = { `${zone}_resource_${i}` }
                                                    value = { i }
                                                >{ resource.readablePath[0].label } ({ resource.total })</option>
                                            }) }
                                        </select>
                                    </div>
                                </div>
                                <div className = "submit">
                                    <button
                                        className = "button"
                                        onClick = { 
                                            (e) => {
                                                e.preventDefault()
                                                console.log('salut')
                                                if (selectResourceEnabled) this.displayResource()
                                            }
                                        }
                                        { ...selectResourceEnabled }
                                    >
                                        <span className = "icon">
                                            <i className = "fas fa-arrow-down fa-lg"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div style = {{ width: barWidth + 'px' }}>
                                <progress className = "progress is-small" value = { options[0].total } max = { options[0].total }>{ options[0].percent }%</progress>
                            </div>
                            <p className = "text-progress is-size-7">{ options[0].total } <span className = "is-pulled-right">&nbsp;{ options[0].label }</span></p>
                        </div>
                        <div className = "line">
                            <div className = "field" style = {{ width: fieldWidth + 'px' }}>
                                <label className = "label" style = {{ width: display.viz.horizontal_margin + 'px' }}>Selection</label>
                                <div className ="control">
                                    <input className ="input is-small" type="text" placeholder="Keyword" />
                                </div>
                                <div className ="control">
                                    <p>&amp;&amp;&nbsp;&nbsp;
                                        <span className = "pointer is-size-7">
                                            pointer
                                            <span className = "icon">
                                                <i className = "fas fa-mouse-pointer"></i>
                                            </span>
                                        </span>
                                        <span className = "icon">
                                            <i className = "fas fa-times fa-sm"></i>
                                        </span>
                                    </p>
                                </div>
                                <div className = "submit">
                                    <button className = "button">
                                        <span className = "icon">
                                            <i className = "fas fa-arrow-down fa-lg"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div style = {{ width: barWidth + 'px' }}>
                                <progress className = "progress is-small" value = { options[1].total } max = { options[0].total }>{ options[1].percent }%</progress>
                            </div>
                            <p className = "text-progress is-size-7">{ options[1].total } <span className = "is-pulled-right">&nbsp;{ options[1].label }</span></p>
                        </div>
                        <div className = "line">
                            <div className = "field" style = {{ width: fieldWidth + 'px' }}>
                                <label className = "label" style = {{ width: display.viz.horizontal_margin + 'px' }}>Display</label>
                                <div className="dropdown">
                                    <div className="dropdown-trigger">
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <img src = { config.thumb } height = { 50 } />
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div className = "dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            { activeConfigs.map((option, i) => {
                                                let selected = (config.id === option.id)
                                                return <div  key = { zone + 'activeNav' + i }><a href="#" className = "dropdown-item">
                                                    <img src = { option.thumb } width = { 30 } />
                                                </a>
                                                </div>
                                            }) }
                                        </div>
                                    </div>
                                </div>
                                <div className ="control">
                                    <div className ="select is-small">
                                        <select>
                                            <option>Award file</option>
                                            <option>...</option>
                                        </select>
                                    </div>
                                </div>
                                <div className ="control">
                                    <div className ="select is-small">
                                        <select>
                                            <option>Award file</option>
                                            <option>...</option>
                                        </select>
                                    </div>
                                </div>
                                <div className = "submit">
                                    <button className = "button">
                                        <span className = "icon">
                                            <i className = "fas fa-arrow-down fa-lg"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div style = {{ width: barWidth + 'px' }}>
                                <progress className = "progress is-small" value = { options[2].total } max = { options[0].total }>{ options[2].percent }%</progress>
                            </div>
                            <p className = "text-progress is-size-7">{ options[2].total } <span className = "is-pulled-right">&nbsp;{ options[2].label }</span></p>

                        </div>
                        <div className = "cache"></div>
                    </div>
                </foreignObject>
            </g>
        )
    }
}

Header.propTypes = {
    config: PropTypes.object,
    configs: PropTypes.object,
    data: PropTypes.object,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    selections: PropTypes.array,
    views: PropTypes.array,
    zone: PropTypes.string,
    selectResource: PropTypes.func,
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
        selectResource: selectResource(dispatch)
    }
}

const HeaderConnect = connect(mapStateToProps, mapDispatchToProps)(Header)

export default HeaderConnect
