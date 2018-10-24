import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Vega from 'react-vega'
import * as vega from 'vega-lib'
// components
// d3
// libs
import { getSelectedMatch } from '../../lib/configLib'
import { makeId, prepareSinglePropData } from '../../lib/dataLib'
import { usePrefix } from '../../lib/queryLib'
import defaultSpec from '../../lib/spec'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { selectElements } from '../../actions/selectionActions'

class SingleProp extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleZoneSelected = this.handleZoneSelected.bind(this)
        this.updateSelections = this.updateSelections.bind(this)
        this.handleNewView = this.handleNewView.bind(this)
        this.prepareData = this.prepareData.bind(this)
        this.customState = {
            elementName: `refSingleProp_${props.zone}`
        }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        let dataChanged = (this.props.data.length !== nextProps.data.length ||
            (this.props.data[0] && nextProps.data[0] && this.props.data[0].prop1.value !== nextProps.data[0].prop1.value))
        let selectionChanged = this.props.selections.length !== nextProps.selections.length
        let dimensionsChanged = (this.props.dimensions.width !== nextProps.dimensions.width || this.props.dimensions.height !== nextProps.dimensions.height)
        if (dataChanged) {
            this.prepareData(nextProps)
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
                if (nextProps.selections.length > 0) this.customState.view.signal('zoneSelected', true)
                this.customState.view.signal('otherZoneSelected', false)
            }
        }
        return dataChanged ||
            selectionChanged ||
            dimensionsChanged ||
            this.props.step !== nextProps.step
    }
    handleZoneSelected(...args) {
        // console.log('coucou', args)
    }
    updateSelections (nextProps) {
        let { selections, zone } = nextProps
        console.log("FOIS FOIS")
        if (this.customState.view) {
            // this.customState.view.remove('entities', this.customState.view.data('entities'))
            let changeset = vega.changeset().remove(() => true).insert(selections.filter(s => s.zone === zone).map(s => { return { selector: s.selector, entrypoint: s.other } }));
            // For some reason source_0 is the default dataset name
            this.customState.view.change('selections', changeset).run()
        }
    }
    handleSelect(...args) {
        // console.log('yes we can')
        const { display, selections, selectElements, zone } = this.props
        if (args[1]) {
            // console.log('yes we can', args, this.customState.view.scenegraph().root.source.value[0].items[6].items.filter(it =>it.selected))
            let selected = this.customState.view.scenegraph().root.source.value[0].items[6].items.filter(it =>it.selected)
            //console.log('salut', this.customState.view.scenegraph().root.source.value[0].items[6].items.filter(it =>it.selected))
            if (selected.length > 0) {
                selected = selected.map(el => {
                    return {
                        selector: `single_prop_${makeId(el.datum.entrypoint)}`,
                        index: el.datum.index,
                        query: {
                            type: 'uri',
                            value: el.datum.entrypoint
                        },
                        other: el.datum.entrypoint
                    }
                })
            }
            // console.log('salut', this.customState.view._runtime, selected)
            selectElements(selected, zone, selections, display.modifierPressed)
        }
    }
    handleNewView(args) {
        this.customState = {...this.customState, view: args}
        window.setTimeout(() => this.props.handleTransition(this.props, this.getElementsForTransition()), 500)
    }
    prepareData (nextProps) {
        const { config, data, dataset, dimensions, display, selections, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
        const categoryProp1 = selectedConfig.properties[0].category
        // First prop
        //console.log()
        const nestedProp1 = prepareSinglePropData(data, categoryProp1, dataset.prefixes)
        let labelAngle = (selectedConfig.properties[0].avgcharlength * 8 > dimensions.useful_width / nestedProp1.length) ? -45 : 0 
        // console.log('labelAngle', labelAngle, nextProps.role, nextProps.step)
        let labelAlign = labelAngle < 0 ? 'right' : 'center'
        const singledata = [{
            "name": "entities",
            "values": data.map((dp, dpi) => {
                return {
                    ...dp,
                    prop1: dp.prop1.value,
                    index: dpi,
                    entrypoint: dp.entrypoint.value,
                    name: usePrefix(dp.entrypoint.value, dataset.prefixes)
                }
            })
        },
        {
            "name": "categories",
            "source": "entities",
            "transform" : [{
                "type": "aggregate",
                "groupby": ["prop1"]
            }]   
        },
        {
            "name": "selections",
            "values": selections.filter(s => s.zone === zone).map(s => { return { selector: s.selector, entrypoint: s.other } })
        }]
        const spec = {
            ...defaultSpec,
            "width": dimensions.useful_width,
            "height": dimensions.useful_height,
            "padding": {"bottom": display.viz.bottom_padding + display.viz.bottom_margin, "left": display.viz.horizontal_padding, "right": display.viz.horizontal_padding, "top": 10},
            "signals": [
                ...defaultSpec.signals,
                {
                    "name": "otherZoneSelected",
                    "value": false
                },
                {
                    "name": "zoneSelected",
                    "value": false,
                    "on": [
                        {
                            "events": {"signal": "domainY"},
                            "update": "domainX && domainY ? true : false"
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
                    "name": "cellwidth",
                    "update": "(width / length(data('categories')))"
                },
                {
                    "name": "cellheight",
                    "update": "(height / length(data('entities')))"
                }
            ],
            "data": singledata,
            "scales": [
                {
                    "name": "yscale",
                    "type": "band",
                    "range": [0, {"signal": "height"}],
                    "domain": {"data": "entities", "field": "entrypoint"}
                },
                {
                    "name": "xscale",
                    "type": "band",
                    "range": [0, {"signal": "width"}],
                    "domain": {"data": "entities", "field": "prop1"}
                },
                {
                    "name": "color",
                    "type": "ordinal",
                    "range": {"scheme": "category20"},
                    "domain": {"data": "entities", "field": "prop1"}
                }
            ],
            "axes": [
                {"orient": "bottom", "scale": "xscale", "ticks": false, "labels" : false},
                {"orient": "left", "scale": "yscale", "ticks": false, "labels" : false}
            ],
            "marks": [
                {
                    "type": "rule",
                    "name": "entitylinesH",
                    "from": {"data": "entities"},
                    "encode": {
                        "enter": {
                            "stroke": {"value": "#ddd"}
                        },
                        "update": {
                            "x": {"value": 0},
                            "y": {"scale": "yscale", "field": "entrypoint"},
                            "x2": {"signal": "width"},
                        }
                    }
                },
                {
                    "type": "rule",
                    "name": "entitylinesV",
                    "from": {"data": "entities"},
                    "encode": {
                        "enter": {
                            "stroke": {"value": "#ddd"}
                        },
                        "update": {
                            "y": {"value": 0},
                            "x": {"scale": "xscale", "field": "prop1", "offset": {"signal": "cellwidth - 1"}},
                            "y2": {"signal": "height"}
                        }
                    }
                },
                {
                    "type": "rect",
                    "name": "test",
                    "from": {"data": "entities"},
                    "encode": {
                        "enter": {
                            "opacity": [
                                {"value": 0.7}
                            ]
                        },
                        "update": {
                            "x": {
                                "scale": "xscale",
                                "field": "prop1",
                                "offset": [
                                    {"test": "cellwidth > 30 && cellheight > 30", "value": 2},
                                    {"test": "cellwidth > 8 && cellheight > 8", "value": 1},
                                    {"value": 0}
                                ]
                            },
                            "y": {
                                "scale": "yscale",
                                "field": "entrypoint",
                                "offset": [
                                    {"test": "cellwidth > 30 && cellheight > 30", "value": -2},
                                    {"test": "cellwidth > 8 && cellheight > 8", "value": -1},
                                    {"value": 0}
                                ]
                            },
                            "width": [
                                {"test": "cellwidth > 30 && cellheight > 30","signal": "cellwidth - 4"},
                                {"test": "cellwidth > 8 && cellheight > 8","signal": "cellwidth - 2"},
                                {"signal": "cellwidth"}
                            ],
                            "height": [
                                {"test": "cellwidth > 30 && cellheight > 30","signal": "cellheight - 4"},
                                {"test": "cellwidth > 8 && cellheight > 8","signal": "cellheight - 2"},
                                {"signal": "cellheight"}
                            ],
                            "fill": [
                                {"test": "otherZoneSelected || (zoneSelected && !indata('selections', 'entrypoint', datum.entrypoint))", "value": "#ccc"},
                                {"scale": "color", "field": "prop1"}
                            ]
                        }
                    }
                },
                {
                    "type": "text",
                    "from": {"data": "categories"},
                    "encode": {
                        "enter": {
                            "align": {"value": labelAlign},
                        },
                        "update": {
                            "angle": {"value":labelAngle},
                            "y": {"signal": "height + 10"},
                            "x": {"scale": "xscale", "field": "prop1", "offset": {"signal": "cellwidth / 2"}},
                            "text": {"field": "prop1"},
                            "fill": {"value": "#333333"}
                        }
                    }
                },
                {
                    "type": "text",
                    "from": {"data": "entities"},
                    "key": "entrypoint",
                    "name": "entitytext",
                    "encode": {
                        "enter": {
                            "align": {"value": "right"},
                        },
                        "update": {
                            "x": {"value": -3},
                            "y": {"scale": "yscale", "field": "entrypoint", "offset": {"signal": "cellheight / 2"}},
                            "text": {"field": "name"},
                            "fill": [
                                {"test": "otherZoneSelected || (zoneSelected && !indata('selections', 'entrypoint', datum.entrypoint))", "value": "#ccc"},
                                {"value": "#333"}
                            ],
                            "selected": [
                                {"test": "zoneSelected && inrange(item.y, domainY)", "value": true},
                                {"value": false}
                            ],
                            "limit": {"value": display.viz.horizontal_padding}
                        }
                    }
                },
                ...defaultSpec.marks
            ]
        }
        // console.log(singledata, spec)
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            spec,
            singledata
        }
    }
    getElementsForTransition () {
        // console.log("coucou single", this.customState.view.scenegraph().root.source.value)
        // console.log("coucou single prop", this.customState.view.scenegraph().root)
        let items = []
        if (this.customState.view.scenegraph() && this.customState.view.scenegraph().root.source.value[0]) {
            items = this.customState.view.scenegraph().root.source.value[0].items[4].items.map(el => {
                return { 
                    zone: {
                        x1: el.bounds.x1,
                        y1: el.bounds.y1,
                        x2: el.bounds.x2,
                        y2: el.bounds.y2,
                        width: el.bounds.x2 - el.bounds.x1,
                        height: el.bounds.y2 - el.bounds.y1
                    },
                    selector: `single_element_${makeId(el.datum.entrypoint)}`,
                    index: el.datum.index,
                    query: {
                        type: 'uri',
                        value: el.datum.entrypoint
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
    render () {
        const { dimensions, role, step } = this.props
       
        return (<div
            className = { `ListProp ${this.customState.elementName} role_${role}` } 
        >
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
    componentDidUpdate () {
        console.log(this.props.selections)
        if (this.customState.view) {
            this.props.handleTransition(this.props, this.getElementsForTransition())
            this.customState.view.run()
        }
    }
}

SingleProp.propTypes = {
    config: PropTypes.object,
    data: PropTypes.array,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    selections: PropTypes.array,
    role: PropTypes.string,
    step: PropTypes.string,
    zone: PropTypes.string,
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
        selectElements: selectElements(dispatch)
    }
}

const SinglePropConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(SingleProp)

export default SinglePropConnect
