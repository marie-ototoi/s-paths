import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Vega from 'react-vega';
// components
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements, resetSelection } from '../../actions/selectionActions'
import { getRelativeRectangle } from '../../lib/scaleLib'
import { getSelectedMatch } from '../../lib/configLib'
import { usePrefix } from '../../lib/queryLib'
import * as dataLib from '../../lib/dataLib'
// redux functions

class Timeline extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleNewView = this.handleNewView.bind(this)
        this.handleZoneSelected = this.handleZoneSelected.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refTimelineMap_${props.zone}`
        }
        this.prepareData(props)
    }
    handleSelect(...args) {
        const { selections, selectElements, zone } = this.props
        if (args[1]) {
            // console.log('yes we can', args, this.customState.view.scenegraph().root.items[0].items[10].items)
            let selected = this.customState.view.scenegraph().root.items[0].items[9].items.filter(it =>it.selected)
            // console.log('salut', selected)
            if (selected.length > 0) {
                selected = selected.map(el => {
                    return {
                        selector: `timeline_element_${dataLib.makeId(el.datum.entrypoint)}`,
                        index: el.datum.index,
                        query: {
                            type: 'uri',
                            value: el.datum.entrypoint
                        }
                    }
                })
                selectElements(selected, zone, selections)
            } else {
                resetSelection(zone)
            }
        }
    }
    handleNewView(args) {
        // console.log('view created', args.scenegraph())
        this.customState = {...this.customState, view: args, transitionSent: true}
        this.props.handleTransition(this.props, this.getElementsForTransition())
    }
    handleZoneSelected(args) {
        // console.log('coucou', args.scenegraph())
    }
    render () {
        const { dimensions, role, selections, step, zone } = this.props
        
        return (<g
            className = { `Timeline ${this.customState.elementName} role_${role}` } >
            { step !== 'changing' &&
            <foreignObject
                transform = { `translate(${dimensions.x}, ${dimensions.y + dimensions.top_padding})` }
                width = { dimensions.useful_width }
                height = { dimensions.useful_height }
            >
                { this.customState.spec &&
                    <Vega
                        spec = { this.customState.spec }
                        onSignalEndZone = { this.handleSelect }
                        onSignalZoneSelected  = { this.handleZoneSelected }
                        onNewView = { this.handleNewView }
                    />
                }
            </foreignObject>
            }
        </g>)
    }
    getElementsForTransition () {
        // console.log(this.customState.view.scenegraph().root.source.value[0].items[10].items)
        let items = this.customState.view.scenegraph().root.source.value[0].items[9].items.map(el => {
            return { 
                zone: {
                    x1: el.x,
                    y1: el.y,
                    x2: el.x + 5,
                    y2: el.y + 5,
                    width: 5,
                    height: 5
                },
                selector: `timeline_element_${dataLib.makeId(el.datum.entrypoint)}`,
                index: el.datum.index,
                query: {
                    type: 'uri',
                    value: el.datum.entrypoint
                },
                color: el.stroke,
                opacity: el.opacity,
                shape: 'rectangle',
                rotation: 0
            }
        })
        // console.log(items)
        return items
    }
    shouldComponentUpdate (nextProps, nextState) {
        // if (this.props.step === 'launch' && nextProps.step === 'launch') return false
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            this.prepareData(nextProps)
        }
        if (JSON.stringify(this.props.selections) !== JSON.stringify(nextProps.selections)) {
            if (nextProps.selections.some(s => s.zone !== nextProps.zone)) {
                this.customState.view.signal('otherZoneSelected', true)
                this.customState.view.signal('zoneSelected', false)
            } else {
                this.customState.view.signal('otherZoneSelected', false)
            }
        }
        return (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) ||
            (JSON.stringify(this.props.selections) !== JSON.stringify(nextProps.selections)) ||
            (JSON.stringify(this.props.display) !== JSON.stringify(nextProps.display)) ||
            (this.props.step !== nextProps.step)
    }
    prepareData (nextProps) {
        const { config, data, dataset, display, dimensions, getPropPalette, palettes, role, selections, zone } = nextProps
        // prepare the data for display
        // const selectedConfig = getSelectedMatch(config, zone)
        // First prop
        // const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        // console.log(data, role)
        const selectedConfig = getSelectedMatch(config, zone)
        const pathProp1 = selectedConfig.properties[0].path
        const colors = getPropPalette(palettes, pathProp1, 1)
        // console.log(colors)
        const datatest = [{
            "name": "entities",
            "values": data.map((dp, i) => {
                let categoryProp2 = selectedConfig.properties[1].path
                //let legend = (categoryProp2 === 'uri') ? usePrefix(dp.prop2.value, dataset.prefixes) : dp.prop2.value
                let name = (selectedConfig.properties[1].level === 1 && selectedConfig.properties[1].property === 'http://www.w3.org/2000/01/rdf-schema#label') ? dp.prop2.value : usePrefix(dp.entrypoint.value, dataset.prefixes)
                return {
                    "prop1": new Date(dp.prop1.value).getTime(),
                    "prop2": (categoryProp2 === 'uri') ? usePrefix(dp.prop2.value, dataset.prefixes) : dp.prop2.value,
                    "prop12": undefined,
                    "prop1label": selectedConfig.properties[0].readablePath.map(p => p.label).join(' / * / ') ,
                    "entrypoint": dp.entrypoint.value,
                    "name": name,
                    "selected": false,
                    "index": i
                }
            })
        },
        {
            "name": "selectedEntities",
            "source": "entities",
            "transform": [{"type": "filter", "expr": "!otherZoneSelected && datum.selected"}]

        }]
        const spec = {
            "$schema": "https://vega.github.io/schema/vega/v4.json",
            "width": dimensions.useful_width + display.viz.horizontal_padding,
            "height": dimensions.useful_height - 10,
            "config": {
                "axisBand": {
                    "bandPosition": 1,
                    "maxExtent": display.viz.horizontal_padding,
                    "minExtent": display.viz.horizontal_padding

                },
                "view": {
                    "autosize": "none"
                }
            },
            "data": datatest,
            "signals": [
                {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "symbol:mouseover", "update": "datum"},
                        {"events": "symbol:mouseout",  "update": "{}"}
                    ]
                },
                {
                    "name": "select",
                    "value": {},
                    "on": [
                        {"events": "symbol:mouseup", "update": "datum"}
                    ]
                },
                {
                    "name": "endZone", "value": true,
                    "on": [
                        {
                            "events": "mouseup",
                            "update": "true"
                        },
                        {
                            "events": "mousedown",
                            "update": "false"
                        }
                    ]
                },
                {
                    "name": "zone",
                    "value": null,
                    "on": [
                        
                        {
                            "events": "[mousedown, mouseup] > mousemove{100}",
                            "update": "zone ? [zone[0], [x(), y()]] : [[0, 0],[0, 0]]"
                        },
                        {
                            "events": "mousedown",
                            "update": "[[x(), y()], [x(), y()]]"
                        },
                        {
                            "events": "mouseup",
                            "update": "null"
                        }
                    ]
                },
                {
                    "name": "domainX",
                    "on": [
                        {
                            "events": {"signal": "zone"},
                            "update": "zone && span([zone[0][0],zone[1][0]]) ? invert('xscale', [zone[0][0],zone[1][0]]) : domainX"
                        }
                    ]
                },
                {
                    "name": "domainY",
                    "on": [ 
                        {
                            "events": {"signal": "zone"},
                            "update": "zone ? [zone[0][1],zone[1][1]] : domainY"
                        }
                    ]
                },
                {
                    "name": "otherZoneSelected",
                    "init": selections.some(s => s.zone !== zone)
                },
                {
                    "name": "zoneSelected",
                    "init": selections.some(s => s.zone === zone),
                    "on": [
                        {
                            "events": {"signal": "domainX"},
                            "update": "domainX ? true : false"
                        }
                    ]
                }
            ],
            "scales": [{
                "name": "yscale",
                "type": "band",
                "range": [0, {"signal": "height"}],
                "domain": {"data": "entities", "field": "entrypoint"}
            },
            {
                "name": "xscale",
                "type": "time",
                "range": [0, dimensions.useful_width],
                "domain": {"data": "entities", "fields": ["prop1"]}
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
            "marks": [{
                "type": "rect",
                "interactive": false,
                "encode": {
                    "enter": {
                        "y": {"value": 0},
                        "fill": {"value": "#ddd"}
                    },
                    "update": {
                        "x": {"signal": "zone ? zone[0][0] : 0"},
                        "x2": {"signal": "zone ? zone[1][0] : 0"},
                        "y": {"signal": "zone ? zone[0][1] : 0"},
                        "y2": {"signal": "zone ? zone[1][1] : 0"},
                        "fillOpacity": {"signal": "zone ? 0.2 : 0"}
                    }
                }
            },
            {
                "type": "rect",
                "interactive": false,
                "encode": {
                    "enter": {
                        "width": {"value": 1},
                        "fill": {"value": "#666"}
                    },
                    "update": {
                        "fillOpacity": {"signal": "zone ? 1 : 0"},
                        "x": {"signal": "zone ? zone[0][0] : 0"},
                        "y": {"signal": "zone ? zone[0][1] : 0"},
                        "y2": {"signal": "zone ? zone[1][1] : 0"},
                    }
                }
            },
            {
                "type": "rect",
                "interactive": false,
                "encode": {
                    "enter":{
                        "y": {"value": 0},
                        "width": {"value": 1},
                        "fill": {"value": "#666"}
                    },
                    "update": {
                        "fillOpacity": {"signal": "zone ? 1 : 0"},
                        "x": {"signal": "zone ? zone[1][0] : 0"},
                        "y": {"signal": "zone ? zone[0][1] : 0"},
                        "y2": {"signal": "zone ? zone[1][1] : 0"},
                    }
                }
            },
            {
                "type": "rect",
                "interactive": false,
                "encode": {
                    "enter":{
                        "y": {"value": 0},
                        "height": {"value": 1},
                        "fill": {"value": "#666"}
                    },
                    "update": {
                        "fillOpacity": {"signal": "zone ? 1 : 0"},
                        "x": {"signal": "zone ? zone[0][0] : 0"},
                        "x2": {"signal": "zone ? zone[1][0] : 0"},
                        "y": {"signal": "zone ? zone[0][1] : 0"},
                    }
                }
            },
            {
                "type": "rect",
                "interactive": false,
                "encode": {
                    "enter":{
                        "y": {"value": 0},
                        "height": {"value": 1},
                        "fill": {"value": "#666"}
                    },
                    "update": {
                        "fillOpacity": {"signal": "zone ? 1 : 0"},
                        "x": {"signal": "zone ? zone[0][0] : 0"},
                        "x2": {"signal": "zone ? zone[1][0] : 0"},
                        "y": {"signal": "zone ? zone[1][1] : 0"},
                    }
                }
            },
            {
                "type": "rule",
                "name": "entitylines",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "x": {"value": 0},
                        "y": {"scale": "yscale", "field": "entrypoint"},
                        "x2": {"value": dimensions.useful_width},
                        "stroke": {"value": "#ccc"}
                    }
                }
            },
            {
                "type": "text",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "align": {"value": "right"},
                        "x": {"value": 0},
                        "y": {"scale": "yscale", "field": "entrypoint"},
                        "text": {"field": "entrypoint"},
                        "fill": [
                            {"test": "(otherZoneSelected || (zoneSelected && (!inrange(datum.prop1, domainX) || !inrange(item.y, domainY))))", "value": "#ccc"},
                            {"value": "#333"}
                        ],
                        "limit": {"value": display.viz.horizontal_padding}
                    }
                }
            },
            {
                "type": "symbol",
                "name": "test",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "xc": {"scale": "xscale", "field": "prop1"},
                        "yc": {"scale": "yscale", "field": "entrypoint"},
                        "size": {"value": 100},
                        "strokeWidth": {"value": 2},
                        "opacity": [
                            {"value": 0.7}
                        ],
                        "fill": {"value": "transparent"}
                    },
                    "update": {
                        "stroke": [
                            {"test": "(otherZoneSelected || (zoneSelected && (!inrange(datum.prop1, domainX) || !inrange(item.y, domainY))))", "value": "#ccc"},
                            {"scale": "color", "field": "prop2"}
                        ],
                        "selected": [
                            {"test": "zoneSelected && (!inrange(datum.prop1, domainX) || !inrange(item.y, domainY))", "value": false},
                            {"value": true}
                        ]
                    }
                }
            },
            {
                "type": "symbol",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "xc": {
                            "scale": "xscale", 
                            "value": -100,
                            "condition": {"test": "datum.prop12 == undefined", "field": "prop12"},
                        },
                        "yc": {"scale": "yscale", "field": "entrypoint"},
                        "fill": {"value": "#f00"},
                        "size": {"value": 100},
                        "opacity": {
                            "condition": {"test": "datum.prop12 != undefined", "value": 1},
                            "value": 0
                        }
                    }
                }
            },
            {
                "type": "text",
                "encode": {
                    "enter": {
                        "align": {"value": "left"},
                        "baseline": {"value": "bottom"},
                        "fill": {
                            "value": "#333",
                            "condition": {"test": "datum.selected == true", "value": "#f00"}
                        }
                    },
                    "update": {
                        "x": {"scale": "xscale", "signal": "tooltip.prop1", "offset": 5},
                        "y": {"scale": "yscale", "signal": "tooltip.entrypoint", "offset": -3},
                        "text": {"signal": "tooltip.prop1label"},
                        "fillOpacity": [
                            {"test": "datum === tooltip", "value": 0},
                            {"value": 1}
                        ]
                    }
                }
            }]
        }

        //
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            spec,
            datatest
            //selectedConfig
        }
    }
    componentDidUpdate () {
        //let elements = this.getElementsForTransition()
        if (this.customState.transitionSent) this.props.handleTransition(this.props, this.getElementsForTransition())
    }
    componentWillUnmount () {
    }
}

Timeline.propTypes = {
    config: PropTypes.object,
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
    selectElements: PropTypes.func
}

function mapStateToProps (state) {
    return {
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
        selectElements: selectElements(dispatch)
    }
}

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Timeline)

export default TimelineConnect
