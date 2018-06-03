import PropTypes from 'prop-types'
import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
// components
import Coverage from '../elements/Coverage'
import Header from '../elements/Header'
import History from '../elements/History'
import Legend from '../elements/Legend'
import Nav from '../elements/Nav'
import SelectionZone from '../elements/SelectionZone'
// d3
import URIWheelLayout from '../../d3/URIWheelLayout'
// libs
import { getPropsLists, getSelectedConfig } from '../../lib/configLib'
import { deduplicate, nestData } from '../../lib/dataLib'
import * as scaleLib from '../../lib/scaleLib'
// redux functions
import { setUnitDimensions } from '../../actions/dataActions'
import { getPropPalette } from '../../actions/palettesActions'
import { select, handleMouseDown, handleMouseMove, handleMouseUp } from '../../actions/selectionActions'

class URIWheel extends React.Component {
    constructor (props) {
        super(props)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.selectElement = this.selectElement.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.customState = {
            elementName: `refURIWheel_${props.zone}`,
            selectElement: this.selectElement,
            selectElements: this.selectElements,
            handleMouseUp: this.handleMouseUp
        }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        if (!shallowEqual(this.props, nextProps)) {
            this.prepareData(nextProps)
        }
        return !shallowEqual(this.props, nextProps)
    }
    prepareData (nextProps) {
        const { config, data, dataset, getPropPalette, palettes, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedConfig(config, zone)
        // First prop
        const nestedProp1 = nestData(deduplicate(data, ['prop1']), [{
            propName: 'prop1',
            category: 'text'
        }])

        const propsLists = getPropsLists(config, zone, dataset)

        const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)

        const displayedInstances = nestedProp1.reduce((acc, cur) => {
            cur.values.forEach(val => {
                acc += Number(val.countprop1.value)
            })
            return acc
        }, 0)
        // console.log(nestedProp1)
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            color,
            displayedInstances,
            selectedConfig,
            nestedProp1,
            propsLists
        }
    }

    handleMouseDown (e) {
        const { display, zone } = this.props
        this.props.handleMouseDown(e, zone, scaleLib.getZoneCoord(zone, display.mode, display.zonesDefPercent, display.screen))
    }
    handleMouseMove (e) {
        const { display, zone } = this.props
        if (display.selectedZone[zone].x1 !== null) this.props.handleMouseMove(e, zone, scaleLib.getZoneCoord(zone, display.mode, display.zonesDefPercent, display.screen))
    }
    handleMouseUp (e) {
        const { selections, zone } = this.props
        const elements = this.layout.getElementsInZone(this.props)
        if (elements.length > 0) this.props.select(elements, zone, selections)
        this.props.handleMouseUp(e, zone)
    }
    render () {
        const { legend, propsLists } = this.customState
        const { config, dimensions, display, role, selections, step, zone } = this.props
        return (<g className = { `URIWheel ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseDown = { this.handleMouseDown }
                handleMouseMove = { this.handleMouseMove }
                handleMouseUp = { this.handleMouseUp }
            />
            }
            { step !== 'changing' &&
            <g
                transform = { `translate(${dimensions.x}, ${dimensions.y})` }
                ref = {(c) => { this[this.customState.elementName] = c }}
                onMouseMove = { this.handleMouseMove }
                onMouseUp = { this.handleMouseUp }
                onMouseDown = { this.handleMouseDown }
            ></g>
            }
            { role !== 'target' &&
            <g>
                <Header
                    zone = { zone }
                />
                <Coverage
                    zone = { zone }
                    displayedInstances = { this.customState.displayedInstances } // to be fixed - works only for unit displays
                    selectedInstances = { selections.reduce((acc, cur) => {
                        acc += Number(cur.count)
                        return acc
                    }, 0) }
                    selections = { selections }
                    config = { config }
                />
                <Nav
                    zone = { zone }
                    config = { config }
                    propsLists = { propsLists }
                />
                <Legend
                    type = "plain"
                    zone = { zone }
                    offset = { { x: 10, y: 0, width: -20, height: -30 } }
                    legend = { legend }
                    selectElements = { this.selectElements }
                />
                <History
                    zone = { zone }
                />
            </g>
            }
        </g>)
    }

    selectElements (prop, value, category) {
        const elements = this.layout.getElements(this[this.customState.elementName], prop, value, category)
        // console.log(prop, value, elements, category)
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }

    selectElement (selection) {
        const { select, zone, selections } = this.props
        select([selection], zone, selections)
    }

    componentDidMount () {
        this.layout = new URIWheelLayout(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        this.layout.update(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        this.layout.destroy(this[this.customState.elementName])
    }
}

URIWheel.propTypes = {
    config: PropTypes.object,
    data: PropTypes.array,
    dimensions: PropTypes.array,
    display: PropTypes.object,
    selections: PropTypes.array,
    role: PropTypes.string,
    step: PropTypes.string,
    zone: PropTypes.string,
    handleKeyDown: PropTypes.func,
    handleMouseDown: PropTypes.func,
    handleMouseMove: PropTypes.func,
    handleMouseUp: PropTypes.func,
    select: PropTypes.func
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
        handleMouseMove: handleMouseMove(dispatch),
        select: select(dispatch),
        setUnitDimensions: setUnitDimensions(dispatch)
    }
}

const URIWheelConnect = connect(mapStateToProps, mapDispatchToProps)(URIWheel)

export default URIWheelConnect
