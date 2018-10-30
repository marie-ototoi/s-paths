import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { analyseResources, loadStats } from '../../actions/dataActions'
import { showSettings } from '../../actions/displayActions'
import { saveFactor } from '../../actions/configActions'

class Settings extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {}
    }
    render () {
        const { dataset, dimensions, zone } = this.props
        const { x, y, width, height } = dimensions
        let { rankPropFactors, rankMatchFactors, graphs } = dataset
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
                <h2>Prop level ranking factors</h2>
                {
                    Object.keys(rankPropFactors).map((key) => 
                        <div className = "field" key = { `fact${key}` }>
                            <label className = "label">{ key }
                                <input value={rankPropFactors[key]}
                                    type='number'
                                    name ={key}
                                    onChange = {(e) => {
                                        this.props.saveFactor('rankPropFactors', key, e.target.value)
                                    }}
                                />
                            </label>
                        </div>
                    )
                }
                <h2>Match level ranking factors</h2>
                {
                    Object.keys(rankMatchFactors).map((key) => 
                        <div className = "field" key = { `fact${key}` }>
                            <label className = "label">{ key }
                                <input value={rankMatchFactors[key]}
                                    type='number'
                                    name ={key}
                                    onChange = {(e) => {
                                        this.props.saveFactor('rankMatchFactors', key, e.target.value)
                                    }}
                                />
                            </label>
                        </div>
                    )
                }
                        
            </div>
        </div>)
    }
}

Settings.propTypes = {
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    zone: PropTypes.string,
    showSettings: PropTypes.func,
    saveFactor: PropTypes.func
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
        saveFactor: saveFactor(dispatch),
        showSettings: showSettings(dispatch)
    }
}

const SettingsConnect = connect(mapStateToProps, mapDispatchToProps)(Settings)

export default SettingsConnect
