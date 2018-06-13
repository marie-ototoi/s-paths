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
import { getPropsLists, getSelectedMatch } from '../../lib/configLib'
import { deduplicate, nestData } from '../../lib/dataLib'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'

class URIWheel extends React.Component {
    constructor (props) {
        super(props)
        this.selectEnsemble = this.selectEnsemble.bind(this)
        this.customState = {
            elementName: `refURIWheel_${props.zone}`
        }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            this.prepareData(nextProps)
        }
        return !shallowEqual(this.props, nextProps)
    }
    prepareData (nextProps) {
        const { config, data, dataset, getPropPalette, palettes, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
        // First prop
        const nestedProp1 = nestData(deduplicate(data, ['prop1']), [{
            propName: 'prop1',
            category: 'text'
        }])

        const propsLists = getPropsLists(config, zone, dataset)

        const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)

        // console.log(nestedProp1)
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            color,
            selectedConfig,
            nestedProp1,
            propsLists
        }
    }
    selectEnsemble (prop, value, category) {
        const elements = this.layout.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections)
    }
    render () {
        const { legend, propsLists } = this.customState
        const { config, dimensions, display, role, selections, step, zone } = this.props
        return (<g className = { `URIWheel ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { display.zones[zone] }
                handleMouseMove = { this.props.handleMouseMove }
                layout = { this.layout }
                selections = { selections }
            />
            }
            { step !== 'changing' &&
            <g
                transform = { `translate(${dimensions.x}, ${dimensions.y})` }
                ref = {(c) => { this[this.customState.elementName] = c }}
                onMouseMove = { (e) => { this.props.handleMouseMove(e, zone) } }
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this.layout, selections) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
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
                    selectElements = { this.selectEnsemble }
                />
                <History
                    zone = { zone }
                />
            </g>
            }
        </g>)
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

const URIWheelConnect = connect(mapStateToProps, mapDispatchToProps)(URIWheel)

export default URIWheelConnect
