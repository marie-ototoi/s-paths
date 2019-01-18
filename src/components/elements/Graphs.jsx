import PropTypes from 'prop-types'
import React from 'react'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import { getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { usePrefix } from '../../lib/queryLib'
import { getGraphsColors } from '../../lib/paletteLib'
import { showGraphs } from '../../actions/displayActions'

class Graphs extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {}
    }
    render () {
        
        const { configs, dataset, dimensions, display, zone } = this.props
        const { x, y, width, height } = dimensions

        let selectedConfig = getSelectedView(getCurrentConfigs(configs, zone, 'active'))
        let selectedProperties = getSelectedMatch(selectedConfig).properties

        let pathsToDisplay = selectedProperties.map((selProp, si) => {
            return [selProp, ...selectedConfig.multiple[si]]
        })

        let allgraphs = [...new Set(selectedProperties.reduce((acc, cur) => {
            acc.push(...cur.triplesGraphs)
            return acc
        }, []))]
        // console.log(selectedConfig)
        const colors = getGraphsColors()

        const graphs = {}
        allgraphs.forEach((graph, gi) => {
            graphs[graph] = colors[gi]
        })

        let displayedResource = this.props.dataset.resources.find((resource) =>
            resource.type === this.props.dataset.entrypoint
        )

        return (<div
            className = "Graphs box"
            style = {
                {
                    width,
                    minHeight: height,
                    maxHeight: display.viz.useful_height + 70,
                    zIndex: 12,
                    position: 'absolute',
                    overflowY: 'scroll',
                    left: x + 'px',
                    top: y + 'px'
                }
            }
        >
            <div className = "content">
                <span
                    className='icon closebox'
                    onClick={() => { this.props.showGraphs() }}
                >
                    <i className='fas fa-window-close' />
                </span>
                <div style={{paddingBottom: '10px', fontWeight: 'bold'}}>Paths displayed in the current visualization, traversing the {pluralize('graph', allgraphs.length)}:&nbsp;  
                    <ul className="graphList">
                        {allgraphs.map((graph, gi) => (
                            <li
                                style={{ color: graphs[graph] }}
                                key={`graph_${zone}_${gi}`}
                            >
                                { graph }
                            </li>
                        ))}
                    </ul>
                </div>
                {pathsToDisplay.map((pathList, pli) => (
                    <div key={`path_${zone}_${pli}`} style={{paddingBottom: '10px'}}>
                        <strong>Dimension {(pli + 1)}:&nbsp;</strong>
                        {pathList.map((prop, pi) => (
                            <div
                                className='path'
                                key={`path_${zone}_${pli}_${pi}`}
                            >
                                <a
                                    style={{ borderBottom: `1px solid ${graphs[prop.triplesGraphs[0]]}` }}
                                    title={ displayedResource.comment }
                                    href={ displayedResource.type }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    { usePrefix(displayedResource.label, dataset.prefixes) }
                                </a>
                                <span style={{ borderBottom: `1px solid ${graphs[prop.triplesGraphs[0]]}` }}> /&nbsp;</span>
                                { prop.readablePath.map((rp, rpi) => (
                                    <span
                                        className='triple'
                                        style={{
                                            borderBottom: `1px solid ${graphs[prop.triplesGraphs[rpi]]}`,
                                            paddingLeft: `${5 + (rpi < 1 ? 0 : 20)}px`,
                                            paddingBottom: `${(rpi % 2 === 0 ? 0 : 1) * 3}px`,
                                            position: 'relative',
                                            left: `-${5 + (rpi * 20)}px`
                                        }}
                                        key={ `path_${zone}_${pi}_triple_${rpi}` }
                                    >
                                        <a
                                            className='pathlabel'
                                            title={ rp.comment }
                                            href={ rp.uri }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            { usePrefix(rp.label, dataset.prefixes) }
                                        </a>
                                        &nbsp;/ * / 
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>)
    }
}

Graphs.propTypes = {
    configs: PropTypes.object,
    dataset: PropTypes.object,
    dimensions: PropTypes.object,
    display: PropTypes.object,
    views: PropTypes.array,
    zone: PropTypes.string,
    analyseResources: PropTypes.func,
    loadStats: PropTypes.func,
    showGraphs: PropTypes.func
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
        showGraphs: showGraphs(dispatch)
    }
}

const GraphsConnect = connect(mapStateToProps, mapDispatchToProps)(Graphs)

export default GraphsConnect
