import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'

class BrushLinkLayout extends AbstractLayout {
    draw (props) {
        this.drawShapes(props, props.elements.target)
        // console.log('draw B', props.elements.origin)
        // console.log('meoui',  props.elements.target)
    }
    drawShapes (props, shapes) {
        // console.log(`|||||drawRectangles`, props.zone)
        const shapesSelection = d3.select(this.el).selectAll('rect')
            .data(shapes, (d) => {
                return (d.signature) ? d.signature : d.query.value
            })

        if (shapes.length > 0) {
            shapesSelection
                .enter()
                .append('rect')
                .attr('x', d => d.zone.x1)
                .attr('y', d => d.zone.y1)
                .attr('width', d => d.zone.width)
                .attr('height', d => d.zone.height)
                .attr('fill', d => d.color)
                .attr('transform', d => `rotate(${d.rotation} ${d.zone.x1} ${d.zone.y1})`)
                .attr('fill-opacity', 0)
                .attr('fill-opacity', d => 0.3)
        }
        shapesSelection.exit()
            .attr('fill-opacity', 0)
            .remove()

        let indexSelections = props.selections.map(sel => sel.index)
        let thisZone = props.selections.some(sel => sel.zone === props.zone)
        
        shapesSelection
            .attr('x', d => d.zone.x1)
            .attr('y', d => d.zone.y1)
            .attr('width', d => d.zone.width)
            .attr('height', d => d.zone.height)
            .attr('transform', d => `rotate(${d.rotation} ${d.zone.x1} ${d.zone.y1})`)
            .attr('fill', d => d.color)
            .attr('fill-opacity', (d, i) => d.indexTarget >= 0 && !thisZone && indexSelections.includes(d.indexOrigin) ? 1 : 0)
            
        // console.log('drawn')
    }
    checkSelection (props) {}
}

export default BrushLinkLayout