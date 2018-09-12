import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
// components
import Legend from '../elements/Legend'
import SelectionZone from '../elements/SelectionZone'
// d3
import TreeMapLayout from '../../d3/TreeMapLayout'
// libs
import { getPropsLists, getSelectedMatch } from '../../lib/configLib'
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
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            this.prepareData(nextProps)
        }
        return (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) ||
            (JSON.stringify(this.props.selections) !== JSON.stringify(nextProps.selections)) ||
            (JSON.stringify(this.props.display) !== JSON.stringify(nextProps.display)) ||
            (this.props.step !== nextProps.step)
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

        const color = getPropPalette(palettes, selectedConfig.properties[0].path, 1)
        const propsLists = getPropsLists(config, zone, dataset)

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
        return (<g className = { `TreeMap ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { dimensions }
                handleMouseMove = { this.props.handleMouseMove }
                layout = { this.layout }
                selections = { selections }
            />
            }
            { step !== 'changing' &&
            <g
                transform = { `translate(${dimensions.x + dimensions.horizontal_padding}, ${dimensions.y + dimensions.top_padding})` }
                ref = {(c) => { this[this.customState.elementName] = c } }
                onMouseMove = { (e) => { this.props.handleMouseMove(e, zone) } }
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this.layout, selections) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            ></g>
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
        </g>)
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

const TreeMapConnect = connect(mapStateToProps, mapDispatchToProps)(TreeMap)

export default TreeMapConnect
