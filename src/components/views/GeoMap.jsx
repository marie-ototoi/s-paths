import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
// components
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { prepareGeoData } from '../../lib/dataLib'
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'
// redux functions
// import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'
import ReactMapboxGl, { GeoJSONLayer, Layer, ZoomControl } from 'react-mapbox-gl'

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoibWFyaWVkZXN0YW5kYXUiLCJhIjoiY2ppb2E2Y3hlMG5xMzNrbzI3Ynk0MDlmaSJ9.XmflFu2QUBjFDVVWAKFBKQ",
    dragRotate: false
})

class GeoMap extends React.Component {
    constructor (props) {
        super(props)
        // this.selectElements = this.selectElements.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refGeoMap_${props.zone}`
        }
        this.prepareData(props)
    }
    render () {
        // console.log('salut GeoMap')
        const { dimensions, display, role, selections, step, zone } = this.props

        return (<g className = { `GeoMap ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { dimensions }
                layout = { this }
                selections = { selections }
            />
            }
            { step !== 'changing' && 
            <foreignObject
                transform = { `translate(${dimensions.x + dimensions.horizontal_padding}, ${dimensions.y + dimensions.top_padding})` }
                width = { dimensions.useful_width }
                height = { dimensions.useful_height }
                // TODO: These event handlers need another layer to perform mouse selection over the map
                // onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this, selections) } }
                // onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            >
                <Map
                    style = "mapbox://styles/mapbox/light-v9"
                    containerStyle = {{
                        height: '100%',
                        width: '100%' 
                    }}
                    center={[0, 40]}
                    zoom={[1.2]}
                >
                   
                    <GeoJSONLayer
                        id='source_id'
                        data={this.customState.geodata}
                        sourceOptions={{
                            cluster: true,
                            clusterMaxZoom: 14,
                            clusterRadius: 50
                        }}
                    />
                    <ZoomControl/>
                    <Layer
                        id = 'unclustered_layer'
                        sourceId = 'source_id'
                        layerOptions = {{
                            filter: ["!", ["has", "point_count"]]
                        }}
                        paint = {{
                            'circle-color': 'green',
                            'circle-radius': 10
                        }}
                        type = 'circle'
                    />
                    <Layer
                        id='cluster_layer'
                        sourceId='source_id'
                        layerOptions={{
                            filter: [
                                'has', 'point_count'
                            ]
                        }}
                        paint={{
                            'circle-color': {
                                property: 'point_count',
                                type: 'interval',
                                stops: [
                                    [0, '#51bbd6'],
                                    [100, '#f1f075'],
                                    [750, '#f28cb1']
                                ]
                            },
                            'circle-radius': {
                                property: 'point_count',
                                type: 'interval',
                                stops: [
                                    [0, 20],
                                    [100, 30],
                                    [750, 40]
                                ]
                            }
                        }}
                        type='circle'
                    />
                    <Layer
                        id='cluster_count'
                        sourceId='source_id'
                        layerOptions={{
                            filter: [
                                'has', 'point_count'
                            ]
                        }}
                        layout = {{
                            "text-field": "{point_count_abbreviated}",
                            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                            "text-size": 12
                        }}
                        type='symbol'
                    />
                   
                </Map>
            </foreignObject>
            }
        </g>)
    }
    getElementsInZone (zoneDimensions) {
        return []
    }
    shouldComponentUpdate (nextProps, nextState) {
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            this.prepareData(nextProps)
        }
        return (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) ||
            (JSON.stringify(this.props.selections) !== JSON.stringify(nextProps.selections)) ||
            (JSON.stringify(this.props.display) !== JSON.stringify(nextProps.display)) ||
            (this.props.step !== nextProps.step)
    }
    prepareData (nextProps) {
        const { config, data, dataset, zone } = nextProps
        // prepare the data for display
        // const selectedConfig = getSelectedMatch(config, zone)
        // First prop
        // const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        let geodata = prepareGeoData(data, dataset)
        // 
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            geodata
            //selectedConfig
        }
    }
    selectEnsemble (prop, value, category) {
        const elements = this.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections)
    }
    componentDidMount () {
        this.props.handleTransition(this.props, [])
    }
    componentDidUpdate () {
        this.props.handleTransition(this.props, [])
    }
}

GeoMap.propTypes = {
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

const GeoMapConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GeoMap)

export default GeoMapConnect
