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
import { getRelativeRectangle } from '../../lib/scaleLib'
// redux functions

class Timeline extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.getElementsInZone = this.getElementsInZone.bind(this)
        this.onToggleHover = this.onToggleHover.bind(this)
        this.onMouseClick = this.onMouseClick.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refGeoMap_${props.zone}`
        }
        this.prepareData(props)
    }
    onToggleHover (cursor, event) {
        event.target.getCanvas().style.cursor = cursor
    }
    onMouseClick (event) {
        console.log(event)
        if (event.features[0].properties.id) {
            console.log(event.features[0]._vectorTileFeature, event.point.x, event.point.y, event.lngLat.lat)
        } else {
            var features = this.map.state.map.queryRenderedFeatures(event.point, { layers: ['cluster_layer'] })
            var clusterId = features[0].properties.cluster_id,
                point_count = features[0].properties.point_count,
                clusterSource = this.map.state.map.getSource('source_id');

            // Get Next level cluster Children
            //
            clusterSource.getClusterChildren(clusterId, function(err, aFeatures){
                console.log('getClusterChildren', err, aFeatures);
            });

            // Get all points under a cluster
            clusterSource.getClusterLeaves(clusterId, point_count, 0, function(err, aFeatures){
                console.log('getClusterLeaves', err, aFeatures);
            })
        }

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
                <Map
                    ref={(e) => { this.map = e }}
                    style='mapbox://styles/mapbox/light-v9'
                    containerStyle={{
                        height: '100%',
                        width: '100%',
                        position: 'fixed'
                    }}
                    center={[0, 40]}
                    zoom={[1.2]}
                    onStyleLoad = { e => {
                        // c'est moche mais ça marche

                    } }
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
                        circleOnMouseEnter = { e => { this.onToggleHover('pointer', e) } }
                        circleOnMouseLeave = { e => { this.onToggleHover('', e) } }
                        circleOnClick = { e => { this.onMouseClick(e) } }
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
    getElementsForTransition () {
        let { display, dimensions, zone } = this.props
        let results = []
        let rendered = this.map && this.map.state.map && this.map.state.map.getLayer('cluster_layer') ? this.map.state.map.queryRenderedFeatures([[0, 0], [dimensions.useful_width, dimensions.useful_height]], { layers: ['cluster_layer'] }) : []
        // select all displayed features
        // results.push({ zone: d.zone, ...d.selection, color: d.color, opacity: d.opacity, shape: d.shape, rotation: 0 })
        console.log(rendered.map(el => {
            return el
        }))
        return results
    }
    getElementsInZone (props) {
        let { display, zone, zoneDimensions } = props
        let selectedElements = []
        let relativeZone = getRelativeRectangle(zoneDimensions, zone, display)
        /* d3.select(this.el).selectAll('.yUnits')
            .each(function (d, i) {
                if (detectRectCollision(relativeZone, d.zone)) selectedElements.push(d.selection)
            }) */
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
        let geodata = prepareGeoData(data, dataset)
        console.log(geodata.features.sort((a, b) => a.properties.title ? a.properties.title.localeCompare(b.properties.title) : 0 ))
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
        if (this.map && this.map.state.map) {
            this.map.state.map.on('load', (e) => {
                console.log('BRAVO', e)

            })
        }
        window.setTimeout(() => { this.props.handleTransition(this.props, this.getElementsForTransition()) }, 1000)
        // let elements = this.getElementsForTransition()
        //if (elements.length > 0) this.props.handleTransition(this.props, elements)
    }
    componentDidUpdate () {
        //let elements = this.getElementsForTransition()
        //if (elements.length > 0) this.props.handleTransition(this.props, elements)
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
