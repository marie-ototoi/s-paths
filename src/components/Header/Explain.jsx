import React from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { connect } from 'react-redux'
import { getCurrentConfigs, getSelectedMatch, getSelectedView } from '../../lib/configLib'
import { showGraphs } from '../../actions/displayActions'
import { usePrefix } from '../../lib/queryLib'

import './Explain.css'

class Explain extends React.Component {
    render () {
        const { configs, dataset, zone } = this.props

        let selectedConfig = getSelectedView(getCurrentConfigs(configs, zone, 'active'))
        let selectedProperties = getSelectedMatch(selectedConfig).properties

        let pathsToDisplay = selectedProperties.map((selProp, si) => {
            return [selProp, ...selectedConfig.multiple[si]]
        })
        let allgraphs = [...new Set(pathsToDisplay.flat().reduce((acc, cur) => {
            if (cur.triplesGraphs) acc.push(...cur.triplesGraphs)
            return acc
        }, []))]

        let displayedResource = this.props.dataset.resources.find((resource) =>
            resource.type === this.props.dataset.entrypoint
        )
        let pathsNumber = selectedProperties.length 
        selectedConfig.multiple.forEach(multipleList => {
            pathsNumber += multipleList.length
        })
        return (
            <div
                className='Explain'
                style={{
                    marginLeft: `${this.props.display.viz.horizontal_padding}px`
                }}
            >
                <p>
                    You are visualizing&nbsp;
                    <strong>
                        {this.props.options.total} { pluralize('entity', this.props.options.total)}
                    </strong>
                    &nbsp;belonging to the class of resources&nbsp;
                    <strong title = {displayedResource.comment}>
                        { usePrefix(displayedResource.label, dataset.prefixes) }
                    </strong>
                    &nbsp;according to&nbsp;
                    <strong>
                        {pathsNumber} property {pluralize('path', pathsNumber)}
                    </strong>
                    &nbsp;traversing&nbsp;
                    <strong>
                        {allgraphs.length} {pluralize('graph', allgraphs.length)}
                    </strong>
                </p>
                <span className='resource-def' onClick={(e) => this.props.showGraphs() }>?</span>
            </div>
        )
    }

    static propTypes = {
        configs: PropTypes.object,
        dataset: PropTypes.object,
        display: PropTypes.object,
        zone: PropTypes.string,
        options: PropTypes.object.isRequired,
        showGraphs: PropTypes.func
    }
}

const ExplainConnect = connect(
    (state) => ({
        configs: state.configs,
        dataset: state.dataset,
        display: state.display
    }),
    (dispatch) => ({
        showGraphs: showGraphs(dispatch)
    })
)(Explain)

export default ExplainConnect
