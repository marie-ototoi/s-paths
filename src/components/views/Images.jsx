import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
// components
import SelectionZone from '../elements/SelectionZone'
// d3

// libs
import { getSelectedMatch } from '../../lib/configLib'
import { detectRectCollision } from '../../lib/selectionLib'
import { getRelativeRectangle } from '../../lib/scaleLib'
// redux functions
import { getPropPalette } from '../../actions/palettesActions'
import { handleMouseDown, handleMouseUp, selectElements } from '../../actions/selectionActions'
import { deduplicate } from '../../lib/dataLib'

class Images extends React.Component {
    constructor (props) {
        super(props)
        this.getElementsForTransition = this.getElementsForTransition.bind(this)
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
    getElementsInZone (zoneDimensions) {
        console.log(zoneDimensions)
        const { display, zone } = this.props
        let relativeZone = getRelativeRectangle(zoneDimensions, zone, display)
        this.customState.uniqueData = this.customState.uniqueData.map((el, index) => {
            let inZone = detectRectCollision(relativeZone, el.zone)
            return {
                ...el,
                selected: inZone
            }
        })
        return this.customState.uniqueData.filter(c => c.selected)
    }
    render () {
        const { dimensions, display, data, role, selections, step, zone } = this.props
        const { uniqueData } = this.customState
       
        return (<div
            className = { `Images ${this.customState.elementName} role_${role}` } 
            style = {{ 
                position: 'relative'
            }}
        >
            { role !== 'target' &&
            <svg
                style = {{ 
                    position: 'absolute',
                    zIndex: 3
                }}
                width = { display.viz[zone + '_width'] }
                height = { display.screen.height - 10 }
                transform = { `translate(${dimensions.x }, 0)` }
                className = { `Images ${this.customState.elementName} role_${role}` } ref = {(c) => { this.refImages = c }}
            >
                <SelectionZone
                    zone = { zone }
                    dimensions = { { ...dimensions } }
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
                    width: `${dimensions.useful_width}px`,
                    left : `${dimensions.x + display.viz.horizontal_padding}px`,
                    top: `${dimensions.y + dimensions.top_padding}px`
                }}
            >
                <div className = "box" style = {{ width: dimensions.useful_width + 'px' }}>
                    <div className = "content" style = {{maxHeight: `${dimensions.useful_height}px`}}>
                        { 
                            uniqueData.map((el, i) => 
                                (<span
                                    key = { `img_${zone}_${i}` }
                                >
                                    <img 
                                        src = { el.prop1.value }
                                        alt = { el.prop2.value }
                                        title = { el.prop2.value }
                                        style = {{ 
                                            opacity: (selections.length > 0 && el.selected) || selections.length === 0 ? 1 : 0.2 
                                        }}
                                    />
                                </span>)
                            )
                        }
                    </div>
                </div>
            </div>
            }
            
        </div>)
    }
    getElementsForTransition () {
        const { dimensions, zone } = this.props
        let imagesPerRow = Math.floor(dimensions.useful_width / 60)
        this.customState.uniqueData = this.customState.uniqueData.map((el, index) => {
            let row = index % imagesPerRow 
            let col = Math.floor(index / imagesPerRow)
            let x1 = 60 * row + 5
            let y1 = 85 * col + 5
            return { 
                ...el,
                zone: {
                    x1,
                    y1,
                    x2: x1 + 50,
                    y2: y1 + 75,
                    width: 50,
                    height: 75
                },
                selector:`img_${zone}_${index}`,
                index: index,
                query: {
                    type: 'uri',
                    value: el.entrypoint.value
                },
                color: "#13439a",
                opacity: 0.5,
                shape: 'rectangle',
                rotation: 0
            }
        })
        return this.customState.uniqueData
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
