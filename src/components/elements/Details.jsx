import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { analyseResources, loadStats } from '../../actions/dataActions'
import { closeDetails } from '../../actions/displayActions'

class Details extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {}
    }
    render () {
        const { dataset, dimensions, zone } = this.props
        const { x, y, width, height } = dimensions
        return (<div
            className = "Details box"
            style = {
                {
                    width,
                    minHeight: height,
                    zIndex:13,
                    position: 'absolute',
                    left: x + 'px',
                    top: y + 'px'
                }
            }
        >
            <div className = "content">
                <span
                    className='icon closebox'
                    onClick={() => { this.props.closeDetails() }}
                >
                    <i className='fas fa-window-close' />
                </span>
                You requested detailed informations about the instance of the displayed paths for the following entities:
                {
                    JSON.stringify(this.props.elements)
                }
            </div>
        </div>)
    }
}

Details.propTypes = {
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    elements: PropTypes.array,
    views: PropTypes.array,
    zone: PropTypes.string,
    analyseResources: PropTypes.func,
    loadStats: PropTypes.func,
    closeDetails: PropTypes.func,
}

function mapStateToProps (state) {
    return {
        configs: state.configs,
        dataset: state.dataset,
        data: state.data,
        display: state.display,
        views: state.views
    }
}

function mapDispatchToProps (dispatch) {
    return {
        analyseResources: analyseResources(dispatch),
        loadStats: loadStats(dispatch),
        closeDetails: closeDetails(dispatch)
    }
}

const DetailsConnect = connect(mapStateToProps, mapDispatchToProps)(Details)

export default DetailsConnect
