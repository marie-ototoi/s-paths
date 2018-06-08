import PropTypes from 'prop-types'
import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
// components
import Coverage from '../elements/Coverage'
import Header from '../elements/Header'
import History from '../elements/History'
import Nav from '../elements/Nav'
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { getPropsLists, getSelectedMatch } from '../../lib/configLib'
import { prepareSinglePropData } from '../../lib/dataLib'
import * as scaleLib from '../../lib/scaleLib'

// redux functions
import { setUnitDimensions } from '../../actions/dataActions'
import { getPropPalette } from '../../actions/palettesActions'
import { select, handleMouseDown, handleMouseMove, handleMouseUp } from '../../actions/selectionActions'

class SingleProp extends React.Component {
    constructor (props) {
        super(props)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.selectElement = this.selectElement.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.customState = {
            elementName: `refSingleProp_${props.zone}`,
            selectElement: this.selectElement,
            selectElements: this.selectElements,
            handleMouseUp: this.handleMouseUp
        }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        if (!shallowEqual(this.props.data, nextProps.data)) {
            this.prepareData(nextProps)
        }
        return !shallowEqual(this.props, nextProps)
    }
    prepareData (nextProps) {
        const { config, data, dataset, palettes, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
        const categoryProp1 = selectedConfig.properties[0].category
        // First prop
        
        const nestedProp1 = prepareSinglePropData(data, categoryProp1)
        const propsLists = getPropsLists(config, zone, dataset)
        const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        // 
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            categoryProp1,
            nestedProp1,
            propsLists,
            color,
            selectedConfig
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
        const elements = this.getElementsInZone()
        if (elements.length > 0) this.props.select(elements, zone, selections)
        this.props.handleMouseUp(e, zone)
    }
    getElementsInZone () {
        return []
    }
    render () {
        const { config, dimensions, display, role, selections, step, zone } = this.props
       
        return (<g className = { `ListProp ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseDown = { this.handleMouseDown }
                handleMouseMove = { this.handleMouseMove }
                handleMouseUp = { this.handleMouseUp }
            />
            }
            { step !== 'changing' && this.customState.nestedProp1 &&
            <foreignObject
                transform = { `translate(${dimensions.x}, ${dimensions.y})` }
                with = { dimensions.width }
                height = { dimensions.height }
                onMouseMove = { this.handleMouseMove }
                onMouseUp = { this.handleMouseUp }
                onMouseDown = { this.handleMouseDown }
            >
                <div className = "box" style = {{ width: dimensions.width + 'px' }}>
                    <div className = "content">
                        <p style = {{lineHeight: '1em'}}>
                            { this.customState.nestedProp1.map((d, i) => {
                                return (<span key = { `contentprop_${zone}_${i}` }  className = "is-size-7">
                                    { d.root ? d.root : '' }<span style = {{ color: this.customState.color[0] }}>{ d.name }</span><span style = {{ color: '#999' }}>{ (d.count > 1) ? `(${d.count}` : `` }</span><br />
                                </span>)
                            }) 
                            }
                        </p>
                    </div>
                </div>
            </foreignObject>
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
                    propsLists = { this.customState.propsLists }
                />
                <History
                    zone = { zone }
                />
            </g>
            }
        </g>)
    }
    componentDidMount () {
        this.props.handleTransition(this.props, [])
    }
    componentDidUpdate () {
        this.props.handleTransition(this.props, [])
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
}

SingleProp.propTypes = {
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

const SinglePropConnect = connect(mapStateToProps, mapDispatchToProps)(SingleProp)

export default SinglePropConnect
