import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
// components
import Coverage from '../elements/Coverage'
import Header from '../elements/Header'
import History from '../elements/History'
import Nav from '../elements/Nav'
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { prepareGeoData } from '../../lib/dataLib'
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'
// redux functions
// import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoibWFyaWVkZXN0YW5kYXUiLCJhIjoiY2ppb2E2Y3hlMG5xMzNrbzI3Ynk0MDlmaSJ9.XmflFu2QUBjFDVVWAKFBKQ"
})

class GeoMap extends React.Component {
    constructor (props) {
        super(props)
        // this.selectElements = this.selectElements.bind(this)
        this.customState = {
            // selectElements: this.selectElements,
            elementName: `refGeoMap_${props.zone}`
        }
    }
    render () {
        // console.log('salut GeoMap')
        const { config, dimensions, display, role, selections, step, zone } = this.props

        return (<g className = { `GeoMap ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseMove = { this.props.handleMouseMove }
                layout = { this }
                selections = { selections }
            />
            }
            { step !== 'changing' && 
            <foreignObject
                transform = { `translate(${dimensions.x}, ${dimensions.y})` }
                width = { dimensions.width }
                height = { dimensions.height }
                onMouseMove = { (e) => { this.props.handleMouseMove(e, zone) } }
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this, selections) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            >
                <Map
                    style="mapbox://styles/mapbox/light-v9"
                    containerStyle={{
                        height: '100%',
                        width: '100%' 
                    }}>
                    <Layer
                        type="symbol"
                        id="marker"
                        layout={{ "icon-image": "marker-15" }}>
                        <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
                        <Feature coordinates={[-1.5, 51.3233379650232]}/>
                    </Layer>
                </Map>
            </foreignObject>
            }
            { role !== 'target' &&
            <g>
                <Header
                    zone = { zone }
                    config = { config }
                    propsLists = { [] }
                />
                <History
                    zone = { zone }
                />
            </g>
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

const GeoMapConnect = connect(mapStateToProps, mapDispatchToProps)(GeoMap)

export default GeoMapConnect
