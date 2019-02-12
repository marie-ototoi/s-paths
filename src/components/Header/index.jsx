import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import shallowEqual from 'shallowequal'

import { getConfigs, getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { getNbDisplayed } from '../../lib/dataLib'
import { makePivotConstraints, makeSelectionConstraints } from '../../lib/queryLib'
import { mergeSelections } from '../../lib/selectionLib'

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
                this.setState({
                    pivot: pivot.sort((a,b) => {
                        let aRank = a.prop === 'typeentrypoint' ? 0 : 1
                        let bRank = b.prop === 'typeentrypoint' ? 0 : 1
                        return aRank - bRank
                    })
                })
            })
            .catch(err => {
                console.log('error fetching Pivot', err)
                this.setState({pivot : []})
            })
    }
    shouldComponentUpdate (nextProps, nextState) {
        // console.log(nextProps)
        let configChanged = nextProps.configs.past.length !== this.props.configs.past.length &&
            this.props.configs.present.status !== 'transition'

        if (configChanged || this.props.step !== nextProps.step) {
            let newData = this.prepareData(nextProps)
           
            this.preparePivot(nextProps.configs, newData.displayedView, nextProps.dataset)
            this.setState(newData)
        }
        return true
    }
    prepareData (nextProps) {
        // TODO: remove data duplication
        
        //console.log(getConfigs(getCurrentConfigs(nextProps.configs, nextProps.zone, 'active'), nextProps.zone))
        let conf = getConfigs(getCurrentConfigs(nextProps.configs, nextProps.zone, 'active'), nextProps.zone)
        let configsLists = conf.map(view => view.propList)
        let displayedView = conf.reduce((acc, cur, i) => (cur.selected ? i : acc), null)
        let activeConfigs = getCurrentConfigs(nextProps.configs, 'main', 'active')
        //console.log("UPDATE", activeConfigs)
        let displayedResource = nextProps.dataset.resources.find((resource) =>
            resource.type === activeConfigs.entrypoint
        )
        let selectedResource = displayedResource
        // console.log(configsLists, displayedView, activeConfigs.views[displayedView])
        let displayedProps = configsLists[displayedView].map((list, index) => {
            //console.log(list, index)
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
            selectionSameconfigIsLoading: false,
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
        if (event.which === 13 &&
            !(this.state.selectionIsLoading ||
            this.state.propsAreLoading ||
            this.state.resourceIsLoading ||
            this.state.keywordIsLoading)) {
            if (selections.length > 0) {
                this.displaySelection()
            } else if (this.state.displayedView !== this.state.selectedView || !shallowEqual(this.state.displayedProps, this.state.selectedProps)) {
                this.displayConfig()
            } else if (this.state.keyword.length > 3) {
                this.displayKeyword()
            } else if (this.state.selectedResource.type !== this.state.displayedResource.type || dataset.constraints !== '') {
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
        let newSelections = pivot || config.entrypoint.aggregate ? mergeSelections(selections, activeConfigs.savedSelections) : [selections]
        if (pivot) {
            newResource = dataset.resources.find(res => res.type === pivot.type)
            if (selections.some(s => s.zone === 'main')) {
                selectedConfig = getSelectedMatch(config, zone)
                constraints = makeSelectionConstraints(newSelections, selectedConfig, 'main', dataset, false)
            } else if (selections.length > 0) {
                activeConfigs = getCurrentConfigs(configs, 'aside', 'active')
                // in case the entrypoint has changed
                let entrypoint = activeConfigs.entrypoint
                selectedConfig = getSelectedMatch(getSelectedView(activeConfigs, 'aside'))
                constraints = makeSelectionConstraints(newSelections, selectedConfig, 'aside', { ...dataset, entrypoint }, false)
            } else if (activeConfigs.savedSelections[0].length > 0) {
                selectedConfig = getSelectedMatch(config, zone)
                constraints = makeSelectionConstraints(newSelections, selectedConfig, 'main', dataset, false)
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
        }, views, activeConfigs, dataset, pivot ? newSelections : [])
            .then(() => this.setState({
                resourceIsLoading: false,
                pivotIsLoading: false,
                displayedResource: newResource
            }))
            .catch(() => {
                console.log('catch ici ')
                this.setState({
                    resourceIsLoading: false,
                    pivotIsLoading: false
                })
            })
    }
    displayPivot (pivot) {
        if (pivot.prop === 'typeentrypoint') {
            this.displayResource(pivot)
        } else {
            this.displaySelection(pivot)
        }
    }
    displayKeyword () {
        if (this.state.keyword.length > 3) {
            const { config, configs, dataset, selections, views, zone } = this.props
            let activeConfigs = getCurrentConfigs(configs, 'main', 'active')
            let constraints = dataset.constraints
            let entrypoint = dataset.entrypoint
            let selectedConfig = getSelectedMatch(config, zone)
            let newCondition = [{ query: { type: 'keyword', value: this.state.keyword } }]
            let newSelections = mergeSelections(newCondition, activeConfigs.savedSelections)
            let saveSelections = (config.entrypoint.aggregate ? [...activeConfigs.savedSelections, ...selections] : activeConfigs.savedSelections)
            // console.log(newSelections)
            constraints = makeSelectionConstraints(newSelections, selectedConfig, 'main', dataset, false)
            // console.log(constraints)
            // constraints = constraints.concat(makeKeywordConstraints(this.state.keyword, { ...dataset, entrypoint, stats: activeConfigs.stats }))
            let newDataset = {
                ...dataset,
                entrypoint,
                constraints,
                stats: activeConfigs.stats
            }
            // console.log(newDataset)
            this.setState({ keywordIsLoading: true, errorSelection: '' })
            this.props.selectResource(newDataset, views, activeConfigs, dataset, saveSelections)
                .then(() => this.setState({
                    keywordIsLoading: false,
                    keyword: ''
                }))
                .catch((e) => {
                    this.setState({
                        keywordIsLoading: false,
                        keyword: '',
                        errorSelection: 'Unable to display results: ' + e
                    })
                })
        }
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
            .catch((e) => this.setState({
                propsAreLoading: false,
                errorSelection: e
            }))
    }
    displaySelection (pivot = false, sameconfig = false) {
        
        let { config, configs, dataset, selections, views, zone } = {...this.props}
        console.log('DISPLAY SELECTION', selections)
        let activeConfigs = getCurrentConfigs(configs, 'main', 'active')
        console.log('DISPLAY SELECTION', activeConfigs)
        let selectedConfig
        let constraints = ``
        let formerentrypoint = dataset.entrypoint
        // console.log(!config.entrypoint.aggregate)
        let newSelections = !config.entrypoint.aggregate ? [selections] : mergeSelections(selections, activeConfigs.savedSelections)
        // let saveSelections = (pivot || config.entrypoint.aggregate ? newSelections : [])
        let entrypoint
        if (selections.some(s => s.zone === 'main')) {
            entrypoint = pivot ? pivot.type : dataset.entrypoint
            selectedConfig = getSelectedMatch(config, zone)
            constraints = makeSelectionConstraints(newSelections, selectedConfig, zone, { ...dataset, entrypoint }, pivot)
        } else if (selections.length > 0) {
            activeConfigs = getCurrentConfigs(configs, 'aside', 'active')
            // in case the entrypoint has changed
            entrypoint = pivot ? pivot.type : activeConfigs.entrypoint
            selectedConfig = getSelectedMatch(getSelectedView(activeConfigs, 'aside'))
            constraints = makeSelectionConstraints(newSelections, selectedConfig, 'aside', { ...dataset, entrypoint, stats: activeConfigs.stats }, pivot)
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
        //console.log(res, entrypoint)
        let newDataset = {
            ...dataset,
            entrypoint,
            constraints,
            totalInstances: res.total
        }
        this.setState({ selectionIsLoading: !sameconfig, selectionSameconfigIsLoading: sameconfig, errorSelection: '' })
        // console.log('DISPLAY SELECTION 2')
        // ici eventuellement on recupere celles qui etaient deja sauvees
        // console.log(activeConfigs.savedSelections, selections)
        //let saveSelections = (config.entrypoint.aggregate ? [...activeConfigs.savedSelections, ...selections] : activeConfigs.savedSelections)
        //console.log(saveSelections)
        this.props.selectResource(newDataset, views, activeConfigs, dataset, newSelections, sameconfig)
            .then(() => {
                // console.log('DISPLAY SELECTION 3')
                // this.forceUpdate()
                this.setState({
                    selectionIsLoading: false,
                    selectionSameconfigIsLoading: false,
                    keyword: ''
                })
            })
            .catch((e) => this.setState({
                selectionIsLoading: false,
                selectionSameconfigIsLoading: false,
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

            let pivotEnabled = this.state.pivot.length > 0
            // selection button
            let selectionEnabled = selections.length > 0

            // first line - resources
            let keywordEnabled = this.state.keyword.length > 3
            let selectResourceEnabled = ((this.state.selectedResource.type !== this.state.displayedResource.type || dataset.constraints !== '') && !(this.state.selectionIsLoading || this.state.propsAreLoading || this.state.resourceIsLoading || this.state.keywordIsLoading))
            let controlsDisabled =  this.props.step !== 'active'|| this.state.selectionIsLoading || this.state.propsAreLoading || this.state.resourceIsLoading || this.state.keywordIsLoading 
            let keycontrolsDisabled = controlsDisabled ? { disabled: true } : {}
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
                                isDisabled={controlsDisabled}
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
                                    {...keycontrolsDisabled}
                                    className='input is-small'
                                    type='text'
                                    placeholder='Keyword'
                                    value={this.state.keyword}
                                    onChange={(e) => this.setState({ keyword: e.target.value })}
                                    style={{ paddingTop: '10px', textAlign: 'left' }}
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
                        <span style={{position: 'absolute', right: '15px', cursor: 'pointer'}}>
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
                                    //console.log(activeConfigs)
                                    this.setState({
                                        selectedView,
                                        selectedProps: this.state.configsLists[selectedView].map((list, index) => {
                                            // console.log(list, index, activeConfigs)
                                            return list.reduce((acc, cur, propIndex) => {
                                                // console.log(activeConfigs.views[selectedView], index)
                                                if (activeConfigs.views[selectedView].selectedMatch.properties[index] && activeConfigs.views[selectedView].selectedMatch.properties[index].path === cur.path) acc = propIndex
                                                return acc
                                            }, 0)
                                        })
                                    })
                                }}
                                isDisabled={controlsDisabled}
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
                                            controlsDisabled ||
                                            (activeConfigs[this.state.selectedView] && activeConfigs[this.state.selectedView].constraints[index] && activeConfigs[this.state.selectedView].constraints[index][0].multiple !== undefined)
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
                    <div
                        className='error'
                        style={{
                            marginLeft: `${this.props.display.viz.horizontal_padding}px`
                        }}
                    >
                        {this.state.errorSelection}
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
                        onClick={(e) => this.displaySelection()}
                        type="standard"
                    />
                    <Selection
                        isLoading={this.state.selectionSameconfigIsLoading}
                        disable={!selectionEnabled}
                        onClick={(e) => this.displaySelection(false, true)}
                        type="sameconfig"
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
