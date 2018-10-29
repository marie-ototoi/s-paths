import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import shallowEqual from 'shallowequal'

import { getConfigs, getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { getNbDisplayed } from '../../lib/dataLib'
import { makeKeywordConstraints, makePivotConstraints, makeSelectionConstraints } from '../../lib/queryLib'

import { showSettings, showStats } from '../../actions/displayActions'
import { checkPivots, displayConfig, selectResource } from '../../actions/dataActions'
import Submit from './Submit'
import Quantifier from './Quantifier'
import ViewSelect from './ViewSelect'
import PropSelect from './PropSelect'
import ResourceSelect from './ResourceSelect'
import Explain from './Explain'
import Slider from './Slider'
import Selection from './Selection'
import Pivot from './Pivot'
import './Header.css'

class Header extends React.Component {
    constructor (props) {
        super(props)
        this.displayConfig = this.displayConfig.bind(this)
        this.displayKeyword = this.displayKeyword.bind(this)
        this.displayResource = this.displayResource.bind(this)
        this.displaySelection = this.displaySelection.bind(this)
        this.displayPivot = this.displayPivot.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.prepareData = this.prepareData.bind(this)
        this.preparePivot = this.preparePivot.bind(this)
        let initData = this.prepareData(props)
        this.state = {
            pivot: [],
            showConfig: (new URLSearchParams(window.location.search)).has('admin'),
            ...initData
        }
        this.preparePivot(props.configs, initData.displayedView, props.dataset)
    }
    componentDidUpdate () {
        //console.log('dd', this.props.step)
    }
    preparePivot(configs, displayedView, dataset) {
        let activeConfigs = getCurrentConfigs(configs, 'main', 'active')
        this.props.checkPivots(activeConfigs.views[displayedView].selectedMatch.properties, dataset)
            .then(res => {
                // console.log(res.results.bindings)
                let pivot = []
                res.results.bindings.forEach(piv => {
                    for (let p in piv) {
                        if (this.props.dataset.resources.find(r => r.type === piv[p].value).pathsNumber > 0 && piv[p].value !== dataset.entrypoint) {
                            let index = pivot.findIndex(pi => pi.type === piv[p].value)
                            let label = this.state.labelsDict[piv[p].value] ? this.state.labelsDict[piv[p].value].label : piv[p].value
                            let comment = this.state.labelsDict[piv[p].value] ? this.state.labelsDict[piv[p].value].comment : undefined
                            if (p === 'typeentrypoint') {
                                if (index > -1) {
                                    pivot[index] = {
                                        type: piv[p].value,
                                        prop:p,
                                        label,
                                        comment 
                                    }
                                } else {
                                    pivot.push({
                                        type: piv[p].value,
                                        prop:p,
                                        label,
                                        comment
                                    })
                                }
                            } else {
                                if (index == -1) {
                                    pivot.push({
                                        prop:p,
                                        propnb: p.substr(8, 1),
                                        internb: p.substr(14, 1),
                                        type: piv[p].value,
                                        label,
                                        comment
                                    })
                                }
                            }
                        }
                    }
                })
                //console.log(pivot)
                this.setState({pivot})
            })
            .catch(err => {
                console.log('error fetching Pivot', err)
                this.setState({pivot : {}})
            })
    }
    shouldComponentUpdate (nextProps, nextState) {
        let configChanged = nextProps.configs.past.length !== this.props.configs.past.length &&
            this.props.configs.present.status !== 'transition'

        if (configChanged || this.props.step !== nextProps.step) {
            let newData = this.prepareData(this.props)
           
            this.preparePivot(nextProps.configs, newData.displayedView, nextProps.dataset)
            this.setState(newData)
        }
        return true
    }
    prepareData (nextProps) {
        // TODO: remove data duplication
        let displayedResource = nextProps.dataset.resources.find((resource) =>
            resource.type === nextProps.dataset.entrypoint
        )
        let selectedResource = displayedResource
        //console.log(getConfigs(getCurrentConfigs(nextProps.configs, nextProps.zone, 'active'), nextProps.zone))
        let configsLists = getConfigs(getCurrentConfigs(nextProps.configs, nextProps.zone, 'active'), nextProps.zone).map(view => view.propList)
        let displayedView = getConfigs(getCurrentConfigs(nextProps.configs, nextProps.zone, 'active'), nextProps.zone).reduce((acc, cur, i) => (cur.selected ? i : acc), null)
        let activeConfigs = getCurrentConfigs(nextProps.configs, 'main', 'active')
        // console.log(configsLists, displayedView, activeConfigs.views[displayedView])
        let displayedProps = configsLists[displayedView].map((list, index) => {
            // console.log(list, index)
            return list.reduce((acc, cur, propIndex) => {
                // console.log(index)
                if (activeConfigs.views[displayedView].selectedMatch.properties[index].path === cur.path) acc = propIndex
                return acc
            }, 0)
        })
        let selectedProps = displayedProps
        let selectedView = displayedView
        // prepare pivot
        let labelsDict = {}
        nextProps.dataset.resources.forEach(res => {
            labelsDict[res.type] = { label: res.label, comment: res.comment }
        })
        return {
            resourceIsLoading: false,
            selectionIsLoading: false,
            keywordIsLoading: false,
            pivotIsLoading: false,
            errorSelection: '',
            propsAreLoading: false,
            keyword: '',
            displayedResource,
            selectedResource,
            labelsDict,
            resourceList: nextProps.dataset.resources.filter(res => res.pathsNumber > 0),
            configsLists,
            displayedView,
            displayedProps,
            selectedProps,
            selectedView
        }
    }
    handleKeyDown (event) {
        const { dataset, selections } = this.props
        // console.log('eee', event.which, event)
        if (event.which === 13) {
            if (selections.length > 0) {
                this.displaySelection()
            } else if (this.state.displayedView !== this.state.selectedView || !shallowEqual(this.state.displayedProps, this.state.selectedProps)) {
                this.displayConfig()
            } else if (this.state.keyword.length > 3) {
                this.displayKeyword()
            }else if (this.state.selectedResource.type !== this.state.displayedResource.type || dataset.constraints !== '') {
                this.displayResource()
            }
        }
    }    
    displayResource (pivot) {
        const { config, configs, dataset, selections, views, zone } = this.props
        let activeConfigs = getCurrentConfigs(configs, 'main', 'active')
        let newResource
        let selectedConfig 
        let constraints = ``
        if (pivot !== undefined) {
            newResource = dataset.resources.find(res => res.type === pivot.type)

            if (selections.some(s => s.zone === 'main')) {
                selectedConfig = getSelectedMatch(config, zone)
                constraints = makeSelectionConstraints(selections, selectedConfig, 'main', dataset, false)
            } else if (selections.length > 0) {
                activeConfigs = getCurrentConfigs(configs, 'aside', 'active')
                // in case the entrypoint has changed
                let entrypoint = activeConfigs.entrypoint
                selectedConfig = getSelectedMatch(getSelectedView(activeConfigs, 'aside'))
                constraints = makeSelectionConstraints(selections, selectedConfig, 'aside', { ...dataset, entrypoint }, false)
            }
            let pivotConstraints = makePivotConstraints('entrypoint', dataset.entrypoint, config, dataset)
            constraints = constraints.concat(pivotConstraints)
            //if (!constraints) constraints = `?entrypoint rdf:type <${dataset.entrypoint}> . `
            this.setState({ pivotIsLoading: true })
        } else {
            newResource = this.state.selectedResource
            this.setState({ resourceIsLoading: true, errorSelection: '' })
        }
        // console.log(pivot, newResource)
        this.props.selectResource({
            ...dataset,
            entrypoint: newResource.type,
            totalInstances: newResource.total,
            constraints
        }, views, activeConfigs, dataset)
            .then(() => this.setState({
                resourceIsLoading: false,
                pivotIsLoading: false,
                displayedResource: newResource
            }))
    }
    displayPivot (pivot) {
        if (pivot.prop === 'typeentrypoint') {
            this.displayResource(pivot)
        } else {
            this.displaySelection(pivot)
        }
    }
    displayKeyword () {
        const { configs, dataset, views } = this.props
        let activeConfigs
        let constraints = dataset.constraints
        let entrypoint = dataset.entrypoint
        if (this.state.keyword.length > 3) {
            if(!activeConfigs) activeConfigs = getCurrentConfigs(configs, 'main', 'active')
            constraints = constraints.concat(makeKeywordConstraints(this.state.keyword, { ...dataset, entrypoint, stats: activeConfigs.stats }))
        }
        let newDataset = {
            ...dataset,
            entrypoint,
            constraints,
            stats: activeConfigs.stats
        }
        // console.log(newDataset)
        this.setState({ keywordIsLoading: true, errorSelection: '' })
        this.props.selectResource(newDataset, views, activeConfigs, dataset)
            .then(() => this.setState({
                keywordIsLoading: false,
                keyword: ''
            }))
            .catch((e) => this.setState({
                keywordIsLoading: false,
                keyword: '',
                errorSelection: 'Unable to display results: ' + e
            }))
    }
    displayConfig () {
        // console.log('DISPLAY CONFIG 1')
        const { config, dataset, zone } = this.props
        let selectedLists = this.state.configsLists[this.state.selectedView]
        // let activeConfigs = getCurrentConfigs(configs, 'main', 'active')
        // console.log(this.state.selectedView, this.state.selectedProps)
        let selectedMatch = { properties: this.state.selectedProps && selectedLists ? this.state.selectedProps.map((prop, i) => selectedLists[i][prop]) : [] }
        this.setState({
            propsAreLoading: true,
            errorSelection: ''
        })
        // console.log(
        // console.log('DISPLAY CONFIG 2', selectedMatch)
        this.props.displayConfig(this.state.selectedView, selectedMatch, this.props.configs.present.views, config, dataset, zone)
            .then(() => {
                // console.log('DISPLAY CONFIG 3') 
                this.setState({
                    propsAreLoading: false,
                    displayedProps: this.state.selectedProps,
                    displayedView: this.state.selectedView
                })
            })
    }
    displaySelection (pivot) {
        // console.log('DISPLAY SELECTION')
        const { config, configs, dataset, selections, views, zone } = this.props
        let activeConfigs = getCurrentConfigs(configs, 'main', 'active')
        let selectedConfig
        let constraints = ``
        let formerentrypoint = dataset.entrypoint
        let entrypoint
        if (selections.some(s => s.zone === 'main')) {
            entrypoint = pivot !== undefined ? pivot.type : dataset.entrypoint
            selectedConfig = getSelectedMatch(config, zone)
            constraints = makeSelectionConstraints(selections, selectedConfig, zone, { ...dataset, entrypoint }, pivot !== undefined)
        } else if (selections.length > 0) {
            activeConfigs = getCurrentConfigs(configs, 'aside', 'active')
            // in case the entrypoint has changed
            entrypoint = pivot !== undefined ? pivot.type : activeConfigs.entrypoint
            selectedConfig = getSelectedMatch(getSelectedView(activeConfigs, 'aside'))
            constraints = makeSelectionConstraints(selections, selectedConfig, 'aside', { ...dataset, entrypoint, stats: activeConfigs.stats }, pivot !== undefined)
        } else if (pivot) {
            constraints = dataset.constraints.replace(/entrypoint/g, 'formerentrypoint')
        }
        if (pivot) {
            entrypoint = pivot.type
            let pivotConstraints = makePivotConstraints('formerentrypoint', dataset.entrypoint, config, dataset)
            // console.log(pivot, pivotConstraints)
            pivotConstraints = pivotConstraints.replace(new RegExp(`formerprop${pivot.propnb}inter${pivot.internb}`, 'g'), `entrypoint`)
            constraints = constraints.concat(pivotConstraints)
        }
        let res = dataset.resources.find(res => res.type === entrypoint)
        let newDataset = {
            ...dataset,
            entrypoint,
            constraints,
            totalInstances: res.total
        }
        this.setState({ selectionIsLoading: true, errorSelection: '' })
        // console.log('DISPLAY SELECTION 2')
        this.props.selectResource(newDataset, views, activeConfigs, dataset)
            .then(() => {
                // console.log('DISPLAY SELECTION 3')
                // this.forceUpdate()
                this.setState({
                    selectionIsLoading: false,
                    keyword: ''
                })
            })
            .catch((e) => this.setState({
                selectionIsLoading: false,
                keyword: '',
                errorSelection: 'Unable to display results: ' + e
            }))
    }
    render () {
        if (this.state.configsLists) {
            // console.log(this.state.configsLists)
            const { configs, data, dataset, selections, zone } = this.props
            // console.log(this.props.step)
            // general
            const activeConfigs = getConfigs(getCurrentConfigs(configs, zone, 'active'), zone)
            let options = [
                { label: 'entities', total: dataset.stats.totalInstances },
                { label: 'selected', total: dataset.stats.selectionInstances },
                { label: 'displayed', total: getNbDisplayed(data, zone, 'active') }
            ]

            let pivotEnabled = true
            // selection button
            let selectionEnabled = selections.length > 0
            let pointerClass = selectionEnabled ? '' : 'greyed'

            // first line - resources
            let keywordEnabled = this.state.keyword.length > 3
            let selectResourceEnabled = (this.state.selectedResource.type !== this.state.displayedResource.type || dataset.constraints !== '')
            // console.log(this.state.selectedResource.type, this.state.displayedResource.type, dataset.constraints)
            // second line - view + props
            let selectedLists = this.state.configsLists[this.state.selectedView]
            let configEnabled = (this.state.displayedView !== this.state.selectedView || !shallowEqual(this.state.displayedProps, this.state.selectedProps))
            return (
                <div className='Header' ref = {(c) => { this.refHeader = c }} tabIndex = {1}>
                    <div className="Line">
                        <div className='logo' style={{width: `${this.props.display.viz.horizontal_padding}px`}}>
                            <img
                                src='/images/logo.svg'
                                alt='S-Path Logo'
                                style={{ height: '29px' }}
                            />
                        </div>
                        <div
                            className='field'
                            style={{
                                width: `${this.props.display.viz.useful_width * 4 / 5}px`
                            }}
                        >
                            <label className='label'>TYPE OF ENTITIES</label>
                            <ResourceSelect
                                options={this.state.resourceList}
                                selectedResource={this.state.selectedResource}
                                onChange={(selectedResource) => {
                                    this.setState({ selectedResource })
                                }}
                                isDisabled={
                                    this.props.step !== 'active' || 
                                    this.state.selectionIsLoading ||
                                    this.state.propsAreLoading ||
                                    this.state.resourceIsLoading 
                                }
                            />
                            <Submit
                                isLoading={this.state.resourceIsLoading}
                                onClick={(e) => this.displayResource()}
                                disable={!selectResourceEnabled}
                            />
                            <div className='resource-control'>
                                {this.state.selectedResource.comment &&
                                    <span className='resource-def'>?
                                        <span
                                            className='resource-content'
                                            style={{ paddingTop: '5px', backgroundColor: '#ffffff' }}
                                        >
                                            {this.state.selectedResource.comment}
                                        </span>
                                    </span>
                                }
                                
                            </div>
                            <label className='label'>FILTER</label>
                            <div className='control'>
                                <input
                                    className='input is-small'
                                    type='text'
                                    placeholder='Keyword'
                                    value={this.state.keyword}
                                    onChange={(e) => this.setState({ keyword: e.target.value })}
                                    style={{ paddingTop: '10px' }}
                                />
                            </div>
                            
                            <Submit
                                isLoading={this.state.keywordIsLoading}
                                onClick={this.displayKeyword}
                                disable={!keywordEnabled}
                            />
                       
                        </div>
                        <Quantifier
                            value={options[1]}
                            max={options[0].total}
                        />
                        <span>
                            {this.state.showConfig && (
                                <span
                                    className='icon'
                                    onClick={(e) => { this.props.showStats() }}
                                >
                                    <i className='fas fa-wrench' />
                                </span>
                            )}                                
                            <span
                                className='icon'
                                onClick={(e) => { this.props.showSettings() }}
                            >
                                <i className='fas fa-cogs' />
                            </span>
                        </span>
                    </div>
                    
                    <div className="Line">
                        <Slider />
                        <div
                            className='field'
                            style={{
                                marginLeft: `${this.props.display.viz.horizontal_padding}px`,
                                width: `${this.props.display.viz.useful_width * 4 / 5}px`
                            }}
                        >
                            <label className='label'>DISPLAY</label>
                            <ViewSelect
                                currentValue={this.state.selectedView}
                                onChange={(selectedOption) => {
                                    const selectedView = selectedOption.index
                                    let activeConfigs = getCurrentConfigs(configs, 'main', 'active')
                                    this.setState({
                                        selectedView,
                                        selectedProps: this.state.configsLists[selectedView].map((list) => 0)
                                    })
                                }}
                                isDisabled={
                                    this.props.step !== 'active'|| 
                                    this.state.selectionIsLoading ||
                                    this.state.propsAreLoading ||
                                    this.state.resourceIsLoading ||
                                    this.state.keywordIsLoading 
                                }
                                options={activeConfigs.map((option, i) => ({ ...option, index: i }))}
                            />
                            { selectedLists && selectedLists.map((list, index) => (
                                <div
                                    className='control'
                                    key={`${zone}selectprop${index}`}
                                >
                                    <PropSelect
                                        currentValue={this.state.selectedProps[index]}
                                        onChange={(selectedOption) => {
                                            const selectedProps = [...this.state.selectedProps]
                                            selectedProps[index] = selectedLists[index].findIndex((option) =>
                                                option.path === selectedOption.path
                                            )
                                
                                            this.setState({ selectedProps })
                                        }}
                                        options={selectedLists[index]}
                                        isDisabled={
                                            this.props.step !== 'active'|| 
                                            this.state.selectionIsLoading ||
                                            this.state.propsAreLoading ||
                                            this.state.resourceIsLoading ||
                                            this.state.keywordIsLoading ||
                                            (activeConfigs[this.state.displayedView].constraints[index] && activeConfigs[this.state.displayedView].constraints[index][0].multiple !== undefined)
                                        }
                                    />
                                </div>
                            ))}
                            <Submit
                                isLoading={this.state.propsAreLoading}
                                onClick={this.displayConfig}
                                disable={!configEnabled}
                            />
                        </div>
                        <Quantifier
                            value={options[2]}
                            max={options[0].total}
                        />
                    </div>
                    
                    {this.props.step === 'active' &&
                        <Explain
                            options={options[2]}
                            zone={zone}
                        />
                    }
                    <Selection
                        isLoading={this.state.selectionIsLoading}
                        disable={!selectionEnabled}
                        onClick={this.displaySelection}
                    />
                    <Pivot
                        isLoading={this.state.pivotIsLoading}
                        disable={!pivotEnabled}
                        onClick={this.displayPivot}
                        elements={this.state.pivot}
                    />
                </div>
            )
        } else {
            return null
        }
    }

    static propTypes = {
        config: PropTypes.object,
        configs: PropTypes.object,
        data: PropTypes.object,
        dataset: PropTypes.object,
        display: PropTypes.object,
        selections: PropTypes.array,
        views: PropTypes.array,
        zone: PropTypes.string,
        step: PropTypes.string,
        checkPivots: PropTypes.func,
        displayConfig: PropTypes.func,
        selectResource: PropTypes.func,
        showSettings: PropTypes.func,
        showStats: PropTypes.func
    }
}

const HeaderConnect = connect(
    (state) => ({
        configs: state.configs,
        data: state.data,
        dataset: state.dataset,
        display: state.display,
        selections: state.selections,
        views: state.views
    }),
    (dispatch) => ({
        checkPivots: checkPivots(dispatch),
        displayConfig: displayConfig(dispatch),
        selectResource: selectResource(dispatch),
        showSettings: showSettings(dispatch),
        showStats: showStats(dispatch)
    }),
    null,
    { withRef: true }
)(Header)

export default HeaderConnect
