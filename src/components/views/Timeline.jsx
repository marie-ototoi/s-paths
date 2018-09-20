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
        const { config, data, dataset, display, dimensions, role, zone } = nextProps
        // prepare the data for display
        // const selectedConfig = getSelectedMatch(config, zone)
        // First prop
        // const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        console.log(data, role)
        const selectedConfig = getSelectedMatch(config, zone)
        const categoryProp2 = selectedConfig.properties[1].category
        
        const datatest = [{
            "name": "entities",
            "values": data.map(dp => {
                return {
                    "prop2": (categoryProp2 === 'uri') ? usePrefix(dp.prop2.value, dataset.prefixes) : dp.prop2.value,
                    "prop1": dp.prop1.value,
                    "prop1-2": undefined,
                    "prop1label": "date of birth: " + dp.prop1.value,
                    "name": (categoryProp2 === 'uri') ? usePrefix(dp.prop2.value, dataset.prefixes) : dp.prop2.value
                }
            })
        }]
        const spec = {
            "$schema": "https://vega.github.io/schema/vega/v4.json",
            "width": dimensions.useful_width,
            "height": dimensions.useful_height,
            "config": {
                "axisBand": {
                    "bandPosition": 1,
                    "tickExtra": true,
                    "tickOffset": 0
                }
            },
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
                "domain": {"data": "entities", "field": "prop1"}
            }],
            "axes": [
                {"orient": "bottom", "scale": "xscale", "format": "%Y"},
                {"orient": "left", "scale": "yscale", "ticks": false, "gridColor": "#fff"}
            ],
            "marks": [{
                "type": "symbol",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "xc": {"scale": "xscale", "field": "prop1"},
                        "yc": {"scale": "yscale", "field": "prop2", "offset": 5 + Math.floor(dimensions.useful_height / datatest[0].values.length / 2)},
                        "fill": {"value": "#557"},
                        "size": {"value": Math.floor(dimensions.useful_height / datatest[0].values.length) * 5},
                        "tooltip": {"field": "prop1label", "type": "nominal"}
                    }
                }
            },
            {
                "type": "symbol",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "xc": {"scale": "xscale", "field": "prop1-2"},
                        "yc": {"scale": "yscale", "field": "prop2", "offset": 5 + Math.floor(dimensions.useful_height / datatest[0].values.length / 2)},
                        "fill": {"value": "#f00"},
                        "size": {"value": Math.floor(dimensions.useful_height / datatest[0].values.length) * 5},
                    }
                }
            },
            {
                "type": "symbol",
                "from": {"data": "entities"},
                "encode": {
                    "enter": {
                        "xc": {"scale": "xscale", "field": "prop1-3"},
                        "yc": {"scale": "yscale", "field": "prop2", "offset": 5 + Math.floor(dimensions.useful_height / datatest[0].values.length / 2)},
                        "fill": {"value": "#00f"},
                        "size": {"value": Math.floor(dimensions.useful_height / datatest[0].values.length) * 2},
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
