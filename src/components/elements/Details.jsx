import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { analyseResources, loadStats } from '../../actions/dataActions'
import { usePrefix } from '../../lib/queryLib'
import { getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { getGraphsColors } from '../../lib/paletteLib'
import { closeDetails } from '../../actions/displayActions'

class Details extends React.PureComponent {
    constructor (props) {
        super(props)
        this.state = {}
    }
    render () {
        const { configs, dataset, dimensions, zone } = this.props
        const { x, y, width, height } = dimensions
        let selectedConfig = getSelectedView(getCurrentConfigs(configs, zone, 'active'))

        let selectedProperties = getSelectedMatch(selectedConfig).properties
        const colors = getGraphsColors()

        const graphs = {}
        selectedProperties[0].graphs.forEach((graph, gi) => {
            graphs[graph] = colors[gi]
        })
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
                <strong>Instanciated paths of maximum 10 entities in the current selection</strong>
                {
                    selectedProperties.map((prop, pi) => (<div key = {`pathinstanceprop${pi}`}>
                        
                        <div>
                            <strong>Path {(pi + 1)}:&nbsp;</strong>
                            {
                                this.props.elements.map((entity, i) => (
                                    <div
                                        className='path'
                                        key={`path_${zone}_${pi}_${i}`}
                                    >
                                        <span
                                            style={{ borderBottom: `1px solid ${graphs[prop.triplesGraphs[0]]}` }}
                                        >
                                            {usePrefix(entity.entrypoint.value, dataset.prefixes)} 
                                        </span>
                                        {prop.readablePath.map((rp, rpi) => (
                                            <span
                                                className='triple'
                                                style={{
                                                    borderBottom: `1px solid ${graphs[prop.triplesGraphs[rpi]]}`,
                                                    paddingLeft: `${5 + (rpi < 1 ? 0 : 20)}px`,
                                                    paddingBottom: `${(rpi % 2 === 0 ? 0 : 1) * 3}px`,
                                                    position: 'relative',
                                                    left: `-${5 + (rpi * 20)}px`
                                                }}
                                                key={`path_${zone}_${pi}_triple_${rpi}`}
                                            >
                                                <span
                                                    className='pathlabel'
                                                    title={rp.comment}
                                                    style={{
                                                        color: `#999`
                                                    }}
                                                >/&nbsp;
                                                    {  usePrefix(rp.label, dataset.prefixes) }
                                                    &nbsp;/&nbsp;
                                                </span>
                                                { (rpi < prop.readablePath.length-1) ? 
                                                    usePrefix(entity['prop'+ (pi + 1) + 'inter' + (rpi + 1)].value, dataset.prefixes) : 
                                                    prop.category === 'uri' ? usePrefix(entity['prop'+ (pi + 1)].value, dataset.prefixes): entity['prop'+ (pi + 1)].value 
                                                }
                                            </span>
                                        ))}
                                    </div>
                                ))
                            }
                        </div>
                    </div>))
                }
            </div>
        </div>)
    }
}

Details.propTypes = {
    configs: PropTypes.object,
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
