import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import defaultSpec from '../../lib/spec'
import Vega from 'react-vega';
import * as vega from 'vega-lib';
// components
// d3

// libs
import { prepareSingleData } from '../../lib/dataLib'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'

class ListAllProps extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleNewView = this.handleNewView.bind(this)
        this.handleTooltip = this.handleTooltip.bind(this)
        this.updateSelections = this.updateSelections.bind(this)
        this.handleZoneSelected = this.handleZoneSelected.bind(this)
        this.customState = {
            elementName: `refListProp_${props.zone}`
        }
        this.prepareData(props)
    }
    handleSelect(...args) {
        //
    }
    handleNewView(args) {
        console.log(args._runtime)
        this.customState = {...this.customState, view: args}
        window.setTimeout(() => this.props.handleTransition(this.props, this.getElementsForTransition()), 500)
    }
    handleZoneSelected(...args) {
        // console.log('coucou', ...args)
    }
    handleTooltip(...args) {
        //
    }
    prepareData (nextProps) {
        const { data, dataset, dimensions, selections, zone } = nextProps
        // prepare the data for display
        console.log(data)
        // Save to reuse in render
        //prepareSingleData(data, dataset)
        const datatree = [{
            "name": "tree",
            "values": prepareSingleData(data, dataset),
            "transform": [
                {
                    "type": "stratify",
                    "key": "id",
                    "parentKey": "parent"
                },
                {
                    "type": "tree",
                    "method": {"signal": "layout"},
                    "size": [1, {"signal": "radius"}],
                    "as": ["alpha", "radius", "depth", "children"]
                },
                {
                    "type": "formula",
                    "expr": "(rotate + extent * datum.alpha + 270) % 360",
                    "as":   "angle"
                },
                {
                    "type": "formula",
                    "expr": "PI * datum.angle / 180",
                    "as":   "radians"
                },
                {
                    "type": "formula",
                    "expr": "inrange(datum.angle, [90, 270])",
                    "as":   "leftside"
                },
                {
                    "type": "formula",
                    "expr": "originX + datum.radius * cos(datum.radians)",
                    "as":   "x"
                },
                {
                    "type": "formula",
                    "expr": "originY + datum.radius * sin(datum.radians)",
                    "as":   "y"
                }
            ]
        },
        {
            "name": "links",
            "source": "tree",
            "transform": [
                { "type": "treelinks" },
                {
                    "type": "linkpath",
                    "shape": {"signal": "links"}, "orient": "radial",
                    "sourceX": "source.radians", "sourceY": "source.radius",
                    "targetX": "target.radians", "targetY": "target.radius"
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
                    "name": "labels", "value": true,
                },
                {
                    "name": "radius", "update": "700" ,
                },
                {
                    "name": "extent", "value": 30,
                },
                {
                    "name": "rotate", "value": 75,
                },
                {
                    "name": "layout", "value": "tidy",
                },
                {
                    "name": "links", "value": "diagonal",
                },
                { "name": "originX", "value": 10 },
                { "name": "originY", "update": "height / 2" }
            ],
            "data": datatree,
            "scales": [
                {
                    "name": "color",
                    "type": "sequential",
                    "range": {"scheme": "viridis"},
                    "domain": {"data": "tree", "field": "depth"},
                    "zero": true
                }
            ],
            "projections": [],
            "marks": [
                {
                    "type": "path",
                    "from": {"data": "links"},
                    "encode": {
                        "update": {
                            "x": {"signal": "originX"},
                            "y": {"signal": "originY"},
                            "path": {"field": "path"},
                            "stroke": {"value": "#ccc"}
                        }
                    }
                },
                {
                    "type": "symbol",
                    "from": {"data": "tree"},
                    "encode": {
                        "enter": {
                            "size": {"value": 100},
                            "stroke": {"value": "#fff"}
                        },
                        "update": {
                            "x": {"field": "x"},
                            "y": {"field": "y", "offset" : {"expr": "if(item.x > 20 && item.x < 200, 10, -10)"}},
                            "fill": {"scale": "color", "field": "depth"}
                        }
                    }
                },
                {
                    "type": "text",
                    "from": {"data": "tree"},
                    "encode": {
                        "enter": {
                            "text": {"field": "name"},
                            "fontSize": {"value": 9},
                            "baseline": {"value": "middle"}
                        },
                        "update": {
                            "x": {"field": "x"},
                            "y": {"field": "y"},
                            "dx": {"signal": "(datum.leftside ? -1 : 1) * 6"},
                            "align": {"signal": "datum.leftside ? 'right' : 'left'"},
                            "opacity": {"signal": "labels ? 1 : 0"}
                        }
                    }
                },
                ...defaultSpec.marks
            ]
        }
        console.log(spec)
        // "pointRadius": {"expr": "scale('size', exp(datum.properties.mag))"}
        //
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            spec
            //selectedConfig
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
            this.props.step !== nextProps.step 
    }
    getElementsForTransition () {
        let { dimensions } = this.props
        let { width, height } = dimensions
        return [{ 
            zone: {
                x1: 10,
                y1: height/2 - 5,
                x2: 20,
                y2: height/2 + 5,
                width: 10,
                height: 10
            },
            selector:'URI',
            index: 0,
            query: {
                type: 'uri',
                value: 'URI'
            },
            color: '#f00',
            opacity: 1,
            shape: 'rectangle',
            rotation: 0
        }]
    }
    updateSelections (nextProps) {
        let { selections, zone } = nextProps
        // console.log("FOIS FOIS")
        if (this.customState.view) {
            // this.customState.view.remove('entities', this.customState.view.data('entities'))
            let changeset = vega.changeset().remove(() => true).insert(selections.filter(s => s.zone === zone).map(s => { return { selector: s.selector, id: s.other } }));
            // For some reason source_0 is the default dataset name
            this.customState.view.change('selections', changeset).run()
        }
    }
    componentDidUpdate () {
        //let elements = this.getElementsForTransition()
        if (this.customState.view) {
            // if(this.customState.view.scenegraph().source.value) console.log('componentDidUpdate', this.customState.view.scenegraph().source.value[0].items[2].items, this.props.display.modifierPressed, this.props.selections)
            this.customState.view.run()
            // console.log(this.customState.view._runtime)
            this.props.handleTransition(this.props, this.getElementsForTransition())
        }
    }
}

ListAllProps.propTypes = {
    config: PropTypes.object,
    data: PropTypes.array,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
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
        selectElements: selectElements(dispatch)
    }
}

const ListAllPropsConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ListAllProps)

export default ListAllPropsConnect
