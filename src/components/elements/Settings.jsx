import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { analyseResources, loadStats } from '../../actions/dataActions'
import { showSettings } from '../../actions/displayActions'

class Settings extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {}
    }
    render () {
        const { dataset, dimensions, zone } = this.props
        const { x, y, width, height } = dimensions
        return (<div
            className = "Settings box"
            style = {
                {
                    width,
                    minHeight: height,
                    zIndex: 11,
                    position: 'absolute',
                    left: x + 'px',
                    top: y + 'px'
                }
            }
        >
            <div className = "content">
                <span
                    className='icon closebox'
                    onClick={() => { this.props.showSettings() }}
                >
                    <i className='fas fa-window-close' />
                </span>
                <div className = "field">
                    <label className = "label"></label>
                    <div className ="control">
                        
                    </div>
                </div>
                <div className = "field">
                    <label className = "label"></label>
                    <div className ="control">
                        
                    </div>
                </div>


                <button
                    onClick = { e => {
                        //console.log(this.props.dataset)
                    } }
                >Save</button>         
            </div>
        </div>)
    }
}

Settings.propTypes = {
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    views: PropTypes.array,
    zone: PropTypes.string,
    analyseResources: PropTypes.func,
    loadStats: PropTypes.func,
    showSettings: PropTypes.func
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
        showSettings: showSettings(dispatch)
    }
}

const SettingsConnect = connect(mapStateToProps, mapDispatchToProps)(Settings)

export default SettingsConnect
