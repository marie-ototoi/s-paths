import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import './CirclePack.css'

class CirclePack extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            resources: this.pack(this.props.resources)
        }
        console.log(this.state.resources)
        console.log(this.props.selectedResource)
    }
    render () {
        return (
            <svg
                width = { 110 }
                height = { 110 }
                className = 'CirclePack'
                
                style={{marginLeft: `55px`}}
            >
                <circle r='54' cx='55' cy='55' stroke='#888' fill='#f0f0f0' />
                { this.state.resources.map((resource, i) => 
                    <circle
                        key={`circlepack${i}`}
                        r={resource.r} 
                        cx={resource.x} 
                        cy={resource.y} 
                        stroke='#888' 
                        fill={this.props.selectedResource.type === resource.data.type ? '#888' : '#fff'} 
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
            .size([109, 109])
            .padding(1)(data).children
    }
    static propTypes = {
        resources:  PropTypes.array,
        selectedResource: PropTypes.object,
        status:  PropTypes.string
    }
}

export default CirclePack
