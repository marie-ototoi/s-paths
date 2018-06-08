import PropTypes from 'prop-types'
import React from 'react'
import formatMessage from 'format-message'
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

// libs
import { getSelectedMatch } from '../../lib/configLib'
import { prepareDetailData } from '../../lib/dataLib'
import * as scaleLib from '../../lib/scaleLib'
// redux functions
import { setUnitDimensions } from '../../actions/dataActions'
import { getPropPalette } from '../../actions/palettesActions'
import { select, handleMouseDown, handleMouseMove, handleMouseUp } from '../../actions/selectionActions'
import { getSplitUri } from '../../lib/queryLib';

class ListAllProps extends React.Component {
    constructor (props) {
        super(props)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.selectElement = this.selectElement.bind(this)
        this.selectElements = this.selectElements.bind(this)
        this.customState = {
            elementName: `refListProp_${props.zone}`,
            selectElement: this.selectElement,
            selectElements: this.selectElements,
            handleMouseUp: this.handleMouseUp
        }
        this.state = { selectedIndex: 0 }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        if (!shallowEqual(this.props.data, nextProps.data)) {
            this.prepareData(nextProps)
        }
        return !shallowEqual(this.props, nextProps)
    }
    prepareData (nextProps) {
        const { config, data, dataset, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
        // First prop

        // const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        let details = prepareDetailData(data, dataset)
        // console.log('details', details)
        // 

        // Save to reuse in render
        this.customState = {
            ...this.customState,
            details,
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
            { step !== 'changing' && this.customState.details &&
            <foreignObject
                transform = { `translate(${dimensions.x}, ${dimensions.y})` }
                with = { dimensions.width }
                height = { dimensions.height }
                onMouseMove = { this.handleMouseMove }
                onMouseUp = { this.handleMouseUp }
                onMouseDown = { this.handleMouseDown }
            >
                <div className = "box" style = {{ width: dimensions.width + 'px' }}>
                    <div className = "tabs">
                        <ul>
                            { Array.from(Array(this.customState.details.length)).map((el, i) => { return (
                                <li
                                    className =  { (i === this.state.selectedIndex) ? `is-active` : `` }
                                    key = { `tab_${zone}_${i}` }
                                    onMouseUp = { () => this.setState({ selectedIndex: i }) }
                                ><a>
                                        { (i === 0) ? `entities` : formatMessage(`{ level, plural,
                                            =1 {1st}
                                            =2 {2nd}
                                            =3 {3rd}
                                            other {#th}
                                        } level`, {
                                            level: i
                                        })
                                        }
                                    </a>
                                </li>
                            )}) }
                        </ul>
                    </div>
                    <div className = "content">
                        { (this.state.selectedIndex > 0) &&
                            this.customState.details[this.state.selectedIndex].map((el, i) => (<p key = { `contenttab_${zone}_${i}` }  className = "is-clipped is-size-7" style = {{ 'maxHeight': 4.3 + 'em' }}>
                                <strong>{ (this.state.selectedIndex === 0) ? '' : 
                                    el.readablePath.map((part, index) => {
                                        return <span key = { `${this.state.elementName}_path_${index}` }>
                                            <span title = { part.comment }>&nbsp;{part.label} </span> { (index < el.readablePath.length - 1) ? '/' : '' }
                                        </span>
                                    }) }</strong> 
                                <span>{ (this.state.selectedIndex === 0) ? el : el[`prop${(this.state.selectedIndex)}`].map(v => `${v.value}${(v.count > 1) ? ' (' + v.count + '), ' : ', '}`)}</span>
                            </p>)) 
                        }
                        { (this.state.selectedIndex === 0) &&
                            this.customState.details[this.state.selectedIndex].map((el, i) => (<span key = { `contenttab_${zone}_${i}` }  className = "is-size-7">
                                {el + ', '} 
                            </span>))
                        }
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
                    propsLists = { [] }
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

ListAllProps.propTypes = {
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

const ListAllPropsConnect = connect(mapStateToProps, mapDispatchToProps)(ListAllProps)

export default ListAllPropsConnect
