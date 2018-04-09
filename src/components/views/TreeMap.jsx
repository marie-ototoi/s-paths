import React from 'react'
import * as d3 from 'd3'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
// components
import Coverage from '../elements/Coverage'
import Header from '../elements/Header'
import History from '../elements/History'
import Legend from '../elements/Legend'
import Nav from '../elements/Nav'
import PropSelector from '../elements/PropSelector'
import SelectionZone from '../elements/SelectionZone'
// d3
import d3TreeMap from '../../d3/d3TreeMap'
// libs
import { getPropsLists, getSelectedConfig } from '../../lib/configLib'
import { deduplicate, getAxis, getLegend, getThresholdsForLegend, groupTextData, groupTimeData } from '../../lib/dataLib'
import { getQuantitativeColors } from '../../lib/paletteLib'
import scaleLib, { getDimensions } from '../../lib/scaleLib'
// redux functions
import { setUnitDimensions } from '../../actions/dataActions'
import { getPropPalette } from '../../actions/palettesActions'
import { select, handleMouseDown, handleMouseMove, handleMouseUp } from '../../actions/selectionActions'

class TreeMap extends React.Component {
    constructor (props) {
        super(props)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.selectElement = this.selectElement.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.customState = {
            elementName: `TreeMap_${props.zone}`,
            selectElement: this.selectElement,
            selectElements: this.selectElements,
            handleMouseUp: this.handleMouseUp
        }
    }

    componentWillMount () {
        this.prepareData(this.props)
    }
    componentWillUpdate (nextProps, nextState) {
        if (!shallowEqual(this.props, nextProps)) {
            this.prepareData(nextProps)
        }
    }
    shouldComponentUpdate (nextProps, nextState) {
        return !shallowEqual(this.props, nextProps)
    }

    prepareData (nextProps) {
        const { config, configs, coverage, data, dataset, display, getPropPalette, palettes, role, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedConfig(config, zone)

        let nestedCoverage1
        // console.log(display.unitDimensions[zone][role])
        if (display.unitDimensions[zone][role] &&
            display.unitDimensions[zone][role].nestedCoverage1) {
            nestedCoverage1 = display.unitDimensions[zone][role].nestedCoverage1
        } else {
            nestedCoverage1 = groupTextData(deduplicate(coverage, ['prop1']), 'prop1', {
                order: 'size'
            })
            this.props.setUnitDimensions({ nestedCoverage1 }, zone, config.id, role, (configs.past.length === 1))
        }

        // First prop 
        const nestedProp1 = groupTextData(deduplicate(data, ['prop1']), 'prop1', {
            order: 'size'
        })
        // console.log('oo', data, nestedProp1)

        const propsLists = getPropsLists(config, zone, dataset.labels)

        const displayedInstances = nestedProp1.reduce((acc, cur) => {
            //if (cur.values.length > 0 && cur.values[0].countprop1) acc += Number(cur.values[0].countprop1.value)
            cur.values.forEach(val => {
                acc += Number(val.countprop1.value)
            })
            
            return acc
        }, 0)
        // console.log(nestedProp1)
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            displayedInstances,
            selectedConfig,
            nestedCoverage1,
            nestedProp1,
            //legend,
            //nestedProp2,
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
        const elements = d3TreeMap.getElementsInZone(this.refs.TreeMap, this.props)
        if (elements.length > 0) this.props.select(elements, zone, selections)
        this.props.handleMouseUp(e, zone)
    }
    render () {
        const { legend, propsLists } = this.customState
        const { data, config, display, role, selections, step, zone } = this.props
        const coreDimensions = getDimensions('core', display.zones[zone], display.viz)
        return (<g className = { `TreeMap ${this.customState.elementName} role_${role}` } >
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseDown = { this.handleMouseDown }
                handleMouseMove = { this.handleMouseMove }
                handleMouseUp = { this.handleMouseUp }
            />
            { step !== 'changing' &&
            <g
                transform = { `translate(${coreDimensions.x}, ${coreDimensions.y})` }
                ref = "TreeMap"
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
                <PropSelector
                    selected = { false }
                    key = { zone + '_propselector_31' }
                    propList = { propsLists[0] }
                    config = { config }
                    align = "right"
                    dimensions = { getDimensions('legendAxisBottom', display.zones[zone], display.viz, { x: 0, y: -15, width: -35, height: 0 }) }
                    propIndex = { 0 }
                    zone = { zone }
                />
                <History
                    zone = { zone }
                />
            </g>
            }
        </g>)
    }

    selectElements (prop, value, category) {
        const elements = d3TreeMap.getElements(this.refs.TreeMap, prop, value, category)
        // console.log(prop, value, elements, category)
        const { select, zone, selections } = this.props
        select(elements, zone, selections)
    }
    selectElement (selection) {
        const { select, zone, selections } = this.props
        select([selection], zone, selections)
    }

    componentDidMount () {
        d3TreeMap.create(this.refs.TreeMap, { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        d3TreeMap.update(this.refs.TreeMap, { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        d3TreeMap.destroy(this.refs.TreeMap, { ...this.props, ...this.customState })
    }
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

const TreeMapConnect = connect(mapStateToProps, mapDispatchToProps)(TreeMap)

export default TreeMapConnect
