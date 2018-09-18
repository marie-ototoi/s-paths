import PropTypes from 'prop-types'
import React from 'react'
import shallowEqual from 'shallowequal'
import { connect } from 'react-redux'
// components
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { getPropsLists, getSelectedMatch } from '../../lib/configLib'
import { prepareSinglePropData } from '../../lib/dataLib'

// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'

class SingleProp extends React.Component {
    constructor (props) {
        super(props)
        this.selectEnsemble = this.selectEnsemble.bind(this)
        this.customState = {
            elementName: `refSingleProp_${props.zone}`
        }
        this.prepareData(props)
    }
    shouldComponentUpdate (nextProps, nextState) {
        if (!shallowEqual(this.props.data, nextProps.data)) {
            this.prepareData(nextProps)
        }
        return (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) ||
            (JSON.stringify(this.props.selections) !== JSON.stringify(nextProps.selections)) ||
            (JSON.stringify(this.props.display) !== JSON.stringify(nextProps.display)) ||
            (this.props.step !== nextProps.step)
    }
    prepareData (nextProps) {
        const { config, data, dataset, palettes, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
        const categoryProp1 = selectedConfig.properties[0].category
        // First prop
        
        const nestedProp1 = prepareSinglePropData(data, categoryProp1, dataset.prefixes)
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
    selectEnsemble (prop, value, category) {
        const elements = this.layout.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections)
    }
    getElementsInZone (zoneDimensions) {
        return []
    }
    render () {
        const { dimensions, display, role, selections, step, zone } = this.props
       
        return (<g className = { `ListProp ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { dimensions }
                component = { this }
                selections = { selections }
            />
            }
            { step !== 'changing' && this.customState.nestedProp1 &&
            <foreignObject
                transform = { `translate(${dimensions.x + dimensions.horizontal_padding}, ${dimensions.y})` }
                with = { dimensions.width }
                height = { dimensions.height }
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this, selections) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            >
                <div className = "box" style = {{ width: dimensions.useful_width + 'px' }}>
                    <div className = "content">
                        <p style = {{lineHeight: '1em'}}>
                            { this.customState.nestedProp1.map((d, i) => {
                                return (<span key = { `contentprop_${zone}_${i}` }  className = "is-size-7">
                                    <span style = {{ color: this.customState.color[0] }}>{ d.name }</span><span style = {{ color: '#999' }}>{ (d.count > 1) ? ` (${d.count})` : `` }</span><br />
                                </span>)
                            }) 
                            }
                        </p>
                    </div>
                </div>
            </foreignObject>
            }
        </g>)
    }
    componentDidMount () {
        this.props.handleTransition(this.props, [])
    }
    componentDidUpdate () {
        this.props.handleTransition(this.props, [])
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

const SinglePropConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(SingleProp)

export default SinglePropConnect
