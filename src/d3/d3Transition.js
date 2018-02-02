import * as d3 from 'd3'

const create = (el, props) => {
    // console.log('create', el, props)
    if (el && props) {
        draw(el, props)
    }
}

const draw = (el, props) => {
    const originRectangles = props.elements.origin.filter(el => el.shape === 'rectangle')
    const targetRectangles = props.elements.target.filter(el => el.shape === 'rectangle')
    drawRectangles(el, props, originRectangles)
    // console.log('draw A', originRectangles)
    drawRectangles(el, props, targetRectangles)
    // console.log('draw B', targetRectangles)
    // console.log('meoui', originRectangles)
}

const drawRectangles = (el, props, rectangles) => {
    if (rectangles.length > 0) {
        const rectanglesSelection = d3.select(el).selectAll('rect')
            .data(rectangles, (d) => d.query.value)

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
            .on('end', (d, i) => {
                // call only once
                called++
                if (called >= changeRectangles.size() - 2) {
                    props.endTransition(props.zone)
                }
            })
    }
    // console.log('drawn')
}

exports.create = create
