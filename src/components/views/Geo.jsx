import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Vega from 'react-vega';
// components
// d3
// libs
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements, resetSelection } from '../../actions/selectionActions'
import * as dataLib from '../../lib/dataLib'
import defaultSpec from '../../lib/spec'
// redux functions

class Geo extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleNewView = this.handleNewView.bind(this)
        this.handleTooltip = this.handleTooltip.bind(this)
        this.updateSelections = this.updateSelections.bind(this)
        this.handleZoneSelected = this.handleZoneSelected.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refGeoMap_${props.zone}`
        }
        this.state = {
            label: ''
        }
        this.prepareData(props)
    }

    handleSelect(...args) {
        const { selections, selectElements, zone } = this.props
        if (args[1]) {
            let selected = this.customState.view.scenegraph().root.source.value[0].items[2].items.filter(it =>it.selected)
            // console.log(this.customState.view.scenegraph().root.source.value[0].items[2].items.filter(it =>it.selected))
            if (selected.length > 0) {
                selected = selected.reduce((acc, cur) => {
                    let findSinglePoints =  this.customState.view.scenegraph().root.source.value[0].items[1].items.filter((it) => {
                        return cur.datum.latg === it.datum.latg && cur.datum.longg === it.datum.longg
                    }).map(el => { return { ...el, id: cur.datum.id } })
                    acc.push(...findSinglePoints)
                    return acc
                }, [])
                selected = selected.map(el => {
                    return {
                        selector: el.datum.properties.selector,
                        index: el.datum.properties.index,
                        query: {
                            type: 'uri',
                            value: el.datum.properties.entrypoint
                        },
                        zone,
                        other: el.id
                    }
                })
                selectElements(selected, zone, selections)
            } else {
                resetSelection(zone)
            }
        }
    }
    handleNewView(args) {
        this.customState = {...this.customState, view: args}
        window.setTimeout(() => this.props.handleTransition(this.props, this.getElementsForTransition()), 500)
    }
    handleZoneSelected(...args) {
        // console.log('coucou', ...args)
    }
    handleTooltip(...args) {
        
        let el = args[1]
        let id = el.longg !== undefined ? `${el.longg}${el.latg}` : undefined
        if (this.props.role !== 'target' && 
            id !== undefined && id !== this.state.hover &&
            this.customState.view.scenegraph().root.source.value[0]) {
            // console.log(this.customState.view.scenegraph().root.source.value[0].items[1].items, el.latg,)
            let findSinglePoints =  this.customState.view.scenegraph().root.source.value[0].items[1].items.filter((it) => {
                return el.latg === it.datum.latg && el.longg === it.datum.longg
            })
            let label = findSinglePoints.map(p => p.datum.properties.label).join(", ")
            this.setState({ hover: id, label }) 
        }
    }
    render () {
        const { dimensions, display, role, step } = this.props
        return (<div
            className = { `Geo ${this.customState.elementName} role_${role}` } >
            { step !== 'changing' &&
            <div
                style = {{ 
                    position: 'relative',
                    left : `${dimensions.x + display.viz.horizontal_padding}px`,
                    top: `${dimensions.y + dimensions.top_padding}px`,
                    width: `${dimensions.useful_width}px`,
                    height: `${dimensions.useful_height}px`
                }}
                
            >
                <p
                    className = "legend"
                    style = {{ marginLeft: display.viz.useful_width + 'px', width: (display.viz.horizontal_padding - 20) + 'px' }}
                >{this.state.label}</p>
                { this.customState.spec &&
                    <Vega
                        spec = { this.customState.spec }
                        onSignalEndZone = { this.handleSelect }
                        onSignalZoneSelected  = { this.handleZoneSelected }
                        onSignalTooltip  = { this.handleTooltip }
                        onSignalScalePrecision  = { this.handleZoneSelected }
                        onNewView = { this.handleNewView }
                    />
                }
            </div>
            }
        </div>)
    }
    getElementsForTransition () {
        // console.log("coucou geo", this.customState.view.scenegraph().root.source.value[0].items[1].items[0])
        // console.log(this.customState.view.scenegraph().root.source.value[0].items[1].items)
        let items = []
        // console.log(this.customState.view.scenegraph().root.source.value[0])
        // if (this.customState.view.scenegraph().root.source.value[0]) console.log(this.customState.view.scenegraph().root.source.value[0].items[1].items[0].opacity)
        if (this.customState.view.scenegraph().root.source.value[0] && this.customState.view.scenegraph().root.source.value[0].items[1].items[0].opacity) {
            // let firstX = this.customState.view.scenegraph().root.source.value[0].items[1].items[0].bounds.x1
            // let firstX2 = this.customState.view.scenegraph().root.source.value[0].items[1].items[0].bounds.x2
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
                    selector:el.datum.properties.selector,
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
    updateSelections (nextProps) {
        let { selections, zone } = nextProps
        // console.log("FOIS FOIS")
        if (this.customState.view) {
            // this.customState.view.remove('entities', this.customState.view.data('entities'))
            this.customState.view.remove('selections', function(d) { return true }).run();
            this.customState.view.insert('selections',  selections.filter(s => s.zone === zone).map(s => { return { selector: s.selector, id: s.other } })).run()
        }
    }
    shouldComponentUpdate (nextProps, nextState) {
        let dataChanged = (this.props.data.length !== nextProps.data.length ||
            (this.props.data[0] && nextProps.data[0] && this.props.data[0].prop1.value !== nextProps.data[0].prop1.value))
        let selectionChanged = this.props.selections.length !== nextProps.selections.length
        let dimensionsChanged = (this.props.dimensions.width !== nextProps.dimensions.width || this.props.dimensions.height !== nextProps.dimensions.height)
        if (selectionChanged && !dataChanged) {
            // console.log('HAS CHANGED')
            this.updateSelections(nextProps)
        }
        if (dataChanged) {
            if(this.customState.view) this.customState.view.finalize() 
            this.prepareData(nextProps)
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
                this.customState.view.signal('otherZoneSelected', false)
            }
        }
        return dataChanged || selectionChanged || dimensionsChanged ||
            this.props.step !== nextProps.step ||
            this.state.label !== nextState.label
    }
    prepareData (nextProps) {
        const { data, dataset, dimensions, selections, zone } = nextProps
        // prepare the data for display
        const geodata = [{
            "name": "entities",
            "values": {
                type: 'FeatureCollection',
                features: dataLib.prepareGeoData(data, dataset, selections, zone)
            },
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
            "name": "newentities",
            "source": "entities",
            "transform": [
                {
                    "type": "formula",
                    "as": "latg",
                    "expr": "round(datum.properties.lat / scale('precision', scaleZoom)) * scale('precision', scaleZoom)"
                },
                {
                    "type": "formula",
                    "as": "longg",
                    "expr": "round(datum.properties.long / scale('precision', scaleZoom)) * scale('precision', scaleZoom)"
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
                    "expr": "round(datum.properties.lat / scale('precision', scaleZoom)) * scale('precision', scaleZoom)"
                },
                {
                    "type": "formula",
                    "as": "longg",
                    "expr": "round(datum.properties.long / scale('precision', scaleZoom)) * scale('precision', scaleZoom)"
                },
                {
                    "type": "aggregate",
                    "groupby": ["longg", "latg"],
                    "fields": ["properties.long", "properties.lat", "longg", "properties.singleselected"],
                    "ops": ["median", "median", "count", "sum"],
                    "as": ["medianlong", "medianlat", "countsingle", "singleselected"]
                },
                {
                    "type": "identifier",
                    "as": "id"
                }
            ]
        },
        {
            "name": "selections",
            "values": selections.filter(s => s.zone === zone).map(s => { return { selector: s.selector, id: s.other } })
        }]
        const spec = {
            ...defaultSpec,
            "width": dimensions.useful_width,
            "height": dimensions.useful_height,
            "signals": [
                ...defaultSpec.signals,
                {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "@aggregatePoints:mouseover", "update": "datum"},
                        {"events": "@aggregateCount:mouseover", "update": "datum"},
                        {"events": "@aggregatePoints:mouseout",  "update": "{}"},
                        {"events": "@aggregateCount:mouseout",  "update": "{}"}
                    ]
                },
                {
                    "name": "otherZoneSelected",
                    "value": selections.some(s => s.zone !== zone)
                },
                {
                    "name": "zoneSelected",
                    "value": selections.some(s => s.zone === zone),
                    "on": [
                        {
                            "events": {"signal": "domainX"},
                            "update": "domainX ? true : false"
                        }
                    ]
                },
                {
                    "name": "domainX",
                    "value": "[0,0]",
                    "on": [
                        {
                            "events": {"signal": "zone"},
                            "update": "zone ? [zone[0][0],zone[1][0]] : domainX"
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
                },
                {
                    "name": "scaleZoom",
                    "value": 150,
                    "on": [{
                        "events": {"type": "wheel", "consume": true},
                        "update": "clamp(scaleZoom * pow(1.0005, -event.deltaY * pow(16, event.deltaMode)), 150, 3000)"
                    }]
                },
                {
                    "name": "scalePrecision",
                    "update": "scale('precision', scaleZoom)",
                    "on": [{
                        "events": {"signal": "scaleZoom"},
                        "update": "scale('precision', scaleZoom)"
                    }]
                },
            ],
            "data": geodata,
            "scales": [
                {
                    "name": "size",
                    "type": "sqrt",
                    "domain": [0, 100],
                    "range": [0, 6]
                },
                {
                    "name": "precision",
                    "type": "linear",
                    "domain": [150, 1500],
                    "range": [15, 1]
                },
                {
                    "name": "color",
                    "type": "linear",
                    "range": {"scheme": "yelloworangered"},
                    "domain": {"data": "entitygroups", "field": "countsingle"}
                },
                {
                    "name": "textcolor",
                    "type": "linear",
                    "reverse": true,
                    "range": {"scheme": "greys"},
                    "domain": {"data": "entitygroups", "field": "countsingle"}
                }
            ],
            "projections": [
                {
                    "name": "projection",
                    "type": "mercator",
                    "scale": {"signal": "scaleZoom"},
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
                    "from": {"data": "newentities"},
                    "encode": {
                        "update": {
                            "opacity": {"value": 0.01},
                            "fill":  {"value": "blue"}
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
                    "name": "aggregatePoints",
                    "encode": {
                        "update": {
                            "opacity": {"value": 0.85},
                            "fill": [
                                {"test": "otherZoneSelected || (zoneSelected && !indata('selections', 'id', datum.id))", "value": "#666"},
                                {"scale": "color", "field": "countsingle"}
                            ],
                            "size": {"signal": "160 + datum.countsingle * 30"},
                            "medianlong2": {"field": "medianlong"},
                            "medianlat2": {"field": "medianlat"},
                            "selected": [
                                {"test": "otherZoneSelected || (zoneSelected && (!inrange(item.bounds.x1, domainX) || !inrange(item.bounds.y1, domainY)))", "value": false},
                                {"value": true}
                            ]
                        }
                    },
                    "transform": [
                        {
                            "type": "geopoint",
                            "projection": "projection",
                            "fields": ["medianlong2", "medianlat2"]
                        }
                    ]
                },
                {
                    "type": "text",
                    "from": {"data": "entitygroups"},
                    "name": "aggregateCount",

                    "encode": {
                        "update": {
                            "fill": {"value": "#fff"},
                            "align": {"value": "center"},
                            "baseline": {"value": "middle"},
                            "text": [
                                {"test": "datum.countsingle > 1", "field": "countsingle"},
                                {"value": ""}
                            ],
                            "medianlong2": {"field": "medianlong"},
                            "medianlat2": {"field": "medianlat"}
                        }
                    },
                    "transform": [
                        {
                            "type": "geopoint",
                            "projection": "projection",
                            "fields": ["medianlong2", "medianlat2"]
                        }
                    ]
                },
                ...defaultSpec.marks
            ]
        }
        /* 
        
        */
        // console.log(spec)
        // "pointRadius": {"expr": "scale('size', exp(datum.properties.mag))"}
        //
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            geodata,
            spec
            //selectedConfig
        }
    }
    componentDidUpdate () {
        //let elements = this.getElementsForTransition()
        if (this.customState.view) {
            // if(this.customState.view.scenegraph().source.value) console.log('componentDidUpdate', this.customState.view.scenegraph().source.value[0].items[2].items, this.props.display.modifierPressed, this.props.selections)
            this.customState.view.run()
            //console.log(this.props.selections, this.customState.view.scenegraph().root.items[0].items[2].items)
            this.props.handleTransition(this.props, this.getElementsForTransition())
        }
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
