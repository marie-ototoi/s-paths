import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'

class TransitionLayout extends AbstractLayout {
    draw (props) {
        this.drawShapes(props, props.elements.origin, 'origin')
        this.drawShapes(props, props.elements.target, 'target')
        
        // console.log(props.elements.origin.length, props.elements.target.length)
        // console.log('meoui',  props.elements.target)
    }
    drawShapes (props, shapes, type) {
        // console.log(`|||||drawRectangles`, props.zone, type)
        const shapesSelection = d3.select(this.el).selectAll('rect')
            .data(shapes, (d) => d.signature)
        const tChange = d3.transition()
            .duration(750)
        const tRemove = d3.transition()
            .duration(500)
        const tEnter = d3.transition()
            .duration(250)

        shapesSelection
            .enter()
            .append('rect')
            .attr('x', d => d.zone.x1)
            .attr('y', d => d.zone.y1)
            .attr('width', d => d.zone.width)
            .attr('height', d => d.zone.height)
            .attr('fill', d => d.color)
            .attr('transform', d => `rotate(${d.rotation} ${d.zone.x1} ${d.zone.y1})`)
            .attr('fill-opacity', d => type === 'target' ? 0 : d.opacity)
            .transition(tEnter)
            .attr('fill-opacity', d => d.opacity)
          
        shapesSelection
            .exit()
            .transition(tRemove)
            .attr('fill-opacity', 0)
            .remove()           

        d3.select(this.el).selectAll('rect')
            .transition(tChange)
            .attr('x', d => d.zone.x1)
            .attr('y', d => d.zone.y1)
            .attr('width', d => d.zone.width)
            .attr('height', d => d.zone.height)
            .attr('transform', d => `rotate(${d.rotation} ${d.zone.x1} ${d.zone.y1})`)
            .attr('fill', d => d.color)
            .attr('fill-opacity', 1)
            
        if (type === 'target') window.setTimeout(() => { props.endTransition(props.zone) }, 1000)
        // console.log('drawn')
    }
    checkSelection (props) {}
}

export default TransitionLayout