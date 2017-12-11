import * as d3 from 'd3'

const dragSelection = (el, callBackDrag, callBackClick) => {
    return d3.drag()
        .on('start', function () {
            dragStart(el)
        })
        .on('drag', function () {
            drag(el)
        })
        .on('end', function () {
            dragEnd(el, callBackDrag, callBackClick)
        })
}

const dragStart = (el) => {
    d3.select(el).attr('mode', 'click')
        .attr('dragX1', d3.event.x)
        .attr('dragY1', d3.event.y)
    d3.select(el).append('rect')
        .attr('id', 'dragArea')
        .attr('transform', 'translate(' +
     -Number(d3.select(el).attr('transform').split(',')[0].split('(')[1]) +
    ',' +
    -Number(d3.select(el).attr('transform').split(',')[1].split(')')[0]) +
    ')')
        .attr('x', d3.event.x)
        .attr('y', d3.event.y)
        .attr('width', 1)
        .attr('height', 1)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'transparent')
        .style('pointer-events', 'none')
}

const drag = (el) => {
    d3.select(el).attr('mode', 'drag')
        .attr('dragX2', d3.event.x)
        .attr('dragY2', d3.event.y)
    d3.select('#dragArea')
        .attr('x', function () { return Math.min(d3.event.x, d3.select(el).attr('dragX1')) })
        .attr('y', function () { return Math.min(d3.event.y, d3.select(el).attr('dragY1')) })
        .attr('width', function () { return Math.max(d3.event.x, d3.select(el).attr('dragX1')) - this.getAttribute('x') })
        .attr('height', function () { return Math.max(d3.event.y, d3.select(el).attr('dragY1')) - this.getAttribute('y') })
}

const dragEnd = (el, callBackDrag, callBackClick) => {
    d3.select(el).select('#dragArea').remove()
    let position = {
        x1: Number(d3.select(el).attr('dragX1')),
        y1: Number(d3.select(el).attr('dragY1')),
        x2: Number(d3.select(el).attr('dragX2')),
        y2: Number(d3.select(el).attr('dragY2'))
    }
    switch (d3.select(el).attr('mode')) {
    case 'drag':
        callBackDrag(el, position)
        break
    case 'click':
        callBackClick(el, position)
        break
    default:
        return null
    }
}

exports.dragSelection = dragSelection
