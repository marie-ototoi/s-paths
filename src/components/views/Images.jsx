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
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
        this.selectEnsemble = this.selectEnsemble.bind(this)
        this.customState = {
            elementName: `refListProp_${props.zone}`
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
    getElementsInZone (zoneDimensions) {
        return []
    }
    render () {
        const { dimensions, display, data, role, selections, step, zone } = this.props
        const { uniqueData } = this.customState
       
        return (<div
            className = { `Images ${this.customState.elementName} role_${role}` } >
            { role !== 'target' &&
            <svg
                style = {{ position: 'absolute' }}
                width = { display.viz[zone + '_width'] }
                height = { display.screen.height - 10 }
            >
                <SelectionZone
                    zone = { zone }
                    dimensions = { dimensions }
                    handleMouseMove = { this.props.handleMouseMove }
                    component = { this }
                    selections = { selections }
                />
            </svg>
            }
            { step !== 'changing' && data && 
            <div
                style = {{ 
                    position: 'relative',
                    left : `${dimensions.x + display.viz.horizontal_padding}px`,
                    top: `${dimensions.y + dimensions.top_padding}px`,
                    width: `${dimensions.useful_width}px`,
                    height: `${dimensions.useful_height}px`
                }}
            >
                <div className = "box" style = {{ width: dimensions.useful_width + 'px' }}>
                    <div className = "content">
                        { 
                            uniqueData.map((el, i) => 
                                (<img key = { `img_${zone}_${i}` }  className = "" src = { el.prop1.value } alt = { el.prop2.value } title = { el.prop2.value } />)
                            )
                        }
                    </div>
                </div>
            </div>
            }
        </div>)
    }
    getElementsForTransition () {
        const { zone } = this.props
        return this.customState.uniqueData.map((el, index) => {
            return { 
                zone: {
                    x1: 0,
                    y1: 0,
                    x2: 10,
                    y2: 10,
                    width: 10,
                    height: 10
                },
                selector:`img_${zone}_${index}`,
                index: index,
                query: {
                    type: 'uri',
                    value: el.entrypoint.value
                },
                color: "#666",
                opacity: el.opacity,
                shape: 'rectangle',
                rotation: 0
            }
        })
    }
    componentDidMount () {
        this.props.handleTransition(this.props, this.getElementsForTransition())
    }
    componentDidUpdate () {
        this.props.handleTransition(this.props, this.getElementsForTransition())
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

const ImagesConnect = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Images)

export default ImagesConnect
