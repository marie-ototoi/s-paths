import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import defaultSpec from '../../lib/spec'
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
        this.createView = this.createView.bind(this)
        this.viewCreated = this.viewCreated.bind(this)
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
    createView() {
        // console.log('fn create view')
        this.customState.view = new vega.View(vega.parse(this.customState.spec))
            .renderer('svg')  // set renderer (canvas or svg)
            .initialize('#' + this.customState.elementName) // initialize view within parent DOM container
            .hover() // enable hover encode set processing
            .run();
        window.setTimeout(() => this.viewCreated(), 500)

        
    }
    viewCreated() {
        this.props.handleTransition(this.props, this.getElementsForTransition())
        this.customState.view.addSignalListener('endZone', this.handleSelect)
        this.customState.view.addSignalListener('zoneSelected', this.handleZoneSelected)
    }
    handleZoneSelected(...args) {
        // console.log('coucou', ...args)
    }
    handleTooltip(...args) {
        //
    }
    prepareData (nextProps) {
        const { data, dataset, display, dimensions, selections, zone } = nextProps
        // prepare the data for display
        // console.log(data)
        // Save to reuse in render
        // console.log(prepareSingleData(data, dataset))
        //prepareSingleData(data, dataset)
        const datatree = [{
            "name": "open",
            "values": [{ "id": 1 }],
            "on": [
                {
                    "trigger": "clicked",
                    "toggle":  "clicked"
                }
            ]
        },
        {
            "name": "tree",
            "values": prepareSingleData(data, dataset),
            "transform": [
                {
                    "type": "filter",
                    "expr": "indata('open', 'id', datum.parentCheck)"
                },
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
            "padding": {"bottom": display.viz.bottom_padding, "left": display.viz.horizontal_padding, "right": display.viz.horizontal_padding, "top": dimensions.top_padding},
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
                    "name": "labels", "value": true
                },
                {
                    "name": "test",
                    "update": "[1, 2, 3]" 
                },
                {
                    "name": "radius", "update": "width - 10" ,
                },
                {
                    "name": "extent", "value": 30,
                },
                {
                    "name": "rotate", "value": 78,
                },
                {
                    "name": "layout", "value": "tidy",
                },
                {
                    "name": "links", "value": "diagonal",
                },
                { "name": "originX", "value": 5 },
                { "name": "originY", "update": "height / 2" },
                {
                    "name": "parents",
                    "value": []
                },
                {
                    "name": "clicked",
                    "value": {},
                    "on": [
                        {"events": "@nodes:click", "update": "{ id: datum.id }", "force": true},
                    ]
                }
            ],
            "data": datatree,
            "scales": [
                {
                    "name": "color",
                    "type": "sequential",
                    "range": {"scheme": "viridis"},
                    "domain": [1, 6],
                    "zero": true
                }
            ],
            "projections": [],
            "marks": [
                {
                    "type": "path",
                    "from": {"data": "links"},
                    "name": "edges",
                    "encode": {
                        "update": {
                            "x": {"signal": "originX"},
                            "y": {"signal": "originY"},
                            "path": {"field": "path"},
                            "stroke": [
                                {"value": "#ddd"}
                            ]
                        }
                    }
                },
                {
                    "type": "symbol",
                    "from": {"data": "tree"},
                    "name": "nodes",
                    "encode": {
                        "enter": {
                            "size": {"value": 100},
                            "stroke": {"value": "#fff"}
                        },
                        "update": {
                            "x": {"field": "x"},
                            "y": {"field": "y"},
                            "fill": {"scale": "color", "field": "depth"},
                            "fillOpacity": [
                                {"value": 0.8}
                            ]
                        },
                        "hover": {
                            "fillOpacity": [
                                {"test": "datum.depth < datum.pathDepth", "value": 1},
                                {"value": 0.8}
                            ],
                            "cursor": [
                                {"test": "datum.depth < datum.pathDepth", "value": "pointer"},
                                {"value": "default"}
                            ]
                        }
                    }
                },
                {
                    "type": "rect",
                    "from": {"data": "tree"},
                    "name": "rectnodes",
                    "encode": {
                        "enter": {                            
                            "width": {"field": "charlength", "mult": 5.1},
                            "height": {"value": 15},
                            "fill": {"value": "#fff"}
                        },
                        "update": {
                            "x": {"field": "x", "offset": 6},
                            "yc": {"field": "y"},
                            "fillOpacity": [
                                {"test": "datum.id == 1", "value": 0},
                                {"value": 0.1}
                            ]
                        }
                    }
                },
                {
                    "type": "text",
                    "from": {"data": "tree"},
                    "name": "textnodes",
                    "encode": {
                        "enter": {                            
                            "fontSize": {"value": 10},
                            "baseline": {"value": "middle"}
                        },
                        "update": {
                            "text": {"field": "shortname"},
                            "x": {"field": "x"},
                            "y": {"field": "y"},
                            "dx": {"signal": "(datum.id == 1 ? -1 : 1) * 6"},
                            "align": {"signal": "datum.id == 1 ? 'right' : 'left'"},
                            "fill": [
                                {"value": "#666"}
                            ]
                        }
                    }
                },
                {
                    "type": "text",
                    "from": {"data": "links"},
                    "name": "edgestext",
                    "encode": {
                        "update": {
                            "x2": {"signal": "datum.target.x - 6"},
                            "y": {"signal": "datum.target.y"},
                            "text": {"signal": "datum.target.path"},
                            "align": {"value": "right"},
                            "fill": [
                                {"value": "#aaa"}
                            ],
                            "baseline": {"value": "middle"},
                            "fillOpacity": [
                                {"value": 1}
                            ]
                        }
                    }
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
            spec
            //selectedConfig
        }
    }
    render () {
        const { dimensions, display, role, step } = this.props
        return (<div
            className = { `ListPtops ${this.customState.elementName} role_${role}` } >
            { step !== 'changing' &&
            <div
                style = {{ 
                    position: 'relative',
                    left : `${dimensions.x}px`,
                    top: `${dimensions.y}px`,
                    width: `${dimensions.useful_width}px`,
                    height: `${dimensions.useful_height}px`
                }}
                
            >
                { this.customState.spec &&
                    <div id = { this.customState.elementName }></div>
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
        let { data, dimensions, zone } = this.props
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
            selector:'singleURI_' + zone,
            index: 0,
            query: {
                type: 'uri',
                value: data[0].entrypoint.value
            },
            color: '#4b18a1',
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
    componentDidMount () {
        // console.log('create mount')
        this.createView()
    }
    componentDidUpdate () {
        //let elements = this.getElementsForTransition()
        if (this.customState.view) {
            // if (this.customState.view) console.log('componentDidUpdate', this.customState.view.scenegraph(), this.customState.view._runtime)
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
