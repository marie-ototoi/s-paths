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

class Geo extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleNewView = this.handleNewView.bind(this)
        this.handleZoneSelected = this.handleZoneSelected.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refGeoMap_${props.zone}`
        }
        this.prepareData(props)
    }
    handleSelect(...args) {
        const { selections, selectElements, zone } = this.props
        // console.log('yes we can', args, this.customState.view.scenegraph().root.items[0].items[10].items)
        let selected = this.customState.view.scenegraph().root.source.value[0].items[1].items.filter(it =>it.selected)
        console.log('salut', selected)
        if (selected.length > 0) {
            selected = selected.map(el => {
                return {
                    selector: `geo_element_${dataLib.makeId(el.datum.entrypoint)}`,
                    index: el.datum.properties.index,
                    query: {
                        type: 'uri',
                        value: el.datum.properties.entrypoint
                    }
                }
            })
            selectElements(selected, zone, selections)
        } else {
            resetSelection(zone)
        }
    }
    handleNewView(args) {
        args.run()
        console.log('view created', args.scenegraph(), args.getState())
        this.customState = {...this.customState, view: args, transitionSent: true}
        //this.props.handleTransition(this.props, this.getElementsForTransition())
        window.setTimeout(() => { this.props.handleTransition(this.props, this.getElementsForTransition()) }, 300)
    }
    handleZoneSelected(args) {
        // console.log('coucou', args.scenegraph())
    }
    render () {
        const { dimensions, role, selections, step, zone } = this.props
        
        return (<g
            className = { `Geo ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { dimensions }
                component = { this }
                selections = { selections }
            />
            }
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
        // console.log("coucou geo", this.customState.view.scenegraph().root.source.value)
        // console.log(this.customState.view.scenegraph().root.items[0].items[1])
        let items = []
        if (this.customState.view.scenegraph() && this.customState.view.scenegraph().root.source.value[0]) {
            items = this.customState.view.scenegraph().root.source.value[0].items[1].items.map(el => {
                return { 
                    zone: {
                        x1: el.bounds.x1,
                        y1: el.bounds.y1,
                        x2: el.bounds.x2,
                        y2: el.bounds.y2,
                        width: 5,
                        height: 5
                    },
                    selector: `geo_element_${dataLib.makeId(el.datum.properties.entrypoint)}`,
                    index: el.datum.properties.index,
                    query: {
                        type: 'uri',
                        value: el.datum.properties.entrypoint
                    },
                    color: el.fill,
                    opacity: el.opacity,
                    shape: 'rectangle',
                    rotation: 0
                }
            })
        }
        // console.log(items)
        return items
    }
    getElementsInZone (props) {
        let { display, zone, zoneDimensions } = props
        let selectedElements = []
        return selectedElements
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
        let geodata = dataLib.prepareGeoData(data, dataset)
        console.log(geodata)
        const datatest = [{
            "name": "entities",
            "values": geodata,
            "format": {
                "type": "json",
                "property": "features"
            }
        },
        {
            "name": "countries",
            "url": "data/world-110m.json",
            "format": {"type": "topojson", "feature": "countries"},
            "transform": [
                {
                    "type": "geopath",
                    "projection": "projection"
                }
            ]
        },
        {
            "name": "entitygroups",
            "source": "entities",
            "transform": [
                {
                    "type": "formula",
                    "as": "latg",
                    "expr": "round(datum.properties.lat / 10) * 10"
                },
                {
                    "type": "formula",
                    "as": "longg",
                    "expr": "round(datum.properties.long / 10) * 10"
                },
                {
                    "type": "aggregate",
                    "groupby": ["longg", "latg"]
                },
                {
                    "type": "formula",
                    "as": "geometry",
                    "expr": "{ type: 'Point', coordinates : [datum.longg, datum.latg, 0]}"
                },
                {
                    "type": "formula",
                    "as": "type",
                    "expr": "'Feature'"
                }
            ]
        }]
        const spec = {
            "$schema": "https://vega.github.io/schema/vega/v4.json",
            "width": dimensions.useful_width + display.viz.horizontal_padding,
            "height": dimensions.useful_height - 10,
            "autosize": "none",
            "signals": [
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
                            "update": "zone ? [zone[0][0],zone[1][0]] : domainY"
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
            "data": datatest,
            "scales": [
                {
                    "name": "size",
                    "type": "sqrt",
                    "domain": [0, 100],
                    "range": [0, 6]
                }
            ],
            "projections": [
                {
                    "name": "projection",
                    "type": "mercator",
                    "scale": 200,
                    "translate": [{"signal": "width / 2"}, {"signal": "height / 2"}]
                }
            ],
            "marks": [
                {
                    "type": "path",
                    "from": {"data": "countries"},
                    "encode": {
                        "enter": {
                            "fill": {"value": "#dedede"},
                            "stroke": {"value": "white"}
                        },
                        "update": {
                            "path": {"field": "path"}
                        }
                    }
                },
                {
                    "type": "shape",
                    "name": "singlepoints",
                    "from": {"data": "entities"},
                    "encode": {
                        "update": {
                            "opacity": {"value": 0.25},
                            "fill": [
                                {"test": "(otherZoneSelected || (zoneSelected && (!inrange(item.x, domainX) || !inrange(item.y, domainY))))", "value": "#666"},
                                {"value": "red"}
                            ]
                        }
                    },
                    "transform": [
                        {
                            "type": "geoshape",
                            "projection": "projection",
                            "pointRadius": 5
                        }
                    ]
                },
                {
                    "type": "symbol",
                    "from": {"data": "entitygroups"},
                    "name": "aggregates",
                    "encode": {
                        "update": {
                            "opacity": {"value": 0.25},
                            "fill": {"value": "blue"},
                            "size":  {"field": "count", "mult": 100},
                            "x":  {"field": "x"},
                            "y":  {"field": "y"}
                        }
                    },
                    "transform": [
                        {
                            "type": "geopoint",
                            "projection": "projection",
                            "fields": ["datum.longg", "datum.latg"]
                        }
                    ]
                },
                {
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
                }
            ]
        }
        // "pointRadius": {"expr": "scale('size', exp(datum.properties.mag))"}
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

Geo.propTypes = {
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

const GeoConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Geo)

export default GeoConnect
