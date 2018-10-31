import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Vega from 'react-vega'
import * as vega from 'vega-lib'
// components
// d3

// libs
import { getSelectedMatch } from '../../lib/configLib'
import defaultSpec from '../../lib/spec'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'
import { prepareInfoCardData } from '../../lib/dataLib'

import './infocard.css'

class InfoCard extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.selectEnsemble = this.selectEnsemble.bind(this)
        this.customState = {
            elementName: `refListProp_${props.zone}`
        }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        let dataChanged = (this.props.data.length !== nextProps.data.length ||
            (this.props.data[0] && nextProps.data[0] && this.props.data[0].prop1.value !== nextProps.data[0].prop1.value))
        let selectionChanged = this.props.selections.length !== nextProps.selections.length
        let dimensionsChanged = this.props.dimensions.width !== nextProps.dimensions.width ||
            this.props.dimensions.height !== nextProps.dimensions.height || 
            this.props.display.selectedZone[this.props.zone].x1 !== nextProps.display.selectedZone[this.props.zone].x1 ||
            this.props.display.selectedZone[this.props.zone].x2 !== nextProps.display.selectedZone[this.props.zone].x2 ||
            this.props.display.selectedZone[this.props.zone].y1 !== nextProps.display.selectedZone[this.props.zone].y1 ||
            this.props.display.selectedZone[this.props.zone].y2 !== nextProps.display.selectedZone[this.props.zone].y2
        if (dataChanged) {
            this.prepareData(nextProps)
        }
        return dataChanged ||
            selectionChanged ||
            dimensionsChanged ||
            this.props.step !== nextProps.step
    }
    prepareData (nextProps) {
        const { config, data, dataset, dimensions, selections, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
        // First prop
        let infoCardData = prepareInfoCardData(data, dataset)
        
        let geodata = {
            type: 'FeatureCollection',
            features: infoCardData.geolong.map((info, i) => {
                return {
                    type: 'Feature', 
                    properties: {
                        lat:  Number(infoCardData.geolat[i].values['prop'+ info.level].value),
                        long:  Number(info.values['prop'+ info.level].value),
                        label: info.readablePath.map((rp, rpi) => rp.label).join(' / ')
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [Number(info.values['prop'+ info.level].value),  Number(infoCardData.geolat[i].values['prop'+ info.level].value), 0] 
                    }
                }
            })
        }
        let geoWidth = Math.floor(dimensions.useful_width * 0.48) - 40
        let geospec = {
            ...defaultSpec,
            "width": geoWidth,
            "height": 200,
            "signals": [
                {
                    "name": "extent",
                    "value": [[50,50], [geoWidth - 50, 150]],
                    "on": [{
                        "events": {"type": "wheel", "consume": true},
                        "update": "[[extent[0][0] * pow(1.0005, -event.deltaX * pow(16, event.deltaMode)), extent[0][1] * pow(1.0005, event.deltaY * pow(16, event.deltaMode))], [extent[1][0] * pow(1.0005, -event.deltaX * pow(16, event.deltaMode)), extent[1][1] * pow(1.0005, -event.deltaY * pow(16, event.deltaMode))]]"
                    }]
                },
                {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "@singlepoints:mouseover", "update": "datum"},
                        {"events": "@singlepoints:mouseout",  "update": "{}"}
                    ]
                }
            ],
            "data": [{
                "name": "entities",
                "values": geodata,
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
            }],
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
                }
            ],
            "projections": [
                {
                    "name": "projection",
                    "type": "mercator",
                    "fit": geodata,
                    "extent": {"signal": "extent"}
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
                            "opacity": {"value": 1},
                            "fill":  {"value": "#604f9f"}
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
                    "type": "text",
                    "encode": {
                        "enter": {
                            "baseline": {"value": "bottom"}
                        },
                        "update": {
                            "align": [
                                {"value": "left"}
                            ],
                            "x": {"value": 10},
                            "y": {"value": 200},
                            "text": {"signal": "tooltip.properties.label"},
                            "fillOpacity": [
                                {"test": "datum === tooltip", "value": 0},
                                {"value": 1}
                            ]
                        }
                    }
                }
            ]
        }
        let pastEvents = []
        let events = infoCardData.datetime.map((info, i) => {
            let theDate =  new Date(info.values['prop'+ info.level].value).getTime()
            let offset = pastEvents.filter(e => e === theDate).length
            pastEvents.push(theDate)
            return {
                index: i,
                offset: -10 * offset,
                label:  info.readablePath.map((rp, rpi) => rp.label).join(' / '),
                date:theDate
            }            
        })
        //console.log('||||||||||',events)
        let timeWidth = infoCardData.image.length > 0 ?  Math.floor(dimensions.useful_width * 0.48 * 0.75) - 40 :  Math.floor(dimensions.useful_width * 0.48) - 40
        
        let timespec = {
            ...defaultSpec,
            "width": timeWidth,
            "height": 100,
            "padding": {"bottom": 50},
            "signals": [
                {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "symbol:mouseover", "update": "datum"},
                        {"events": "symbol:mouseout",  "update": "{}"}
                    ]
                }
            ],
            "data": [{
                "name": "events",
                "values": events
            }],
            "scales": [{
                "name": "yscale",
                "type": "band",
                "range": [0, {"signal": "height"}],
                "domain": {"data": "events", "field": "label"}
            },
            {
                "name": "xscale",
                "type": "time",
                "range": [10, {"signal": "width - 10"}],
                "domain": {"data": "events", "field": "date"}
            }],
            "axes": [
                {"orient": "bottom", "scale": "xscale", "format": "%Y", "labelOverlap": "false"},
                {"orient": "left", "scale": "yscale", "ticks": false, "labels": false, "domainColor": "#fff"}
            ],
            "marks": [
              
                {
                    "type": "symbol",
                    "name": "test",
                    "from": {"data": "events"},
                    "encode": {
                        "enter": {
                            "size": {"value": 60},
                            "opacity": [
                                {"value": 0.8}
                            ]
                        },
                        "update": {
                            "xc": {"scale": "xscale", "field": "date"},
                            "yc": {"value": 70, "offset" : "datum.offset"},
                            "fill": {"value": "#d71fa5"},
                            "stroke":{"value": "#fff"}
                        }
                    }
                },
                {
                    "type": "text",
                    "encode": {
                        "enter": {
                            "baseline": {"value": "bottom"}
                        },
                        "update": {
                            "align": [
                                {"value": "left"}
                            ],
                            "x": {"value": 10},
                            "y": {"value": 100},
                            "text": {"signal": "tooltip.label"},
                            "fillOpacity": [
                                {"test": "datum === tooltip", "value": 0},
                                {"value": 1}
                            ]
                        }
                    }
                }
            ]
        }
        // console.log(timespec)
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            infoCardData,
            geospec,
            timespec,
            selectedConfig
        }
    }
    selectEnsemble (prop, value, category) {
        const elements = this.layout.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections)
    }
    getElementsInZone (zoneDimensions) {
        return []
    }
    render () {
        const { dimensions, display, data, role, selections, step, zone } = this.props
        const { uniqueData } = this.customState
        //console.log(this.customState.geospec)
        //console.log(JSON.stringify(this.customState.geospec))
        return (<div
            className = { `InfoCard ${this.customState.elementName} role_${role}` } >
            { step !== 'changing' && data && 
            <div
                style = {{ 
                    position: 'relative',
                    left : `${dimensions.x + display.viz.horizontal_padding}px`,
                    top: `${dimensions.y + dimensions.top_padding}px`,
                    width: `${dimensions.useful_width}px`
                }}
            >
                <div className = "box" style = {{ width: dimensions.useful_width + 'px' }}>
                    <div className = "content" style = {{maxHeight: `${dimensions.useful_height}px`}}>
                        { this.customState.infoCardData.text.length > 0 &&
                            <div className = "textBox">
                                { this.customState.infoCardData.text.map((info, i) => 
                                    <p key={`InfoCardtext${i}`}><strong>{
                                        info.readablePath.map((rp, rpi) => (<span key={`infotext${i}p${rpi}`} title={rp.comment}>{rp.label}{rpi < info.readablePath.length ? ' / ' : ''}</span>))
                                    }: </strong>{info.values['prop'+ info.level].value}</p>
                                )}
                            </div>
                        }
                        <div className = "sideBox">
                            { this.customState.infoCardData.image.length > 0 &&
                                <div className = "imageBox">
                                    {
                                        this.customState.infoCardData.image.map((info, i) => 
                                            (<img
                                                key={`infoimage${i}`}
                                                src={info.values['prop'+ info.level].value}
                                                title={
                                                    info.readablePath.map((rp, rpi) => rp.label).join(' / ')
                                                }
                                                style={{ maxHeight: '150px' }}
                                            />)
                                        )
                                    }
                                </div>
                            }
                            { this.customState.infoCardData.datetime.length > 0 &&
                            <div className = "datetimeBox">
                                <Vega
                                    spec = { this.customState.timespec }
                                />
                            </div>
                            }
                            { this.customState.infoCardData.geo.length > 0 &&
                            <div className = "geoBox">
                                <Vega
                                    spec = { this.customState.geospec }
                                />
                            </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>)
    }
    getElementsForTransition () {
        const { zone } = this.props
        /*return this.customState.uniqueData.map((el, index) => {
            return { 
                zone: {
                    x1: 0,
                    y1: 0,
                    x2: 10,
                    y2: 10,
                    width: 10,
                    height: 10
                },
                selector:`img_${zone}_${index}`,
                index: index,
                query: {
                    type: 'uri',
                    value: el.entrypoint.value
                },
                color: "#666",
                opacity: el.opacity,
                shape: 'rectangle',
                rotation: 0
            }
        })*/
        return []
    }
    componentDidMount () {
        this.props.handleTransition(this.props, this.getElementsForTransition())
    }
    componentDidUpdate () {
        this.props.handleTransition(this.props, this.getElementsForTransition())
    }
}

InfoCard.propTypes = {
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

const InfoCardConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(InfoCard)

export default InfoCardConnect
