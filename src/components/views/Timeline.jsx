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
// redux functions

class Timeline extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.handleHover = this.handleHover.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refTimelineMap_${props.zone}`
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
        const { data, dataset, dimensions, role } = nextProps
        // prepare the data for display
        // const selectedConfig = getSelectedMatch(config, zone)
        // First prop
        // const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        console.log(data, role)
        const datatest = [{
            "name": "entities",
            "values": [{
                "prop2": "Washington",
                "prop1": -7506057600000,
            },
            {
                "prop2": "Adams",
                "prop1": -7389766800000,
                "died": -4528285200000,
                "enter": -5453884800000,
                "leave": -5327740800000
            },
            {
                "prop2": "Jefferson",
                "prop1": -7154586000000,
                "died": -4528285200000,
                "enter": -5327740800000,
                "leave": -5075280000000
            },
            {
                "prop2": "Madison",
                "prop1": -6904544400000,
                "died": -4213184400000,
                "enter": -5075280000000,
                "leave": -4822819200000
            },
            {
                "prop2": "Monroe",
                "prop1": -6679904400000,
                "died": -4370518800000,
                "enter": -4822819200000,
                "leave": -4570358400000
            }]
        }]
        const spec = {
            "$schema": "https://vega.github.io/schema/vega/v4.json",
            "width": dimensions.useful_width,
            "height": dimensions.useful_height,
            "padding": 5,

            "data": datatest,
            "scales": [{
                "name": "yscale",
                "type": "band",
                "range": [0, {"signal": "height"}],
                "domain": {"data": "entities", "field": "prop2"}
            },
            {
                "name": "xscale",
                "type": "time",
                "range": "width",
                "round": true,
                "domain": {"data": "entities", "fields": ["prop1", "died"]}
            }],
            "axes": [
                {"orient": "bottom", "scale": "xscale", "format": "%Y"}
            ],
            "marks": [{
                "type": "text",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "x": {"scale": "xscale", "field": "prop1"},
                        "y": {"scale": "yscale", "field": "prop2", "offset": -3},
                        "fill": {"value": "#000"},
                        "text": {"field": "prop2"},
                        "fontSize": {"value": 10}
                    }
                }
            },
            {
                "type": "line",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "x": {"scale": "xscale", "value": 0},
                        "x2": {"scale": "xscale", "value": dimensions.useful_width},
                        "y": {"scale": "yscale", "field": "label"},
                        "y2": {"scale": "yscale", "field": "label"},
                        "stroke": {"value": "#557"},
                        "strokeWidth": {"value": 1}
                    }
                }
            },
            {
                "type": "rect",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "x": {"scale": "xscale", "field": "enter"},
                        "x2": {"scale": "xscale", "field": "leave"},
                        "y": {"scale": "yscale", "field": "prop2", "offset":-1},
                        "height": {"value": 4},
                        "fill": {"value": "#e44"}
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
