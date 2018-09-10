import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
// components
// import SelectionZone from '../elements/SelectionZone'
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
    static onToggleHover (cursor, event) {
        event.target.getCanvas().style.cursor = cursor
    }
    static onMouseClick (event) {
        console.log(event.point.x, event.point.y, event.lngLat.lat)
    }
    render () {
        const { dimensions, role, step } = this.props

        return (<g className = { `GeoMap ${this.customState.elementName} role_${role}` } >
            { step !== 'changing' &&
            <foreignObject
                transform={ `translate(${dimensions.x + dimensions.horizontal_padding}, ${dimensions.y + dimensions.top_padding})` }
                width={ dimensions.useful_width }
                height={ dimensions.useful_height }
            >
                <Map
                    style='mapbox://styles/mapbox/light-v9'
                    containerStyle={{
                        height: '100%',
                        width: '100%',
                        position: 'fixed'
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
                        symbolLayout={{
                            'text-field': '{title}',
                            'text-offset': [0, 0.6],
                            'text-anchor': 'top'
                        }}
                        circlePaint={{
                            'circle-color': 'green',
                            'circle-radius': 6
                        }}
                        circleOnMouseEnter={GeoMap.onToggleHover.bind(this, 'pointer')}
                        circleOnMouseLeave={GeoMap.onToggleHover.bind(this, '')}
                        circleOnClick={GeoMap.onMouseClick.bind(this)}
                    />
                    <Layer
                        id='cluster_layer'
                        sourceId='source_id'
                        layerOptions={{
                            filter: ['has', 'point_count']
                        }}
                        paint={{
                            'circle-color': {
                                property: 'point_count',
                                type: 'interval',
                                stops: [
                                    [0, '#51bbd6'],
                                    [10, '#f1f075'],
                                    [750, '#f28cb1']
                                ]
                            },
                            'circle-radius': {
                                property: 'point_count',
                                type: 'interval',
                                stops: [
                                    [0, 20],
                                    [10, 30],
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
                            filter: ['has', 'point_count']
                        }}
                        layout={{
                            'text-field': '{point_count_abbreviated}',
                            'text-size': 12
                        }}
                        type='symbol'
                    />
                    <ZoomControl/>
                </Map>
            </foreignObject>
            }
        </g>)
    }
    getElementsInZone () {
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
        const { data, dataset } = nextProps
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

const GeoMapConnect = connect(mapStateToProps, mapDispatchToProps)(GeoMap)

export default GeoMapConnect
