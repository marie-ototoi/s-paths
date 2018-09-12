import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
// components
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { getSelectedMatch } from '../../lib/configLib'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'
import { deduplicate } from '../../lib/dataLib'

class Images extends React.Component {
    constructor (props) {
        super(props)
        this.selectEnsemble = this.selectEnsemble.bind(this)
        this.customState = {
            elementName: `refListProp_${props.zone}`
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
        const { config, data, zone } = nextProps
        // prepare the data for display
        const selectedConfig = getSelectedMatch(config, zone)
        // First prop
        let uniqueData = deduplicate(data, ['prop1'])
        // Save to reuse in render
        this.customState = {
            ...this.customState,
            uniqueData,
            selectedConfig
        }
    }
    selectEnsemble (prop, value, category) {
        const elements = this.layout.getElements(prop, value, category)
        const { selectElements, zone, selections } = this.props
        selectElements(elements, zone, selections)
    }
    getElementsInZone () {
        return []
    }
    render () {
        const { dimensions, display, data, role, selections, step, zone } = this.props
        const { uniqueData } = this.customState
       
        return (<g className = { `Images ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <SelectionZone
                zone = { zone }
                dimensions = { dimensions }
                handleMouseMove = { this.props.handleMouseMove }
                layout = { this }
                selections = { selections }
            />
            }
            { step !== 'changing' && data && 
            <foreignObject
                transform = { `translate(${dimensions.x + dimensions.horizontal_padding}, ${dimensions.y})` }
                with = { dimensions.width }
                height = { dimensions.height }
                onMouseMove = { (e) => { this.props.handleMouseMove(e, zone) } }
                onMouseUp = { (e) => { this.props.handleMouseUp(e, zone, display, this, selections) } }
                onMouseDown = { (e) => { this.props.handleMouseDown(e, zone, display) } }
            >
                <div className = "box" style = {{ width: dimensions.width + 'px' }}>
                    <div className = "content">
                        { 
                            uniqueData.map((el, i) => 
                                (<img key = { `img_${zone}_${i}` }  className = "" src = { el.prop1.value } alt = { el.prop2.value } title = { el.prop2.value } />)
                            )
                        }
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

Images.propTypes = {
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

const ImagesConnect = connect(mapStateToProps, mapDispatchToProps)(Images)

export default ImagesConnect
