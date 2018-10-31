import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Vega from 'react-vega'
import * as vega from 'vega-lib'
// components
// d3
// libs
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements, resetSelection } from '../../actions/selectionActions'
import { loadMultiple } from '../../actions/dataActions'

import { getCurrentConfigs, getTimelineDict, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { usePrefix } from '../../lib/queryLib'
import * as dataLib from '../../lib/dataLib'
import defaultSpec from '../../lib/spec'
// redux functions

class Timeline extends React.Component {
    constructor (props) {
        super(props)
        this.fetchMultiple = this.fetchMultiple.bind(this)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleNewView = this.handleNewView.bind(this)
        this.handleZoneSelected = this.handleZoneSelected.bind(this)
        this.initData = this.initData.bind(this)
        this.prepareData = this.prepareData.bind(this)
        this.updateSelections = this.updateSelections.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refTimelineMap_${props.zone}`,
            multipleLoaded: [],
            multipleLoading: [],
            data: [],
            multipleData: {},
            shouldRender: false
        }
        this.state = {}
        this.initData(props)
        this.prepareData(props)
    }
    updateSelections (nextProps) {
        let { selections, zone } = nextProps
        // console.log("FOIS FOIS")
        if (this.customState.view) {
            let changeset = vega.changeset().remove(() => true).insert(selections.filter(s => s.zone === zone).map(s => { return { selector: s.selector, entrypoint: s.other } })) 
            this.customState.view.change('selections', changeset).run()
        }
    }
    handleSelect(...args) {
        const { display, selections, selectElements, zone } = this.props
        if (args[1]) {
            // console.log('yes we can', args, this.customState.view.scenegraph().root.items[0].items[5].items.filter(it =>it.selected))
            let selected = this.customState.view.scenegraph().root.items[0].items[5].items.filter(it =>it.selected)
            // console.log('salut', selected)
            selected = selected.map(el => {
                return {
                    selector: el.datum.selector,
                    index: el.datum.index,
                    query: {
                        type: 'uri',
                        value: el.datum.entrypoint
                    },
                    other: el.datum.entrypoint
                }
            })
            selectElements(selected, zone, selections, display.modifierPressed)
          
        }
    }
    fetchMultiple() {
        const { configs, dataset, role, zone } = this.props
        // console.log('oua', getSelectedView(getCurrentConfigs(configs, zone, 'active')))
        const selectedConfig = getSelectedView(getCurrentConfigs(configs, zone))
        // console.log('bah quoi', selectedConfig, configs)
        if (role !== 'target') {
            // console.log(selectedConfig.multiple[0].length)
            for(let mi = 0; mi <selectedConfig.multiple[0].length; mi++) {
                let m = selectedConfig.multiple[0][mi]
                if (! (this.customState.multipleLoaded.includes(mi) || this.customState.multipleLoading.includes(mi))) {
                    // console.log('fetchMultiple', mi)
                    this.customState.multipleLoading.push(mi)
                    this.props.loadMultiple(dataset, m.path, 0, mi, zone)
                        .then(results => {
                            // update multipleLoaded && multipleLoading
                            this.customState.multipleLoaded.push(mi)
                            this.customState.multipleLoading = this.customState.multipleLoading.filter(i => i !== mi)
                            // add Data
                            results.results.bindings.forEach((dp, dpi) => {
                            //    this.customState.multipleData[dp.entrypoint.value] = d
                                let key = dp.entrypoint.value
                                if (!this.customState.multipleData[key]) {
                                    this.customState.multipleData[key] = { events: [] }
                                }
                                let theProp = results.head.vars[1]
                                let theIndex = Number(theProp.replace('multiple', ''))
                                let theDate = new Date(dp[theProp].value).getTime()
                                let sameDate = this.customState.multipleData[key].events.filter(e => e.date === theDate).length
                                let offset = (sameDate % 2 === 0) ? -2 * sameDate :  2 * sameDate
                                this.customState.multipleData[key].events.push({
                                    date: theDate,
                                    indexEvent: sameDate + 1,
                                    offset,
                                    zIndex: 100 - offset, 
                                    label: selectedConfig.multiple[0][theIndex].readablePath.map(p => p.label).join(' / * / ')
                                })
                            })
                            // console.log('multipleData', this.customState.multipleData)
                            // load next index
                            this.fetchMultiple()
                            this.prepareData(this.props)
                            this.customState.shouldRender = true
                            this.render()
                        })
                    break;
                }
            }
        }
    }
    handleNewView(args) {
        this.fetchMultiple()
        // console.log('salut')
        this.customState = {...this.customState, view: args}
        window.setTimeout(() => this.props.handleTransition(this.props, this.getElementsForTransition()), 500)
    }
    handleZoneSelected(args) {
        // console.log('coucou')
    }
    render () {
        const { dimensions, role, step } = this.props
        // console.log(this.props.selections, this.customState.view.scenegraph())
        return (<div
            className = { `Timeline ${this.customState.elementName} role_${role}` } >
            { step !== 'changing' &&
            <div
                style = {{ 
                    position: 'relative',
                    left : `${dimensions.x}px`,
                    top: `${dimensions.y + dimensions.top_padding}px`,
                    width: `${dimensions.useful_width}px`,
                    height: `${dimensions.useful_height}px`
                }}
                
            >
                { this.customState.spec &&
                    <Vega
                        spec = { this.customState.spec }
                        onSignalEndZone = { this.handleSelect }
                        onSignalZoneSelected  = { this.handleZoneSelected }
                        onNewView = { this.handleNewView }
                    />
                }
            </div>
            }
        </div>)
    }
    getElementsForTransition () {
        // console.log(this.customState.view.scenegraph().root.source.value[0].items[5].items[0].opacity)
        let items = []
        if(this.customState.view.scenegraph().root.source.value[0] && this.customState.view.scenegraph().root.source.value[0].items[5].items[0].opacity) {
            items = this.customState.view.scenegraph().root.source.value[0].items[5].items.map(el => {
                return { 
                    zone: {
                        x1: el.bounds.x1,
                        y1: el.bounds.y1,
                        x2: el.bounds.x2,
                        y2: el.bounds.y2,
                        width: Math.abs(el.bounds.x2 - el.bounds.x1),
                        height: Math.abs(el.bounds.y2 - el.bounds.y1)
                    },
                    selector: el.datum.selector,
                    index: el.datum.index,
                    query: {
                        type: 'uri',
                        value: el.datum.entrypoint
                    },
                    color: el.stroke,
                    opacity: el.opacity,
                    shape: 'rectangle',
                    rotation: 0,
                    other: el.datum.entrypoint
                }
            })
        }
        // console.log(items)
        return items
    }
    shouldComponentUpdate (nextProps, nextState) {
        let dataChanged = (this.props.data.length !== nextProps.data.length ||
            (this.props.data[0] && nextProps.data[0] && this.props.data[0].prop2.value !== nextProps.data[0].prop2.value))
        let selectionChanged = this.props.selections.length !== nextProps.selections.length
        let dimensionsChanged = (this.props.dimensions.width !== nextProps.dimensions.width || this.props.dimensions.height !== nextProps.dimensions.height)
        if (dataChanged) {
            this.initData(nextProps)
            this.fetchMultiple()
            this.prepareData(nextProps)
            //console.log('PREPARE DATA', this.props.data.length, nextProps.data.length)
        }
        if (selectionChanged && !dataChanged) {
            // console.log('HAS CHANGED')
            this.updateSelections(nextProps)
        }
        if (dimensionsChanged) {
            this.customState.view.signal('width', nextProps.dimensions.useful_width).run()
            this.customState.view.signal('height', nextProps.dimensions.useful_height).run()
        }        
        if (selectionChanged) {
            if (nextProps.selections.some(s => s.zone !== nextProps.zone)) {
                this.customState.view.signal('otherZoneSelected', true)
                this.customState.view.signal('zoneSelected', false)
            } else {
                // console.log("alors ?", nextProps.selections.length)
                this.customState.view.signal('zoneSelected', (nextProps.selections.length > 0))
                this.customState.view.signal('otherZoneSelected', false)
            }
        }
        return dataChanged || selectionChanged || dimensionsChanged ||
            this.props.step !== nextProps.step ||
            this.state.label !== nextState.label||
            this.customState.shouldRender
    }
    initData (nextProps) {
        this.customState.multipleLoaded = []
        this.customState.multipleLoading = []
        this.customState.data = []
        this.customState.multipleData = getTimelineDict(nextProps.data, 'entrypoint')
        const { config, dataset, zone } = nextProps
        const selectedConfig = getSelectedMatch(config, zone)
        let categoryProp2 = selectedConfig.properties[1].path
        for (let dpe in this.customState.multipleData) {
            let dp = this.customState.multipleData[dpe]
            let name = (selectedConfig.properties[1].level === 1 && selectedConfig.properties[1].property === 'http://www.w3.org/2000/01/rdf-schema#label') ? dp.prop2 : usePrefix(dp.entrypoint, dataset.prefixes)
            this.customState.multipleData[dpe] = {
                ...this.customState.multipleData[dpe],
                prop2: (categoryProp2 === 'uri') ? usePrefix(dp.prop2, dataset.prefixes) : dp.prop2,
                name,
                events: [{
                    date: new Date(dp.prop1).getTime(),
                    label: selectedConfig.properties[0].readablePath.map(p => p.label).join(' / * / '),
                    indexEvent: 0,
                    offset: 0,
                    zIndex: 100
                }]
            }
        }
    }
    prepareData (nextProps) {
        // console.log('prepare data')
        const { display, dimensions, selections, zone } = nextProps

        // prepare the data for display
        let fullData = []
        for (let cle in this.customState.multipleData) {
            fullData.push(this.customState.multipleData[cle])
        }
        let events = []
        fullData = fullData.map((dp, i) => {
            let first = dp.events.sort((a,b) => a.date - b.date)[0]
            let last = dp.events.sort((a,b) => a.date - b.date)[dp.events.length-1]
            dp.events.forEach(ev => {
                events.push({
                    ...ev,
                    first: first.date,
                    last: last.date,
                    selector: `timeline_element_${dataLib.makeId(dp.entrypoint)}`,
                    entrypoint: dp.entrypoint,
                    prop2: dp.prop2
                })
            })
            return {
                ...dp,
                first: first.date,
                last: last.date,
                selector: `timeline_element_${dataLib.makeId(dp.entrypoint)}`,
                "index": i
            }
        }).sort((a, b) => a.first - b.first)
        
        // console.log(fullData)
        // console.log(events)
        const timedata = [{
            "name": "entities",
            "values": fullData
        },
        {
            "name": "events",
            "values": events
        },
        {
            "name": "selections",
            "values": selections.filter(s => s.zone === zone).map(s => { return { selector: s.selector, entrypoint: s.other } })
        }]
        // console.log(timedata)
        if (this.customState.view) {
            let changesetEntities = vega.changeset().remove(() => true).insert(fullData) 
            this.customState.view.change('entities', changesetEntities).run()
            let changesetEvents = vega.changeset().remove(() => true).insert(events) 
            this.customState.view.change('events', changesetEvents).run()
            //console.log('ixi,', this.customState.view._runtime)
            //console.log(fullData)
        }
        let marks = [{
            "type": "rule",
            "name": "entitylines",
            "from": {"data": "entities"},
            "encode": {
                "enter": {
                    "stroke": {"value": "#dedede"}
                },
                "update": {
                    "x": {"value": 0},
                    "y": {"scale": "yscale", "field": "entrypoint"},
                    "x2": {"signal": "width"},
                }
            }
        },
        {
            "type": "text",
            "from": {"data": "entities"},
            "encode": {
                "enter": {
                    "align": {"value": "right"},
                },
                "update": {
                    "x": {"value": -3},
                    "y": {"scale": "yscale", "field": "entrypoint", "offset": 3},
                    "text": {"field": "prop2"},
                    "fill": [
                        {"test": "otherZoneSelected || (zoneSelected && !indata('selections', 'entrypoint', datum.entrypoint))", "value": "#ccc"},
                        {"value": "#333"}
                    ],
                    "limit": {"value": display.viz.horizontal_padding}
                },
                "hover": {
                    "text": {"field": "name"},
                }
            }
        },
        {
            "type": "symbol",
            "name": "test",
            "from": {"data": "events"},
            "encode": {
                "enter": {
                    "size": {"value": 60},
                    "opacity": [
                        {"value": 0.8}
                    ]
                },
                "update": {
                    "xc": {"scale": "xscale", "field": "date"},
                    "yc": {"scale": "yscale", "field": "entrypoint", "offset" : "datum.offset"},
                    "zindex": [
                        {"test": "datum.offset >= 0", "signal" : "50 - datum.offset"},
                        {"signal": "100 - datum.offset"}
                    ],
                    "fill": [
                        {"test": "otherZoneSelected || (zoneSelected && !indata('selections', 'entrypoint', datum.entrypoint))", "value": "#ccc"},
                        {"scale": "color", "field": "prop2"}
                    ],
                    "stroke":{"value": "#fff"}
                }
            }
        },
        {
            "type": "rule",
            "name": "entitytimelines",
            "from": {"data": "entities"},
            "key": "prop2",
            "encode": {
                "update": {
                    "opacity": {"value": 0.7},
                    "x": {"scale": "xscale", "signal": "datum.first"},
                    "y": {"scale": "yscale", "field": "entrypoint"},
                    "x2": {"scale": "xscale", "signal": "datum.last"},
                    "stroke": [
                        {"test": "otherZoneSelected || (zoneSelected && !indata('selections', 'entrypoint', datum.entrypoint))", "value": "#ccc"},
                        {"scale": "color", "field": "prop2"}
                    ],
                    "selected": [
                        {"test": "inrange(item.y, domainY)", "value": true},
                        {"value": false}
                    ]
                }
            }
        },
        {
            "type": "text",
            "encode": {
                "enter": {
                    "baseline": {"value": "bottom"}
                },
                "update": {
                    "align": [
                        {"test": "scale('xscale', tooltip.date) > width / 2", "value": "right"},
                        {"value": "left"}
                    ],
                    "x": [
                        {"test": "scale('xscale', tooltip.date) > width / 2", "scale": "xscale", "signal": "tooltip.date", "offset": -3},
                        {"scale": "xscale", "signal": "tooltip.date", "offset": 3}
                    ],
                    "y": {"scale": "yscale", "signal": "tooltip.entrypoint"},
                    "text": {"signal": "tooltip.label"},
                    "fillOpacity": [
                        {"test": "datum === tooltip", "value": 0},
                        {"value": 1}
                    ]
                }
            }
        },
        ...defaultSpec.marks]
        const spec = {
            ...defaultSpec,
            "width": dimensions.useful_width,
            "height": dimensions.useful_height,
            "padding": {"bottom": display.viz.bottom_padding, "left": display.viz.horizontal_padding, "right": display.viz.horizontal_padding, "top": 40},
            "signals": [
                ...defaultSpec.signals,
                {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "symbol:mouseover", "update": "datum"},
                        {"events": "symbol:mouseout",  "update": "{}"}
                    ]
                },
                {
                    "name": "otherZoneSelected",
                    "value": false
                },
                {
                    "name": "zoneSelected",
                    "value": false              
                },
                {
                    "name": "domainX",
                    "value": "[0,0]",
                    "on": [
                        {
                            "events": {"signal": "zone"},
                            "update": "zone && span([zone[0][0],zone[1][0]]) ? invert('xscale', [zone[0][0],zone[1][0]]) : domainX"
                        }
                    ]
                },
                {
                    "name": "domainY",
                    "value": "[0,0]",
                    "on": [
                        {
                            "events": {"signal": "zone"},
                            "update": "zone ? [zone[0][1],zone[1][1]] : domainY"
                        }
                    ]
                }
            ],
            "data": timedata,
            "scales": [{
                "name": "yscale",
                "type": "band",
                "range": [0, {"signal": "height"}],
                "domain": {"data": "entities", "field": "entrypoint"}
            },
            {
                "name": "xscale",
                "type": "time",
                "range": [0, {"signal": "width"}],
                "domain": {"data": "events", "fields": ["date"]}
            },
            {
                "name": "color",
                "type": "ordinal",
                "range": {"scheme": "category10"},
                "domain": {"data": "entities", "field": "prop2"}
            }],
            "axes": [
                {"orient": "bottom", "scale": "xscale", "format": "%Y", "labelOverlap": "parity"},
                {"orient": "left", "scale": "yscale", "ticks": false, "labels": false, "domainColor": "#fff"}
            ],
            "marks": marks
        }
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            spec,
            timedata
            //selectedConfig
        }
    }
    componentDidUpdate () {
        //let elements = this.getElementsForTransition()
        //console.log(this.props.selections, this.customState.view._runtime, this.customState.view.scenegraph(), this.customState.shouldRender)
        // console.log('componentDidUpdate', this.customState.view.data('selections'), this.props.display.modifierPressed)
        if (this.customState.view) {
            this.customState.view.run()
            this.props.handleTransition(this.props, this.getElementsForTransition())
            this.customState.shouldRender = false
        }
    }
}

Timeline.propTypes = {
    config: PropTypes.object,
    configs: PropTypes.object,
    data: PropTypes.array,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    google: PropTypes.object,
    selections: PropTypes.array,
    role: PropTypes.string,
    step: PropTypes.string,
    zone: PropTypes.string,
    handleKeyDown: PropTypes.func,
    handleMouseDown: PropTypes.func,
    handleMouseMove: PropTypes.func,
    handleMouseUp: PropTypes.func,
    handleTransition: PropTypes.func,
    selectElements: PropTypes.func,
    loadMultiple: PropTypes.func
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        dataset: state.dataset,
        display: state.display,
        palettes: state.palettes,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getPropPalette: getPropPalette(dispatch),
        handleMouseDown: handleMouseDown(dispatch),
        handleMouseUp: handleMouseUp(dispatch),
        resetSelection: resetSelection(dispatch),
        selectElements: selectElements(dispatch),
        loadMultiple: loadMultiple(dispatch)
    }
}

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Timeline)

export default TimelineConnect
