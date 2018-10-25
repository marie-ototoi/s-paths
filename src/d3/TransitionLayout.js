import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'

class TransitionLayout extends AbstractLayout {
    draw (props) {

        // console.log(`|||||drawRectangles`, props.zone, type)
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

        setTimeout(() => {
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
                .attr('opacity', d => 0)
                .transition()
                .duration(1000)
              
            shapesSelection
                .exit()
                .transition()
                .duration(500)
                .attr('opacity', 0)
                .remove()   
        }, 10)

               

            
        window.setTimeout(() => { props.endTransition(props.zone) }, 2000)
        // console.log('drawn')
    }
    checkSelection (props) {}
}

export default TransitionLayout