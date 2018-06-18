import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import GeoMapLayout from '../../d3/GeoMapLayout'
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'

class GeoMap extends React.Component {
    constructor (props) {
        super(props)
        this.setLegend = this.setLegend.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.state = {
            setLegend: this.setLegend,
            selectElements: this.selectElements,
            elementName: `refGeoMap_${props.zone}`
        }
    }
    render () {
        // console.log('salut GeoMap')
        const { display, zone } = this.props
        const classN = `GeoMap `
        return (<g className = { classN } >
            <g
                transform = { `translate(${(display.zones[zone].x + display.viz.horizontal_margin)}, ${(display.zones[zone].y + display.viz.vertical_margin)})` }
                ref = {(c) => { this[this.state.elementName] = c }} >
            </g>
        </g>)
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
        //let details = prepareDetailData(data, dataset)
        // 

        // Save to reuse in render
        this.customState = {
            ...this.customState,
            //details,
            //selectedConfig
        }
    }
    selectEnsemble (prop, value, category) {
        const elements = this.layout.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections)
    }
    componentDidMount () {
        this.layout = new GeoMapLayout(this[this.state.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        this.layout.update(this[this.customState.elementName], { ...this.props, ...this.state })
    }
    componentWillUnmount () {
        this.layout.destroy(this[this.customState.elementName])
    }
}

GeoMap.propTypes = {
    display: PropTypes.object,
    selections: PropTypes.array,
    zone: PropTypes.string
}

function mapStateToProps (state) {
    return {
        display: state.display,
        data: state.data,
        palettes: state.palettes,
        selections: state.selections
    }
}

function mapDispatchToProps (dispatch) {
    return {
        getPropPalette: getPropPalette(dispatch)
    }
}

const GeoMapConnect = connect(mapStateToProps, mapDispatchToProps)(GeoMap)

export default GeoMapConnect
