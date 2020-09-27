import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as d3 from 'd3'

import './CirclePack.css'

class CirclePack extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            resources: this.pack(this.props.resources)
        }
        //console.log(this.state.resources)
        //console.log(this.props.selectedResource)
    }
    render () {
        return (
            <svg
                width = { 146 }
                height = { 146 }
                className = 'CirclePack'
                
                style={{marginLeft: (this.props.display.viz.horizontal_padding - 180) > 0 ? (this.props.display.viz.horizontal_padding - 180) : 0 + `px`, marginTop: `-10px`}}
            >
                <circle r='72' cx='73' cy='73' stroke='#666' fill='#f0f0f0' />
                { this.state.resources && this.state.resources.map((resource, i) => 
                    <circle
                        key={`circlepack${i}`}
                        r={resource.r} 
                        cx={resource.x} 
                        cy={resource.y} 
                        stroke='#888' 
                        onMouseOver={e => this.props.hoverResource(resource.data)}
                        onMouseOut={e => this.props.hoverResource(this.props.displayedResource)}
                        onClick={e => this.props.displayResource(false)}
                        fill={this.props.selectedResource.type === resource.data.type ? '#666' : '#fff'} 
                    />
                )}
            </svg>
        )
    }
    pack (resources) {
        //NOTE CHECK IF STATUS !== TRANSITION
        console.log(resources)
        let mapresources = {
            name: 'root',
            children: resources.map(resource => {
                return {
                    ...resource,
                    name: resource.type
                }
            })
        }
        let data =  d3.hierarchy(mapresources)
            .sum(function(d) { return d.total })
        return d3.pack()
            .size([145, 145])
            .padding(1)(data).children
    }
    static propTypes = {
        display: PropTypes.object,
        displayResource:  PropTypes.func,
        hoverResource:  PropTypes.func,
        resources:  PropTypes.array,
        selectedResource: PropTypes.object,
        displayedResource: PropTypes.object,
        status:  PropTypes.string
    }
}

const CirclePackConnect = connect(
    (state) => ({
        display: state.display
    }),
    (dispatch) => ({
      
    })
)(CirclePack)

export default CirclePackConnect
