import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import ReactKeymaster from 'react-keymaster'
import shallowEqual from 'shallowequal'

import { getConfigs, getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { getNbDisplayed } from '../../lib/dataLib'
import { makeKeywordConstraints, makeSelectionConstraints } from '../../lib/queryLib'

import { showSettings } from '../../actions/displayActions'
import { displayConfig, loadSelection, selectResource } from '../../actions/dataActions'
import ViewSelect from './ViewSelect'
import PropSelect from './PropSelect'
import ResourceSelect from './ResourceSelect'
import Slider from './Slider'
import Explain from './Explain'
import Line from './Line'
import './Header.css'

class Header extends React.Component {
    constructor (props) {
        super(props)
        this.displayConfig = this.displayConfig.bind(this)
        this.displayResource = this.displayResource.bind(this)
        this.displaySelection = this.displaySelection.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.prepareData = this.prepareData.bind(this)
        this.state = this.prepareData(props)
        this.state.showConfig = (new URLSearchParams(window.location.search)).has('admin')
    }
    getSnapshotBeforeUpdate (prevProps, prevState) {
        let configChanged = prevProps.configs.past.length !== this.props.configs.past.length &&
            this.props.configs.present.status !== 'transition'
      
        if (configChanged) {
            let newData = this.prepareData(this.props)
            // console.log(newData)
            this.setState(newData)
            // return false
        }
        return null            
    }
    prepareData (nextProps) {
        // TODO: remove data duplication
        let displayedResource = nextProps.dataset.resources.find((resource) =>
            resource.type === nextProps.dataset.entrypoint
        )
        let selectedResource = displayedResource
        let configsLists = getConfigs(getCurrentConfigs(nextProps.configs, nextProps.zone, 'active'), nextProps.zone).map(view => view.propList)

        let displayedView = getConfigs(getCurrentConfigs(nextProps.configs, nextProps.zone, 'active'), nextProps.zone).reduce((acc, cur, i) => (cur.selected ? i : acc), null)
        let displayedProps = configsLists[displayedView].map((list, index) => {
            return list.reduce((acc, cur, propIndex) => {
                if (nextProps.config.selectedMatch.properties[index] && cur.path === nextProps.config.selectedMatch.properties[index].path) {
                    acc = propIndex
                }
                return acc
            }, null)
        })
        
        let selectedProps = displayedProps
        let selectedView = displayedView
        // console.log(displayedView, selectedView, displayedProps, selectedProps, configsLists)
        return {
            resourceIsLoading: false,
            selectionIsLoading: false,
            errorSelection: '',
            propsAreLoading: false,
            keyword: '',
            displayedResource,
            selectedResource,
            resourceList: nextProps.dataset.resources,
            configsLists,
            displayedView,
            displayedProps,
            selectedProps,
            selectedView
        }
    }
    handleKeyDown (event) {
        const { dataset, selections } = this.props
        if (event === 'enter') {
            if (selections.length > 0 || this.state.keyword.length > 3) {
                this.displaySelection()
            } else if (this.state.displayedView !== this.state.selectedView || !shallowEqual(this.state.displayedProps, this.state.selectedProps)) {
                this.displayConfig()
            } else if (this.state.selectedResource.type !== this.state.displayedResource.type || dataset.constraints !== '') {
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
    displayConfig () {
        const { config, dataset, zone } = this.props
        let selectedLists = this.state.configsLists[this.state.selectedView]
        let selectedMatch = { properties: this.state.selectedProps && selectedLists ? this.state.selectedProps.map((prop, i) => selectedLists[i][prop]) : [] }
        this.setState({
            propsAreLoading: true,
            errorSelection: ''
        })
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
            const selectedConfig = getSelectedMatch(getSelectedView(activeConfigs, 'aside'))

            constraints = makeSelectionConstraints(selections, selectedConfig, 'aside', { ...dataset, entrypoint, stats: activeConfigs.stats })
        } else {
            // keep old constraints
            constraints = dataset.constraints
        }
        if (this.state.keyword.length > 3) {
            constraints = constraints.concat(makeKeywordConstraints(this.state.keyword, { ...dataset, entrypoint, stats: activeConfigs.stats }))
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
            .catch(() => this.setState({
                selectionIsLoading: false,
                keyword: '',
                errorSelection: 'No results matching selection'
            }))
    }
    componentWillUnmount () {
        this.handleKeyDown = null
    }
    render () {
        if (this.state.configsLists) {
            const { configs, data, dataset, selections, zone } = this.props

            // general
            const activeConfigs = getConfigs(getCurrentConfigs(configs, zone, 'active'), zone)
            let options = [
                { label: 'entities', total: dataset.stats.totalInstances },
                { label: 'selected', total: dataset.stats.selectionInstances },
                { label: 'displayed', total: getNbDisplayed(data, zone, 'active') }
            ]

            // first line - resources
            let selectResourceEnabled = (this.state.selectedResource.type !== this.state.displayedResource.type || dataset.constraints !== '')
            // console.log(selections.length)
            // second line - keyword + pointer
            let pointerEnabled = selections.length > 0
            let keywordEnabled = this.state.keyword.length > 3
            let pointerClass = pointerEnabled ? '' : 'greyed'
            let andClass = pointerEnabled && keywordEnabled ? '' : 'greyed'
            let selectionEnabled = (pointerEnabled || keywordEnabled)

            // third line - view + props
            let selectedLists = this.state.configsLists[this.state.selectedView]
            let configEnabled = (this.state.displayedView !== this.state.selectedView || !shallowEqual(this.state.displayedProps, this.state.selectedProps))
            return (
                <div className='Header'>
                    <ReactKeymaster
                        keyName='enter'
                        onKeyDown={this.handleKeyDown}
                    />
                    <Line
                        label={'Class of Entities'}
                        maxData={options[0].total}
                        counterData={options[0]}
                        isLoading={this.state.resourceIsLoading}
                        onSubmit={this.displayResource}
                        disable={!selectResourceEnabled}
                        leftChildren={
                            <div className='logo'>
                                <img
                                    src='/images/logo.svg'
                                    alt='S-Path Logo'
                                    style={{ height: '29px', paddingLeft: '5px' }}
                                />
                            </div>
                        }
                        rightChildren={
                            <div>
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
                                {this.state.showConfig && (
                                    <span
                                        className='icon'
                                        onClick={() => { this.props.showSettings(zone) }}
                                    >
                                        <i className='fas fa-cogs' />
                                    </span>
                                )}
                            </div>
                        }
                    >
                        <ResourceSelect
                            options={this.state.resourceList}
                            selectedResource={this.state.selectedResource}
                            onChange={(selectedResource) => {
                                this.setState({ selectedResource })
                            }}
                        />
                    </Line>
                    <Line
                        label={'Selection'}
                        isLoading={this.state.selectionIsLoading}
                        onSubmit={this.displaySelection}
                        disable={!selectionEnabled}
                        counterData={options[1]}
                        maxData={options[0].total}
                        rightChildren={
                            <span className='error'>{this.state.errorSelection}</span>
                        }
                    >
                        <div className='control'>
                            <input
                                className='input is-small'
                                type='text'
                                placeholder='Keyword'
                                value={this.state.keyword}
                                onChange={(e) => this.setState({ keyword: e.target.value })}
                            />
                        </div>
                        <div className='pointer-group'>
                            <p>
                                <span className={`label-like ${andClass}`}>AND</span>
                                &nbsp;&nbsp;
                                <span className={`pointer is-size-7 ${pointerClass}`}>
                                    pointer
                                    <span className='icon'>
                                        <i className='fas fa-mouse-pointer' />
                                    </span>
                                </span>
                            </p>
                        </div>
                    </Line>
                    <Line
                        label={'Display'}
                        isLoading={this.state.propsAreLoading}
                        onSubmit={this.displayConfig}
                        disable={!configEnabled}
                        counterData={options[2]}
                        maxData={options[0].total}
                        leftChildren={<Slider />}
                    >
                        <ViewSelect
                            currentValue={this.state.selectedView}
                            onChange={(selectedOption) => {
                                const selectedView = selectedOption.index
                                // console.log(this.state.configsLists[selectedView], selectedOption, selectedOption.selectedMatch.properties)
                                this.setState({
                                    selectedView,
                                    selectedProps: this.state.configsLists[selectedView].map((list, index) => 0)
                                })
                            }}
                            options={activeConfigs.map((option, i) => { return {...option, index: i} })}
                        />
                        { selectedLists && selectedLists.map((list, index) => (
                            <div
                                className='control'
                                key={`${zone}selectprop${index}`}
                            >
                                <PropSelect
                                    currentValue={this.state.selectedProps[index]}
                                    onChange={(selectedOption) => {
                                        let selectedProps = [...this.state.selectedProps]
                                        selectedProps[index] = selectedOption.index
                                        this.setState({ selectedProps })
                                    }}
                                    options={selectedLists[index].map((option, i) => { return {...option, index: i} })}
                                />
                            </div>
                        ))}
                    </Line>
                    <Explain
                        options={options[2]}
                        zone={zone}
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
        selections: PropTypes.array,
        views: PropTypes.array,
        zone: PropTypes.string,
        displayConfig: PropTypes.func,
        loadSelection: PropTypes.func,
        selectResource: PropTypes.func,
        showSettings: PropTypes.func
    }
}

const HeaderConnect = connect(
    (state) => ({
        configs: state.configs,
        data: state.data,
        dataset: state.dataset,
        selections: state.selections,
        views: state.views
    }),
    (dispatch) => ({
        displayConfig: displayConfig(dispatch),
        loadSelection: loadSelection(dispatch),
        selectResource: selectResource(dispatch),
        showSettings: showSettings(dispatch)
    })
)(Header)

export default HeaderConnect
