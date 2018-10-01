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
import defaultSpec from '../../lib/spec'
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
        if (args[1]) {
            // console.log('yes we can', args, this.customState.view.scenegraph().root.source.value[0].items[1].items)
            let selected = this.customState.view.scenegraph().root.source.value[0].items[1].items.filter(it =>it.selected)
            // console.log('salut', selected)
            if (selected.length > 0) {
                selected = selected.map(el => {
                    return {
                        selector: `geo_element_${dataLib.makeId(el.datum.properties.entrypoint)}`,
                        index: el.datum.properties.index,
                        query: {
                            type: 'uri',
                            value: el.datum.properties.entrypoint
                        }
                    }
                })
                // console.log(selected)
                selectElements(selected, zone, selections)
            } else {
                resetSelection(zone)
            }
        }
    }
    handleNewView(args) {
        // console.log('view created', args.scenegraph(), args.getState())
        this.customState = {...this.customState, view: args, transitionSent: true}
        //this.props.handleTransition(this.props, this.getElementsForTransition())
        window.setTimeout(() => { this.props.handleTransition(this.props, this.getElementsForTransition()) }, 300)
    }
    handleZoneSelected(...args) {
        // console.log('coucou', ...args)
    }
    render () {
        const { dimensions, display, role, selections, step, zone } = this.props
        
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
        // console.log("coucou geo", this.customState.view.scenegraph().root.source.value)
        // console.log(this.customState.view.scenegraph().root.source.value[0].items[1].items)
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

    shouldComponentUpdate (nextProps, nextState) {
        // if (this.props.step === 'launch' && nextProps.step === 'launch') return false
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            this.prepareData(nextProps)
        }
        if (this.props.dimensions.width !== nextProps.dimensions.width) this.customState.view.signal('width', nextProps.dimensions.useful_width).run()
        if (this.props.dimensions.height !== nextProps.dimensions.height) this.customState.view.signal('height', nextProps.dimensions.useful_height).run()
        
        // console.log('redraw ?', nextProps.display.viz[this.props.zone + '_useful_width'], nextProps.display.viz[this.props.zone + '_useful_height'])
        /* if (this.customState.view &&
            ((this.props.display.viz[this.props.zone + '_useful_width'] !== nextProps.display.viz[this.props.zone + '_useful_width']) ||
            (this.props.display.viz[this.props.zone + '_height'] !== nextProps.display.viz[this.props.zone + '_useful_height']))) {
            console.log('redraw ?', nextProps.display.viz[this.props.zone + '_useful_width'], nextProps.display.viz[this.props.zone + '_useful_height'])
            this.customState.view.width(nextProps.display.viz[this.props.zone + '_useful_width'])
            this.customState.view.height(nextProps.display.viz[this.props.zone + '_useful_height'])
        } */
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
        // const selectedConfig = getSelectedMatch(config, zone)
        // const pathProp1 = selectedConfig.properties[0].path
        // const colors = getPropPalette(palettes, pathProp1, 1)

        // console.log(defaultSpec)
        const geodata = [{
            "name": "entities",
            "values": dataLib.prepareGeoData(data, dataset),
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
            ...defaultSpec,
            "width": dimensions.useful_width,
            "height": dimensions.useful_height,
            "signals": [
                ...defaultSpec.signals,
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
                    "on": [
                        {
                            "events": {"signal": "zone"},
                            "update": "zone ? [zone[0][0],zone[1][0]] : domainX"
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
                }
            ],
            "data": geodata,
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
                                {"test": "(otherZoneSelected || (zoneSelected && (!inrange(item.bounds.x1, domainX) || !inrange(item.bounds.y1, domainY))))", "value": "#666"},
                                {"value": "red"}
                            ],
                            "selected": [
                                {"test": "(zoneSelected && (!inrange(item.bounds.x1, domainX) || !inrange(item.bounds.y1, domainY)))", "value": false},
                                {"value": true}
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
                ...defaultSpec.marks
            ]
        }
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
