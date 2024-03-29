import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
// components
import Legend from '../elements/Legend'
import SelectionZone from '../elements/SelectionZone'
// d3
import TreeMapLayout from '../../d3/TreeMapLayout'
// libs
import { getSelectedMatch } from '../../lib/configLib'
import { deduplicate, nestData } from '../../lib/dataLib'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'

class TreeMap extends React.Component {
    constructor (props) {
        super(props)
        this.selectEnsemble = this.selectEnsemble.bind(this)
        this.customState = {
            elementName: `TreeMap_${props.zone}`
        }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        let dataChanged = (this.props.data.length !== nextProps.data.length ||
            (this.props.data[0] && nextProps.data[0] && this.props.data[0].prop1.value !== nextProps.data[0].prop1.value))
        let selectionChanged = this.props.selections.length !== nextProps.selections.length
        let dimensionsChanged = this.props.dimensions.width !== nextProps.dimensions.width ||
            this.props.dimensions.height !== nextProps.dimensions.height || 
            this.props.display.selectedZone[this.props.zone].x1 !== nextProps.display.selectedZone[this.props.zone].x1 ||
            this.props.display.selectedZone[this.props.zone].x2 !== nextProps.display.selectedZone[this.props.zone].x2 ||
            this.props.display.selectedZone[this.props.zone].y1 !== nextProps.display.selectedZone[this.props.zone].y1 ||
            this.props.display.selectedZone[this.props.zone].y2 !== nextProps.display.selectedZone[this.props.zone].y2
        if (dataChanged) {
            this.prepareData(nextProps)
        }
        return dataChanged ||
            selectionChanged ||
            dimensionsChanged ||
            this.props.step !== nextProps.step
    }
    prepareData (nextProps) {
        const { config, data, zone } = nextProps
        if (this.layout) this.layout.destroy(this[this.customState.elementName])
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
        // console.log(data)
        // First prop
        const nestedProp1 = nestData(deduplicate(data, ['prop1']), [{
            propName: 'prop1',
            category: 'text'
        }])

        const color = '#2b9053'
        
        const propsLists = config.propList

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
        const { legend } = this.customState
        const { dimensions, display, role, selections, step, zone } = this.props
        return (<svg
            width = { display.viz[zone + '_width'] }
            height = { display.screen.height - 10 }
            className = { `TreeMap ${this.customState.elementName} role_${role}` }
        >
            { step !== 'changing' &&
            <g
                transform = { `translate(${dimensions.x + dimensions.horizontal_padding}, ${dimensions.y + dimensions.top_padding})` }
                ref = {(c) => { this[this.customState.elementName] = c } }
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this, selections) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            ></g>
            }
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { dimensions }
                component = { this }
                selections = { selections }
            />
            }
            { role !== 'target' && step !== 'changing' &&
            <g>
                <Legend
                    type = "plain"
                    zone = { zone }
                    offset = { { x: 10, y: 0, width: -20, height: -30 } }
                    legend = { legend }
                    selectElements = { this.selectEnsemble }
                />
            </g>
            }
        </svg>)
    }
    getElementsInZone (zoneDimensions) {
        return this.layout.getElementsInZone({ ...this.props, zoneDimensions })
    }
    componentDidMount () {
        this.layout = new TreeMapLayout(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentDidUpdate () {
        this.layout.update(this[this.customState.elementName], { ...this.props, ...this.customState })
    }
    componentWillUnmount () {
        this.layout.destroy(this[this.customState.elementName])
    }
}

TreeMap.propTypes = {
    config: PropTypes.object,
    data: PropTypes.array,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    selections: PropTypes.array,
    role: PropTypes.string,
    step: PropTypes.string,
    zone: PropTypes.string,
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

const TreeMapConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(TreeMap)

export default TreeMapConnect
