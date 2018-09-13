import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

class PropSelector extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {
            elementName: `${props.zone}_selector_${props.propIndex}`,
            selected: props.selected
        }
    }
    render () {
        const { align, dimensions, propList } = this.props
        const { x, y, width, height } = dimensions
        const alignClass = (align === 'right') ? 'right' : 'left'
        let selectedPropIndex
        propList.forEach((p, i) => {
            if (p.selected) selectedPropIndex = i
        })
        const selectedProp = propList[selectedPropIndex]
        return (
            <foreignObject className = {this.state.elementName + ` propSelector`}
                transform = { `translate(${x}, ${y})` }
                ref = { this.state.elementName }
                width = { width }
                height = { height }
            >
                <p
                    className = { alignClass }
                >/ 
                    { selectedProp && selectedProp.readablePath.map((part, index) => {
                        return <span key = { `${this.state.elementName}_path_${index}` }>
                            &nbsp;<span title = { part.comment }>{part.label} </span>  { (index < selectedProp.readablePath.length - 1) ? ' / * / ' : ' /' }
                        </span>
                    }) }
                </p>
            </foreignObject>
        )
    }
}

PropSelector.propTypes = {
    align: PropTypes.string,
    config: PropTypes.object,
    configs: PropTypes.object,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    propIndex: PropTypes.number,
    propList: PropTypes.array,
    selected: PropTypes.bool,
    type: PropTypes.string,
    views: PropTypes.array,
    zone: PropTypes.string,
    selectResource: PropTypes.func,
    selectProperty: PropTypes.func
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        dataset: state.dataset,
        display: state.display,
        views: state.views
    }
}

function mapDispatchToProps (dispatch) {
    return {}
}

const PropSelectorConnect = connect(mapStateToProps, mapDispatchToProps)(PropSelector)

export default PropSelectorConnect
