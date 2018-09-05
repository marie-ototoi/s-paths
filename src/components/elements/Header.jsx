import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import ReactKeymaster from 'react-keymaster'
import shallowEqual from 'shallowequal'
import ReactSelect from 'react-select'
import pluralize from 'pluralize'

import { getConfigs, getCurrentConfigs, getPropsLists, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { getDimensions } from '../../lib/scaleLib'
import { getNbDisplayed, getReadablePathsParts } from '../../lib/dataLib'
import { getGraphsColors } from '../../lib/paletteLib'
import { makeKeywordConstraints, makeSelectionConstraints } from '../../lib/queryLib'

import { showSettings } from '../../actions/displayActions'
import { displayConfig, loadResources, loadSelection, loadStats, selectResource } from '../../actions/dataActions'

class Header extends React.PureComponent {
    constructor (props) {
        super(props)
        this.displayConfig = this.displayConfig.bind(this)
        this.displayResource = this.displayResource.bind(this)
        this.displaySelection = this.displaySelection.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        let displayedResource = 0
        this.state = {
            resourceList: props.dataset.resources.map((resource, i) => {
                if (resource.type === props.dataset.entrypoint) displayedResource = i
                return {
                    total: resource.total,
                    readablePath: [{ label: resource.label, comment: resource.comment }],
                    path: resource.type, selected: resource.type === props.dataset.entrypoint
                }
            }),
            displayedResource,
            selectedResource: displayedResource,
            resourceIsLoading: false,
            selectionIsLoading: false,
            errorSelection: '',
            propsAreLoading: false,
            keyword: '',
            isNavOpen: false,
            configsLists: getConfigs(getCurrentConfigs(props.configs, 'active'), props.zone).map(config => { 
                return getPropsLists(config, props.zone, props.dataset)
            }),
            displayedView: getConfigs(getCurrentConfigs(props.configs, 'active'), props.zone).reduce((acc, cur, i) => { return (cur.selected) ? i : acc }, null)
        }
        this.state.displayedProps = this.state.configsLists[this.state.displayedView].map(prop => prop.reduce((acc, cur, i) => { return (cur.selected) ? i : acc }, 0))
        this.state.selectedProps = this.state.displayedProps
        this.state.selectedView = this.state.displayedView
    }
    handleKeyDown (e) {
        const { dataset, selections, zone } = this.props
        // console.log(e, this, selections)
        if (e === 'enter') {
            if (dataset.constraints !== '' || this.state.selectedResource !== this.state.displayedResource) {
                this.displayResource()
            } else if (selections.filter(s => s.zone === zone).length > 0 || this.state.keyword.length > 3) {
                this.displaySelection()
            } else if (this.state.displayedView !== this.state.selectedView || !shallowEqual(this.state.displayedProps, this.state.selectedProps)) {
                this.displayConfig()
            }
        }
    }
    displayResource () {
        const { dataset, views } = this.props
        let selectedResource = dataset.resources[this.state.selectedResource]
        this.setState({ resourceIsLoading: true, errorSelection: '' })
        //console.log(selectedResource)
        this.props.selectResource({ ...dataset, resourceGraph: selectedResource.type, entrypoint: selectedResource.type, totalInstances: selectedResource.total, constraints: `` }, views)
            .then(res => this.setState({
                resourceIsLoading: false,
                displayedResource: this.state.selectedResource
            }))
    }
    displayConfig () {
        const { config, configs, dataset, zone } = this.props
        let selectedLists = this.state.configsLists[this.state.selectedView]
        const propPaths = this.state.selectedProps.map((prop, i) => selectedLists[i][prop].path)
        this.setState({ propsAreLoading: true, errorSelection: '' })
        this.props.displayConfig(this.state.selectedView, propPaths, getConfigs(getCurrentConfigs(configs, 'active'), zone), config, dataset, zone)
            .then(res => this.setState({
                propsAreLoading: false,
                displayedProps: this.state.selectedProps,
                displayedView: this.state.selectedView
            }))
    }
    displaySelection () {
        const { config, configs, dataset, selections, views, zone } = this.props
        const activeConfigs = getCurrentConfigs(configs, 'active')
        let newConstraints 
        if (selections.length > 0) {
            const selectedConfig = getSelectedMatch(config, zone)
            newConstraints = makeSelectionConstraints(selections, selectedConfig, zone, dataset)
        } else {
            // keep old constraints
            newConstraints = dataset.constraints
        }
        if (this.state.keyword.length > 3) {
            newConstraints = newConstraints.concat(makeKeywordConstraints(this.state.keyword, dataset))
        }
        let newDataset = {
            ...dataset,
            constraints: newConstraints
        }
        this.setState({ selectionIsLoading: true, errorSelection: '' })
        this.props.loadSelection(newDataset, views, activeConfigs, dataset)
            .then(res => this.setState({
                selectionIsLoading: false,
                keyword: ''
            }))
            .catch(res => this.setState({
                selectionIsLoading: false,
                keyword: '',
                errorSelection: 'No results matching selection' 
            }))
    }
    componentWillUnmount() {
        this.handleKeyDown = null
    }
    render () {

        const { config, configs, data, dataset, display, selections, zone } = this.props
        
        // general
        const dimensions = getDimensions('header', display.zones[zone], display.viz, { x:0, y:0, width:0, height: 0 })
        const { x, y, width, height } = dimensions
        const fieldWidth = (display.viz.useful_width * 2 / 3)
        const barWidth = (display.viz.useful_width / 3)
        const activeConfigs = getConfigs(getCurrentConfigs(configs, 'active'), zone)
        let selectedConfig = getSelectedView(getCurrentConfigs(configs, 'active'), zone)
        let selectedProperties = getSelectedMatch(selectedConfig).properties
        // console.log(selectedProperties)
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
        const colors = getGraphsColors()
        const graphs = {}
        selectedProperties[0].graphs.forEach((graph, gi) => {
            graphs[graph] = colors[gi]
        })

        //let 

        // first line - resources
        let selectResourceEnabled = (dataset.constraints !== '' || this.state.selectedResource !== this.state.displayedResource) ?  {} : { 'disabled' : 'disabled' }
        
        // second line - keyword + pointer
        let pointerEnabled = selections.filter(s => s.zone === zone).length > 0
        let keywordEnabled = this.state.keyword.length > 3
        let pointerClass = pointerEnabled ? '' : 'greyed' 
        let andClass = pointerEnabled && keywordEnabled ? '' : 'greyed' 
        let selectionEnabled = (pointerEnabled || keywordEnabled) ?  {} : { 'disabled' : 'disabled' }

        // third line - view + props
        let navClassName = this.state.isNavOpen ? 'dropdown is-active' : 'dropdown'
        let selectedLists = this.state.configsLists[this.state.selectedView]
        let configEnabled = (this.state.displayedView !== this.state.selectedView || !shallowEqual(this.state.displayedProps, this.state.selectedProps)) ? {} : { 'disabled' : 'disabled' }
        return (
            <g className = "Header">
                { ( (display.mode === 'main' && zone === 'main') || 
                (display.mode === 'aside' && zone === 'aside') ||
                ((display.mode === 'full' || display.mode === 'dev') && zone === 'main')) &&
                <ReactKeymaster
                    keyName = "enter"
                    onKeyDown = { this.handleKeyDown }
                />
                }
                <foreignObject
                    transform = { `translate(${x}, ${y})` }
                    width = { width }
                    height = { height }
                >
                    <div>
                        <div className = "line">
                            <div className = "logo" style = {{ width: display.viz.horizontal_margin + 'px' }}><img src = "/images/logo.svg" style = {{ height: '29px', paddingLeft:'5px' }} /></div>
                            <div className = "field" style = {{ width: fieldWidth + 'px' }}>
                                <label className = "label">Set of resources</label>
                                <div className = "control">
                                    <ReactSelect
                                        classNamePrefix = "propSelector"
                                        placeholder = {this.state.resourceList[this.state.selectedResource].readablePath[0].label}
            
                                        value = { this.state.resourceList[this.state.selectedResource].value }
                                        onChange = {(selectedOption) => {
                                            this.setState({ selectedResource: Number(selectedOption.value) })
                                        }}
                                        options = {this.state.resourceList.map((resource, i) => {
                                            return {
                                                label: `${resource.readablePath[0].label} (${resource.total})` ,
                                                value: i
                                            }
                                        })}
                                    />
                                </div>
                                <div className = "submit">
                                    { !this.state.resourceIsLoading &&
                                    <button
                                        className = "button"
                                        onClick = { this.displayResource }
                                        { ...selectResourceEnabled }
                                    >
                                        <span className = "icon">
                                            <i className = "fas fa-arrow-down fa-lg"></i>
                                        </span>
                                    </button>
                                    }
                                    { this.state.resourceIsLoading &&
                                        <span className = "button is-loading" ></span>
                                    }
                                </div>
                                { this.state.resourceList[this.state.selectedResource].readablePath[0].comment  && false &&
                                <span title= { this.state.resourceList[this.state.selectedResource].readablePath[0].comment } style = {{ paddingLeft: '35px', backgroundColor: '#ffffff' }}>?</span>
                                }
                                { this.state.resourceList[this.state.selectedResource].readablePath[0].comment  && 
                                <span className= "resource-def">? <span className = "resource-content" style = {{ paddingTop: '5px', backgroundColor: '#ffffff' }}>{ this.state.resourceList[this.state.selectedResource].readablePath[0].comment }</span></span>
                                }
                            </div>
                            <div style = {{ width: barWidth + 'px' }}>
                                <progress
                                    className = "progress is-small"
                                    value = { options[0].total }
                                    max = { options[0].total }
                                >{ options[0].percent }%</progress>
                            </div>
                            <p
                                className = "text-progress is-size-7"
                            >{ options[0].total } <span className = "is-pulled-right">&nbsp;{ options[0].label }</span>
                            </p>
                            <span className = "icon" onClick = { (e) => { this.props.showSettings(zone) } }>
                                <i className = "fas fa-cogs"></i>
                            </span>
                        </div>
                        <div className = "line">
                            <div className = "field" style = {{ marginLeft: display.viz.horizontal_margin + 'px', width: fieldWidth + 'px' }}>
                                <label
                                    className = "label"
                                >Selection
                                </label>
                                <div className ="control">
                                    <input
                                        className ="input is-small" 
                                        type="text" 
                                        placeholder="Keyword" 
                                        value = { this.state.keyword }
                                        onChange = { (e) => {
                                            this.setState({ keyword: e.target.value })
                                        } }
                                    />
                                </div>
                                <div className = "pointer-group">
                                    <p><span className = { 'label-like ' + andClass }>AND</span>&nbsp;&nbsp;
                                        <span className = { 'pointer is-size-7 ' + pointerClass }>
                                            pointer
                                            <span className = "icon">
                                                <i className = "fas fa-mouse-pointer"></i>
                                            </span>
                                        </span>
                                    </p>
                                </div>
                                <div className = "submit">
                                    { !this.state.selectionIsLoading &&
                                    <button
                                        className = "button"
                                        onClick = { this.displaySelection }
                                        { ...selectionEnabled }
                                    >
                                        <span className = "icon">
                                            <i className = "fas fa-arrow-down fa-lg"></i>
                                        </span>
                                    </button>
                                    }
                                    { this.state.selectionIsLoading &&
                                        <span className = "button is-loading" ></span>
                                    }
                                </div>
                                <span className= "error">{ this.state.errorSelection }</span>
                            </div>
                            <div style = {{ width: barWidth + 'px' }}>
                                <progress
                                    className = "progress is-small"
                                    value = { options[1].total }
                                    max = { options[0].total }
                                >{ options[1].percent }%
                                </progress>
                            </div>
                            <p
                                className = "text-progress is-size-7"
                            >{ options[1].total } <span className = "is-pulled-right">&nbsp;{ options[1].label }</span>
                            </p>        
                            
                        </div>
                        <div className = "line">
                            <div className = "field" style = {{ marginLeft: display.viz.horizontal_margin + 'px', width: fieldWidth + 'px' }}>
                                <label
                                    className = "label"
                                >Display
                                </label>
                                <div
                                    className = { navClassName }
                                >
                                    <div
                                        className="dropdown-trigger"
                                    >
                                        <button
                                            className = "button"
                                            aria-haspopup = "true"
                                            aria-controls = "dropdown-menu-nav"
                                            onClick = { (e) => this.setState({ isNavOpen: !this.state.isNavOpen }) }
                                        >
                                            <img src = { config.thumb } height = { 20 } />
                                            <span className="icon is-small">
                                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div
                                        className = "dropdown-menu"
                                        id="dropdown-menu-nav"
                                        role="menu"
                                    >
                                        <div
                                            className = "dropdown-content"
                                        >
                                            { activeConfigs.map((option, i) => {
                                                let classOption = (config.id === option.id) ? 'selected' : ''
                                                return <div
                                                    key = { zone + 'activeNav' + i }
                                                    className = { classOption }
                                                >
                                                    <a
                                                        className = "dropdown-item"
                                                        onClick = { (e) => { this.setState({
                                                            selectedView: i,
                                                            selectedProps: getConfigs(getCurrentConfigs(configs, 'active'), zone)[i].constraints.map(c => 0),
                                                            isNavOpen: false }) }
                                                        }
                                                    >
                                                        <img src = { option.thumb } width = { 30 } /><span>{ option.name }</span>
                                                    </a>
                                                </div>
                                            }) }
                                        </div>
                                    </div>
                                </div>

                                { selectedLists.map((list, index) => {
                                    return (<div className ="control is-small" key = { `${zone}selectprop${index}` }>
                                        
                                        <ReactSelect
                                            placeholder = {list[this.state.selectedProps[index]].readablePath.map(p => p.label).join(' / ')}
                                            classNamePrefix = "propSelector"
                                            value = { list[this.state.selectedProps[index]].value }
                                            onChange = {(selectedOption) => {
                                                let newProps = [...this.state.selectedProps]
                                                newProps[index] = Number(selectedOption.value)
                                                this.setState({ selectedProps: newProps })
                                            }}
                                            options = {list.map((elt, indexElt) => {
                                                return { value: indexElt, label: '/ ' + elt.readablePath.map(p => p.label).join(' / * / ') + ' / * /' }
                                            })}
                                        />
                                    </div>) 
                                }) }
                                <div className = "submit">
                                    { !this.state.propsAreLoading &&
                                    <button
                                        className = "button"
                                        onClick = { this.displayConfig }
                                        { ...configEnabled }
                                    >
                                        <span className = "icon">
                                            <i className = "fas fa-arrow-down fa-lg"></i>
                                        </span>
                                    </button>
                                    }
                                    { this.state.propsAreLoading &&
                                        <span className = "button is-loading" ></span>
                                    }
                                </div>
                            </div>
                            <div style = {{ width: barWidth + 'px' }}>
                                <progress
                                    className = "progress is-small"
                                    value = { options[2].total }
                                    max = { options[0].total }
                                >{ options[2].percent }%
                                </progress>
                            </div>
                            <p
                                className = "text-progress is-size-7"
                            >{ options[2].total } <span className = "is-pulled-right">&nbsp;{ options[2].label }</span>
                            </p>
                        </div>
                        <div className = "cache"></div>
                        <div 
                            className = "explain" 
                            style = {{
                                marginTop: Math.floor((display.viz.top_margin - 145)/2) + 'px',
                                marginLeft: display.viz.horizontal_margin + 'px'
                            }} >
                            <p>You are currently visualizing <strong>{ options[2].total } { pluralize('entity', options[2].total) } </strong>  
                            belonging to the class of ressources <strong>{ this.state.resourceList[this.state.displayedResource].readablePath[0].label } </strong> 
                            according to <strong>{ config.constraints.length } property { pluralize('path', config.constraints.length) } </strong> 
                            traversing <strong>2 graphs</strong></p><span className = "resource-def">?
                                <div className = "resource-content" style = {{ margin: '-55px 0 0 0' + 'px' }}>
                                    <ul><span>Graphs: </span>  
                                        { selectedProperties[0].graphs.map((graph, gi) => {
                                            return (<li style = {{ color: graphs[graph] }} key = {`graph_${zone}_${gi}`}>{graph}</li>)
                                        }) }
                                    </ul>
                                    { selectedProperties.map((prop, pi) => {
                                        let readablePath = getReadablePathsParts(prop.path, dataset.labels, dataset.prefixes)
                                        return (<div className = "path"  key = {`path_${zone}_${pi}`}>Path {(pi + 1)}: <span style = {{ borderBottom: `1px solid ${graphs[prop.triplesGraphs[0]]}` }}>{this.state.resourceList[this.state.displayedResource].readablePath[0].label} / </span> { readablePath.map((rp, rpi) => {
                                            return (<span 
                                                className = "triple"
                                                style = {{ 
                                                    borderBottom: `1px solid ${graphs[prop.triplesGraphs[rpi]]}`, 
                                                    paddingLeft: (5 + (rpi * 20)) + 'px',
                                                    paddingBottom: (rpi * 3) + 'px',
                                                    position: 'relative', 
                                                    left: '-' + (5 + (rpi * 20)) + 'px' 
                                                }} 
                                                key = {`path_${zone}_${pi}_triple_${rpi}`}><span className = "pathlabel" title={ rp.comment }>{ rp.label }</span> / * /</span>)
                                        }) }</div>)
                                    }) }
                                </div>
                            </span>
                        </div>
                        
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
    analyseEndpoint: PropTypes.func,
    displayConfig: PropTypes.func,
    loadResources: PropTypes.func,
    loadSelection: PropTypes.func,
    loadStats: PropTypes.func,
    selectResource: PropTypes.func,
    showSettings: PropTypes.func,
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        data:state.data,
        dataset: state.dataset,
        display: state.display,
        selections: state.selections,
        views: state.views
    }
}

function mapDispatchToProps (dispatch) {
    return {
        displayConfig: displayConfig(dispatch),
        loadResources: loadResources(dispatch),
        loadStats: loadStats(dispatch),
        loadSelection: loadSelection(dispatch),
        selectResource: selectResource(dispatch),
        showSettings: showSettings(dispatch)
    }
}

const HeaderConnect = connect(mapStateToProps, mapDispatchToProps)(Header)

export default HeaderConnect
