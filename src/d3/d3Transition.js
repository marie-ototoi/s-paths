import * as d3 from 'd3'

const create = (el, props) => {
    // console.log('create', props.elements)
    if (el && props) {
        draw(el, props)
    }
}
const destroy = (el, props) => {
    d3.select(el).selectAll('rect')
        .remove()
}

const draw = (el, props) => {
    const originRectangles = props.elements.origin.filter(el => el.shape === 'rectangle')
    const targetRectangles = props.elements.target.filter(el => el.shape === 'rectangle')
    drawRectangles(el, props, originRectangles, 'origin')
    // console.log('draw A', props.zone, originRectangles)
    drawRectangles(el, props, targetRectangles, 'target')
    // console.log('draw B', targetRectangles)
    // console.log('meoui', originRectangles)
}

const drawRectangles = (el, props, rectangles, type) => {
    // console.log(`|||||drawRectangles`, props.zone, type)
    if (rectangles.length > 0) {
        const rectanglesSelection = d3.select(el).selectAll('rect')
            .data(rectangles, (d) => {
                return (d.signature) ? d.signature : d.query.value
            })

        const tChange = d3.transition()
            .duration(750)

        const tRemove = d3.transition()
            .duration(250)

        rectanglesSelection
            .enter()
            .append('rect')
            .attr('x', d => d.zone.x1)
            .attr('y', d => d.zone.y1)
            .attr('width', d => d.zone.width)
            .attr('height', d => d.zone.height)
            .attr('fill', d => d.color)
            .attr('fill-opacity', d => d.opacity)

        rectanglesSelection.exit()
            .transition(tRemove)
            .attr('fill-opacity', 0)
            .remove()
        let called = 0
        let changeRectangles = rectanglesSelection
            .transition(tChange)
            .attr('x', d => d.zone.x1)
            .attr('y', d => d.zone.y1)
            .attr('width', d => d.zone.width)
            .attr('height', d => d.zone.height)
            .attr('fill', d => d.color)
            .attr('fill-opacity', 1)
    }
    if (type === 'target') window.setTimeout(() => { props.endTransition(props.zone) }, 1000)
    // console.log('drawn')
}

exports.create = create
exports.destroy = destroy
