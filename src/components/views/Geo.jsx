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
        let selected = this.customState.view.scenegraph().root.items[0].items[10].items.filter(it =>it.selected)
        // console.log('salut', selected)
        if (selected.length > 0) {
            selected = selected.map(el => {
                return {
                    selector: `geo_element_${dataLib.makeId(el.datum.entrypoint)}`,
                    index: el.datum.index,
                    query: {
                        type: 'uri',
                        value: el.datum.entrypoint
                    }
                }
            })
            selectElements(selected, zone, selections)
        } else {
            resetSelection(zone)
        }
    }
    handleNewView(args) {
        // console.log('view created', args.scenegraph())
        this.customState = {...this.customState, view: args, transitionSent: true}
        this.props.handleTransition(this.props, this.getElementsForTransition())
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
        // console.log(this.customState.view.scenegraph().root.source.value[0].items[10].items)
        return []
        /* let items = this.customState.view.scenegraph().root.source.value[0].items[10].items.map(el => {
            return { 
                zone: {
                    x1: el.x,
                    y1: el.y,
                    x2: el.x + 5,
                    y2: el.y + 5,
                    width: 5,
                    height: 5
                },
                selector: `timeline_element_${dataLib.makeId(el.datum.entrypoint)}`,
                index: el.datum.index,
                query: {
                    type: 'uri',
                    value: el.datum.entrypoint
                },
                color: el.stroke,
                opacity: el.opacity,
                shape: 'rectangle',
                rotation: 0
            }
        })
        // console.log(items)
        return items */
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
            "values": data.map((dp, i) => {
                let categoryProp2 = selectedConfig.properties[1].path
                //let legend = (categoryProp2 === 'uri') ? usePrefix(dp.prop2.value, dataset.prefixes) : dp.prop2.value
                let name = (selectedConfig.properties[1].level === 1 && selectedConfig.properties[1].property === 'http://www.w3.org/2000/01/rdf-schema#label') ? dp.prop2.value : usePrefix(dp.entrypoint.value, dataset.prefixes)
                return {
                    "prop1": dp.prop1.value,
                    "prop2": dp.prop2.value,
                    "prop1label": selectedConfig.properties[0].readablePath.map(p => p.label).join(' / * / ') ,
                    "prop2label": selectedConfig.properties[1].readablePath.map(p => p.label).join(' / * / ') ,
                    "entrypoint": dp.entrypoint.value,
                    "name": name,
                    "selected": false,
                    "index": i
                }
            })
        },
        {
            "name": "world",
            "url": "data/world-110m.json",
            "format": {"type": "topojson", "feature": "states"},
            "transform": [
                {
                    "type": "geopath",
                    "projection": "projection"
                }
            ]
        },
        {
            "name": "states",
            "url": "data/world-110m.json",
            "format": {"type": "topojson", "feature": "countries"},
            "transform": [
                {
                    "type": "geopath",
                    "projection": "projection"
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
                    "name": "hover",
                    "value": null,
                    "on": [
                        {"events": "@cell:mouseover", "update": "datum"},
                        {"events": "@cell:mouseout", "update": "null"}
                    ]
                },
                {
                    "name": "title",
                    "value": "U.S. Airports, 2008",
                    "update": "hover ? hover.name + ' (' + hover.iata + ')' : 'U.S. Airports, 2008'"
                },
                {
                    "name": "cell_stroke",
                    "value": null,
                    "on": [
                        {"events": "dblclick", "update": "cell_stroke ? null : 'brown'"},
                        {"events": "mousedown!", "update": "cell_stroke"}
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
                    "from": {"data": "states"},
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
