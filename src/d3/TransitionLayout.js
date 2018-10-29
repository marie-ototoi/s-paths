import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'

class TransitionLayout extends AbstractLayout {
    
    layTransition (props) {
        let shapesSelection = d3.select(this.el).selectAll('rect')
            .data(props.elements.origin, (d) => d.signature)
     
        shapesSelection
            .enter()
            .append('rect')
            .attr('x', d => d.zone.x1)
            .attr('y', d => d.zone.y1)
            .attr('width', d => d.zone.width)
            .attr('height', d => d.zone.height)
            .attr('fill', d => d.color)
            .attr('transform', d => `rotate(${d.rotation} ${d.zone.x1} ${d.zone.y1})`)
            .attr('opacity', d => d.opacity)

        shapesSelection = d3.select(this.el).selectAll('rect')
            .data(props.elements.target, (d) => d.signature)
            
        shapesSelection
            .transition()
            .delay(250)
            .duration(750)
            .attr('x', d => d.zone.x1)
            .attr('y', d => d.zone.y1)
            .attr('width', d => d.zone.width)
            .attr('height', d => d.zone.height)
            .attr('transform', d => `rotate(${d.rotation} ${d.zone.x1} ${d.zone.y1})`)
            .attr('fill', d => d.color)
    
        shapesSelection
            .enter()
            .append('rect')
            .attr('x', d => d.zone.x1)
            .attr('y', d => d.zone.y1)
            .attr('width', d => d.zone.width)
            .attr('height', d => d.zone.height)
            .attr('fill', d => d.color)
            .attr('transform', d => `rotate(${d.rotation} ${d.zone.x1} ${d.zone.y1})`)
            .style('opacity', 0)
            .transition()
            .duration(1000)
            .style('opacity', d => d.opacity)
            
            
        shapesSelection
            .exit()
            .transition()
            .duration(500)
            .style('opacity', 0)
            .remove()                  

        window.setTimeout(() => { props.endTransition(props.zone) }, 1600)
        // console.log('drawn once only')
    }
    checkSelection (props) {}
}

export default TransitionLayout