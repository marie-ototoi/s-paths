import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';
import Vega from 'react-vega';
// components
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { prepareGeoData } from '../../lib/dataLib'
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'
import { getRelativeRectangle } from '../../lib/scaleLib'
// redux functions

class Pyramid extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.handleHover = this.handleHover.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refGeoMap_${props.zone}`
        }
        this.prepareData(props)
    }
    handleHover(...args) {
        console.log(args)
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
                transform = { `translate(${dimensions.x + dimensions.horizontal_padding}, ${dimensions.y + dimensions.top_padding})` }
                width = { dimensions.useful_width }
                height = { dimensions.useful_height }
            >
                <Vega
                    data = { this.customState.datatest }
                    spec = { this.customState.spec }
                    onSignalTooltip = { this.handleHover }
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
        const { data, dataset, role } = nextProps
        // prepare the data for display
        // const selectedConfig = getSelectedMatch(config, zone)
        // First prop
        // const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        console.log(data, role)
        const spec = {
            "$schema": "https://vega.github.io/schema/vega/v3.0.json",
            "width": 400,
            "height": 200,
            "padding": { left: 5, right: 5, top: 5, bottom: 5 },

            "data": [
                {
                    "name": "table",
                    "values": [
                        {"category": "A", "amount": 28},
                        {"category": "B", "amount": 55},
                        {"category": "C", "amount": 43},
                        {"category": "D", "amount": 91},
                        {"category": "E", "amount": 81},
                        {"category": "F", "amount": 53},
                        {"category": "G", "amount": 19},
                        {"category": "H", "amount": 87}
                    ]
                }
            ],
            "signals": [
                {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "rect:mouseover", "update": "datum"},
                        {"events": "rect:mouseout",  "update": "{}"}
                    ]
                }
            ],
            "scales": [
                {
                    "name": "xscale",
                    "type": "band",
                    "domain": {"data": "table", "field": "category"},
                    "range": "width"
                },
                {
                    "name": "yscale",
                    "domain": {"data": "table", "field": "amount"},
                    "nice": true,
                    "range": "height"
                }
            ],
            "axes": [
                { "orient": "bottom", "scale": "xscale" },
                { "orient": "left", "scale": "yscale" }
            ],
            "marks": [
                {
                    "type": "rect",
                    "from": {"data":"table"},
                    "encode": {
                        "enter": {
                            "x": {"scale": "xscale", "field": "category", "offset": 1},
                            "width": {"scale": "xscale", "band": 1, "offset": -1},
                            "y": {"scale": "yscale", "field": "amount"},
                            "y2": {"scale": "yscale", "value": 0}
                        },
                        "update": {
                            "fill": {"value": "steelblue"}
                        },
                        "hover": {
                            "fill": {"value": "red"}
                        }
                    }
                },
                {
                    "type": "text",
                    "encode": {
                        "enter": {
                            "align": {"value": "center"},
                            "baseline": {"value": "bottom"},
                            "fill": {"value": "#333"}
                        },
                        "update": {
                            "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                            "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                            "text": {"signal": "tooltip.amount"},
                            "fillOpacity": [
                                {"test": "datum === tooltip", "value": 0},
                                {"value": 1}
                            ]
                        }
                    }
                }
            ]
        }
        const datatest = {
            "name": "table",
            "values": [
                {"category": "A", "amount": 28},
                {"category": "B", "amount": 55},
                {"category": "C", "amount": 43},
                {"category": "D", "amount": 91},
                {"category": "E", "amount": 81},
                {"category": "F", "amount": 53},
                {"category": "G", "amount": 19},
                {"category": "H", "amount": 87}
            ]
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

Pyramid.propTypes = {
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

const PyramidConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Pyramid)

export default PyramidConnect
