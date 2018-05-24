import * as d3 from 'd3'

export const create = (el, props) => {
    // console.log('create', props.elements)
    if (el && props) {
        draw(el, props)
    }
}
export const destroy = (el, props) => {
    d3.select(el).selectAll('rect')
        .remove()
}

const draw = (el, props) => {
    drawShapes(el, props, props.elements.origin, 'origin')
    drawShapes(el, props, props.elements.target, 'target')
    // console.log('draw B', targetRectangles)
    // console.log('meoui', originRectangles)
}

const drawShapes = (el, props, shapes, type) => {
    // console.log(`|||||drawRectangles`, props.zone, type)
    if (shapes.length > 0) {
        const shapesSelection = d3.select(el).selectAll('rect')
            .data(shapes, (d) => {
                return (d.signature) ? d.signature : d.query.value
            })

        const tChange = d3.transition()
            .duration(750)

        const tRemove = d3.transition()
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
            .attr('fill-opacity', d => d.opacity)
        
        shapesSelection.exit()
            .transition(tRemove)
            .attr('fill-opacity', 0)
            .remove()
        shapesSelection
            .transition(tChange)
            .attr('x', d => d.zone.x1)
            .attr('y', d => d.zone.y1)
            .attr('width', d => d.zone.width)
            .attr('height', d => d.zone.height)
            .attr('transform', d => `rotate(${d.rotation} ${d.zone.x1} ${d.zone.y1})`)
            .attr('fill', d => d.color)
            .attr('fill-opacity', 1)
        
    }
    if (type === 'target') window.setTimeout(() => { props.endTransition(props.zone) }, 1000)
    // console.log('drawn')
}
