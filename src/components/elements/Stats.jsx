import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { analyseResources, loadStats } from '../../actions/dataActions'
import { showStats } from '../../actions/displayActions'

class Stats extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {}
    }
    render () {
        const { dataset, dimensions, zone } = this.props
        const { x, y, width, height } = dimensions
        return (<div
            className = "Stats box"
            style = {
                {
                    width,
                    height,
                    position: 'absolute',
                    left: x + 'px',
                    top: y + 'px'
                }
            }
        >
            <div className = "content">
                <span
                    className='icon closebox'
                    onClick={() => { this.props.showStats() }}
                >
                    <i className='fas fa-window-close' />
                </span>
                { dataset.resources.lenght === 0 &&
                <button
                    onClick = { e => {
                        //console.log(this.props.dataset)
                        this.props.analyseResources({ ...this.props.dataset, forceUpdate: true }, [])
                    } }
                >
                    Get Resources
                </button>
                }
                <table className = "table is-bordered">
                    <tbody>
                        { dataset.resources.map((resource, ri) => {
                            return (<tr key = { `resource_${zone}_${ri}` }>
                                <td>{ resource.type }</td>
                                <td><a onClick = { e => {
                                    this.props.loadStats({
                                        ...dataset,
                                        analyse: true,
                                        entrypoint: resource.type,
                                        totalInstances: resource.total,
                                        selectionInstances: resource.total
                                    })
                                } }>analyze stats</a></td>
                            </tr>)
                        }) }
                    </tbody>
                </table>                   
            </div>
        </div>)
    }
}

Stats.propTypes = {
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    views: PropTypes.array,
    zone: PropTypes.string,
    analyseResources: PropTypes.func,
    loadStats: PropTypes.func,
    showStats: PropTypes.func
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
        showStats: showStats(dispatch)
    }
}

const StatsConnect = connect(mapStateToProps, mapDispatchToProps)(Stats)

export default StatsConnect
