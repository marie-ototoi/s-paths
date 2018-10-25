import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import shallowEqual from 'shallowequal'

import { getConfigs, getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { getNbDisplayed } from '../../lib/dataLib'
import { makeKeywordConstraints, makeSelectionConstraints } from '../../lib/queryLib'

import { showSettings, showStats } from '../../actions/displayActions'
import { displayConfig, loadSelection, selectResource } from '../../actions/dataActions'
import Submit from './Submit'
import Quantifier from './Quantifier'
import ViewSelect from './ViewSelect'
import PropSelect from './PropSelect'
import ResourceSelect from './ResourceSelect'
import Explain from './Explain'
import Slider from './Slider'
import Selection from './Selection'
import './Header.css'
import display from '../../reducers/display';

class Header extends React.Component {
    constructor (props) {
        super(props)
        this.displayConfig = this.displayConfig.bind(this)
        this.displayKeyword = this.displayKeyword.bind(this)
        this.displayResource = this.displayResource.bind(this)
        this.displaySelection = this.displaySelection.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.prepareData = this.prepareData.bind(this)
        this.state = this.prepareData(props)
        this.state.showConfig = (new URLSearchParams(window.location.search)).has('admin')
    }
    getSnapshotBeforeUpdate (prevProps, prevState) {
        // console.log(prevProps)
        if (prevProps.which) return null
        let configChanged = prevProps.configs.past.length !== this.props.configs.past.length &&
            this.props.configs.present.status !== 'transition'

        if (configChanged || this.props.step !== prevProps.step) {
            let newData = this.prepareData(this.props)
            // console.log(newData)
            this.setState(newData)
            // return false
        }
        if (prevState.keyword === this.state.keyword && 
            prevProps.display.vizDefPercent.main_width === this.props.display.vizDefPercent.main_width) this.refHeader.focus() 
        return null
    }
    componentDidMount () {
        this.refHeader.focus()
    }
    componentDidUpdate () {
        
    }
    shouldComponentUpdate (nextProps, nextState) {
        let selectionChanged = this.props.selections.length !== nextProps.selections.length
        let dimensionsChanged = (this.props.display.viz.main_useful_height !== nextProps.display.viz.main_useful_height || 
            this.props.display.viz.main_width !== nextProps.display.viz.main_width)
        let configChanged = nextProps.configs.past.length !== this.props.configs.past.length &&
            this.props.configs.present.status !== 'transition'

        return configChanged || selectionChanged || dimensionsChanged ||
            this.state.selectedResource !== nextState.selectedResource || 
            this.state.displayedResource !== nextState.displayedResource || 
            this.state.displayedView !== nextState.displayedView || 
            this.state.selectedResource !== nextState.selectedResource ||
            this.state.keyword !== nextState.keyword ||
            this.props.dataset.constraints !== nextProps.dataset.constraints ||
            JSON.stringify(this.state) !== JSON.stringify(nextState) ||
            this.props.step !== nextProps.step
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
        return {
            resourceIsLoading: false,
            selectionIsLoading: false,
            keywordIsLoading: false,
            errorSelection: '',
            propsAreLoading: false,
            keyword: '',
            displayedResource,
            selectedResource,
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
    displayResource () {
        const { dataset, views } = this.props
        this.setState({ resourceIsLoading: true, errorSelection: '' })
        this.props.selectResource({
            ...dataset,
            entrypoint: this.state.selectedResource.type,
            totalInstances: this.state.selectedResource.total,
            constraints: ``
        }, views)
            .then(() => this.setState({
                resourceIsLoading: false,
                displayedResource: this.state.selectedResource
            }))
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
        this.props.loadSelection(newDataset, views, activeConfigs, dataset)
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
        const { config, dataset, zone } = this.props
        let selectedLists = this.state.configsLists[this.state.selectedView]
        // let activeConfigs = getCurrentConfigs(configs, 'main', 'active')
        // console.log(this.state.selectedView, this.state.selectedProps)
        let selectedMatch = { properties: this.state.selectedProps && selectedLists ? this.state.selectedProps.map((prop, i) => selectedLists[i][prop]) : [] }
        this.setState({
            propsAreLoading: true,
            errorSelection: ''
        })
        // console.log(selectedMatch)
        this.props.displayConfig(this.state.selectedView, selectedMatch, this.props.configs.present.views, config, dataset, zone)
            .then(() => this.setState({
                propsAreLoading: false,
                displayedProps: this.state.selectedProps,
                displayedView: this.state.selectedView
            }))
    }
    displaySelection () {
        const { config, configs, dataset, selections, views, zone } = this.props
        let activeConfigs
        let selectedConfig
        let constraints
        let entrypoint = dataset.entrypoint
        if (selections.some(s => s.zone === 'main')) {
            activeConfigs = getCurrentConfigs(configs, 'main', 'active')
            selectedConfig = getSelectedMatch(config, zone)
            constraints = makeSelectionConstraints(selections, selectedConfig, zone, dataset)
        } else if (selections.length > 0) {
            activeConfigs = getCurrentConfigs(configs, 'aside', 'active')
            // in case the entrypoint has changed
            entrypoint = activeConfigs.entrypoint
            selectedConfig = getSelectedMatch(getSelectedView(activeConfigs, 'aside'))
            constraints = makeSelectionConstraints(selections, selectedConfig, 'aside', { ...dataset, entrypoint, stats: activeConfigs.stats })
        } 
        let newDataset = {
            ...dataset,
            entrypoint,
            constraints,
            stats: activeConfigs.stats
        }
        this.setState({ selectionIsLoading: true, errorSelection: '' })
        this.props.loadSelection(newDataset, views, activeConfigs, dataset)
            .then(() => this.setState({
                selectionIsLoading: false,
                keyword: ''
            }))
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
                        <div className='logo'>
                            <img
                                src='/images/logo.svg'
                                alt='S-Path Logo'
                                style={{ height: '29px' }}
                            />
                        </div>
                        <div
                            className='field'
                            style={{
                                marginLeft: `${this.props.display.viz.horizontal_padding}px`,
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
                                onClick={this.displayResource}
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
        displayConfig: PropTypes.func,
        loadSelection: PropTypes.func,
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
        displayConfig: displayConfig(dispatch),
        loadSelection: loadSelection(dispatch),
        selectResource: selectResource(dispatch),
        showSettings: showSettings(dispatch),
        showStats: showStats(dispatch)
    }),
    null,
    { withRef: true }
)(Header)

export default HeaderConnect
