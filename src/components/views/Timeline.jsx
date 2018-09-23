import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Vega from 'react-vega';
// components
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'
import { getRelativeRectangle } from '../../lib/scaleLib'
import { getSelectedMatch } from '../../lib/configLib'
import { usePrefix } from '../../lib/queryLib'
// redux functions

class Timeline extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleNewView = this.handleNewView.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refTimelineMap_${props.zone}`
        }
        this.prepareData(props)
    }
    handleSelect(...args) {
        console.log('yes we can', args, this.customState.view.scenegraph().root.items[0].items[9].items)
    }
    handleNewView(args) {
        console.log('yes we can', args.scenegraph())
        this.customState = {...this.customState, view: args}
    }
    render () {
        const { dimensions, role, selections, step, zone } = this.props

        return (<g
            className = { `GeoMap ${this.customState.elementName} role_${role}` } >
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
                <Vega
                    spec = { this.customState.spec }
                    onSignalDomain = { this.handleSelect }
                    onSignalSelectedElements = { this.handleSelect }
                    onNewView = { this.handleNewView }
                />
            </foreignObject>
            }
        </g>)
    }
    getElementsForTransition () {
        let { display, dimensions, zone } = this.props
        let results = []
        return results
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
        return (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) ||
            (JSON.stringify(this.props.selections) !== JSON.stringify(nextProps.selections)) ||
            (JSON.stringify(this.props.display) !== JSON.stringify(nextProps.display)) ||
            (this.props.step !== nextProps.step)
    }
    prepareData (nextProps) {
        const { config, data, dataset, display, dimensions, getPropPalette, palettes, role, zone } = nextProps
        // prepare the data for display
        // const selectedConfig = getSelectedMatch(config, zone)
        // First prop
        // const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        console.log(data, role)
        const selectedConfig = getSelectedMatch(config, zone)
        const pathProp1 = selectedConfig.properties[0].path
        const colors = getPropPalette(palettes, pathProp1, 1)
        console.log(colors)
        const datatest = [{
            "name": "entities",
            "values": data.map(dp => {
                let categoryProp2 = selectedConfig.properties[1].path
                //let legend = (categoryProp2 === 'uri') ? usePrefix(dp.prop2.value, dataset.prefixes) : dp.prop2.value
                let name = (selectedConfig.properties[1].level === 1 && selectedConfig.properties[1].property === 'http://www.w3.org/2000/01/rdf-schema#label') ? dp.prop2.value : usePrefix(dp.entrypoint.value, dataset.prefixes)
                return {
                    "prop1": new Date(dp.prop1.value).getTime(),
                    "prop2": (categoryProp2 === 'uri') ? usePrefix(dp.prop2.value, dataset.prefixes) : dp.prop2.value,
                    "prop12": undefined,
                    "prop1label": selectedConfig.properties[1].readablePath.map(p => p.label).join(' / * / ') ,
                    "entrypoint": name
                }
            })
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
                    "name": "clear", "value": true,
                    "on": [
                        {
                            "events": "mouseup[!event.item]",
                            "update": "true",
                            "force": true
                        }
                    ]
                },
                {
                    "name": "brush", "value": 0,
                    "on": [
                        {
                            "events": {"signal": "clear"},
                            "update": "clear ? [0, 0] : brush"
                        },
                        {
                            "events": "@xaxis:mousedown",
                            "update": "[x(), x()]"
                        },
                        {
                            "events": "[@xaxis:mousedown, window:mouseup] > window:mousemove!",
                            "update": "[brush[0], clamp(x(), 0, width)]"
                        },
                        {
                            "events": {"signal": "delta"},
                            "update": "clampRange([anchor[0] + delta, anchor[1] + delta], 0, width)"
                        }
                    ]
                },
                {
                    "name": "zone", "value": 0,
                    "on": [
                        {
                            "events": {"signal": "clear"},
                            "update": "clear ? [0, 0, 0, 0] : brush"
                        },
                        {
                            "events": "@xaxis:mousedown",
                            "update": "[x(), x()]"
                        },
                        {
                            "events": "[@xaxis:mousedown, window:mouseup] > window:mousemove!",
                            "update": "[brush[0], clamp(x(), 0, width)]"
                        },
                        {
                            "events": {"signal": "delta"},
                            "update": "clampRange([anchor[0] + delta, anchor[1] + delta], 0, width)"
                        }
                    ]
                },
                {
                    "name": "anchor", "value": null,
                    "on": [{"events": "@brush:mousedown", "update": "slice(brush)"}]
                },
                {
                    "name": "xdown", "value": 0,
                    "on": [{"events": "@brush:mousedown", "update": "x()"}]
                },
                {
                    "name": "delta", "value": 0,
                    "on": [
                        {
                            "events": "[@brush:mousedown, window:mouseup] > window:mousemove!",
                            "update": "x() - xdown"
                        }
                    ]
                },
                {
                    "name": "domain",
                    "on": [
                        {
                            "events": {"signal": "brush"},
                            "update": "span(brush) ? invert('xscale', brush) : null"
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
                "name": "xaxis",
                "interactive": true,
                "encode": {
                    "enter": {
                        "x": {"value": 0},
                        "height": {"value": 35},
                        "fill": {"value": "transparent"},
                        "cursor": {"value": "ew-resize"}
                    },
                    "update": {
                        "y": {"signal": "height"},
                        "width": {"signal": "span(range('xscale'))"}
                    }
                }
            },
            {
                "type": "rect",
                "interactive": false,
                "encode": {
                    "enter": {
                        "y": {"value": 0},
                        "height": {"signal":"height"},
                        "fill": {"value": "#ddd"}
                    },
                    "update": {
                        "x": {"signal": "brush[0]"},
                        "x2": {"signal": "brush[1]"},
                        "fillOpacity": {"signal": "domain ? 0.2 : 0"}
                    }
                }
            },
            {
                "type": "rect",
                "name": "brush",
                "encode": {
                    "enter": {
                        "y": {"value": 0},
                        "height": {"signal":"height"},
                        "fill": {"value": "transparent"}
                    },
                    "update": {
                        "x": {"signal": "brush[0]"},
                        "x2": {"signal": "brush[1]"}
                    }
                }
            },
            {
                "type": "rect",
                "interactive": false,
                "encode": {
                    "enter": {
                        "y": {"value": 0},
                        "height": {"signal": "height"},
                        "width": {"value": 1},
                        "fill": {"value": "firebrick"}
                    },
                    "update": {
                        "fillOpacity": {"signal": "domain ? 1 : 0"},
                        "x": {"signal": "brush[0]"}
                    }
                }
            },
            {
                "type": "rect",
                "interactive": false,
                "encode": {
                    "enter":{
                        "y": {"value": 0},
                        "height": {"signal": "height"},
                        "width": {"value": 1},
                        "fill": {"value": "firebrick"}
                    },
                    "update": {
                        "fillOpacity": {"signal": "domain ? 1 : 0"},
                        "x": {"signal": "brush[1]"}
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
                        "fill": {"value": "#333"},
                        "limit": {"value": display.viz.horizontal_padding}
                    }
                }
            },
            {
                "type": "symbol",
                "name": "test",
                "from": {"data": "entities"},
                "encode": {
                    "update": {
                        "xc": {"scale": "xscale", "field": "prop1"},
                        "yc": {"scale": "yscale", "field": "entrypoint"},
                        "size": {"value": 100},
                        "strokeWidth": {"value": 2},
                        "opacity": [
                            {"test": "(!domain || inrange(datum.prop1, domain))", "value": 0.7},
                            {"value": 0.15}
                        ],
                        "stroke": [
                            {"test": "(!domain || inrange(datum.prop1, domain))", "scale": "color", "field": "prop2"},
                            {"value": "#ccc"}
                        ],
                        "selected": [
                            {"test": "(!domain || inrange(datum.prop1, domain))", "value": true},
                            {"value": false}
                        ],
                        "fill": {"value": "transparent"}
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
    selectEnsemble (prop, value, category) {
        const elements = this.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections)
    }
    componentDidMount () {
        // let elements =
        this.props.handleTransition(this.props, this.getElementsForTransition())
    }
    componentDidUpdate () {
        //let elements = this.getElementsForTransition()
        this.props.handleTransition(this.props, this.getElementsForTransition())
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
        selectElements: selectElements(dispatch)
    }
}

const TimelineConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Timeline)

export default TimelineConnect
