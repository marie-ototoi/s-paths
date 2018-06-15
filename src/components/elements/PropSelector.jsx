import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { selectResource, selectProperty } from '../../actions/dataActions'

class PropSelector extends React.PureComponent {
    constructor (props) {
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
        this.state = {
            elementName: `${props.zone}_selector_${props.propIndex}`,
            selected: props.selected
        }
    }
    handleSelect (e) {
        const { config, dataset, propIndex, propList, views, zone } = this.props
        this.setState({
            selected: this.props.selected
        })
        let requestedProp = propList[e.target.value]
        if (this.props.type === 'header') {
            this.props.selectResource({ ...dataset, entrypoint: requestedProp.path, totalInstances: requestedProp.total, constraints: `` }, views)
        } else {
            this.props.selectProperty(propIndex, requestedProp.path, config, dataset, zone)
        }
    }
    render () {
        const { align, dimensions, propList } = this.props
        // const dimensions = getDimensions('propSelector' + type, display.zones[zone], display.viz, offset)
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
                { (!this.state.selected) &&
                    <p
                        className = { alignClass }
                        onClick = { (e) => this.setState({ selected: true }) }
                    >
                        { selectedProp && selectedProp.readablePath.map((part, index) => {
                            return <span key = { `${this.state.elementName}_path_${index}` }>
                                <span title = { part.comment }>&nbsp;{part.label} </span> { (index < selectedProp.readablePath.length - 1) ? ' / ' : '' }
                            </span>
                        }) }
                    </p>
                }
                { (this.state.selected) &&
                <select
                    className = { alignClass }
                    style = { { width: width + `px` } }
                    onChange = { this.handleSelect }
                    value = { selectedPropIndex }
                >
                    { propList.map((config, i) => {
                        return <option
                            value = { i }
                            key = { this.state.elementName + i }
                        >
                            { config.readablePath.map(part => part.label).join(' / ').concat(config.total ? ' (' + config.total + ')' : '') }
                        </option>
                    }) }
                </select>
                }
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
    return {
        selectProperty: selectProperty(dispatch),
        selectResource: selectResource(dispatch)
    }
}

const PropSelectorConnect = connect(mapStateToProps, mapDispatchToProps)(PropSelector)

export default PropSelectorConnect
