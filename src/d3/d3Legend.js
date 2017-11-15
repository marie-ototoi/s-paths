import * as d3 from 'd3'
import { colorChooser } from './d3HeatMap'

const createHeatMapLegend = (el, display, addSelection, removeSelection) => {
    /** ******************   CREATE GRADIENT   ******************************/
    var svgDefs = el.append('defs')
    var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient')
    for (var i = 0; i < 100; i += 10) {
        mainGradient.append('stop')
            .attr('stop-color', colorChooser(i, 0, 100))
            .attr('offset', i + '%')
    }
    /** *****************   PLACE LEGEND BAR   ******************************/
    /*    el.append('text')
        .text('100%')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
        .attr('x', display.width * 0.9)
        .attr('y', display.height * 0.35)
        .attr('font-weight', 'bold')
    el.append('text')
        .text('0%')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
        .attr('x', display.width * 0.1)
        .attr('y', display.height * 0.35)
        .attr('font-weight', 'bold') */
    let legendBar = el.append('rect')
        .attr('id', 'legendBar')
        .attr('x', display.width * 0.1)
        .attr('y', display.height * 0.4)
        .attr('width', display.width * 0.55)
        .attr('height', 15)
        .attr('fill', 'url(#mainGradient)')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
    el.append('text')
        .text('Percent of Dy/Dx among data')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
        .attr('x', Number(d3.select('#legendBar').attr('x')) + (Number(d3.select('#legendBar').attr('width')) / 2))
        .attr('y', display.height * 0.35)

    let lCursor = el.append('polygon')
        .attr('id', 'lCursor')
        .attr('transX', display.width * 0.1)
        .attr('transY', display.height * 0.4)
        .attr('transform', 'translate(' + display.width * 0.1 + ',' + display.height * 0.4 + ')')
        .style('stroke', 'black')
        .style('fill', 'grey')
        .style('stroke-width', 1.5)
        .style('stroke-linejoin', 'round')
        .attr('points', '0,-3, 0,30, -12,30, -12,16, 0,-3')
    el.append('text')
        .attr('id', 'lText')
        .text('0%')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10px')
        .attr('text-anchor', 'end')
        .attr('x', display.width * 0.1)
        .attr('y', display.height * 0.4 + 42)
        .attr('font-weight', 'bold')

    let rCursor = el.append('polygon')
        .attr('id', 'rCursor')
        .attr('transX', Number(d3.select('#legendBar').attr('x')) + Number(d3.select('#legendBar').attr('width')))
        .attr('transY', display.height * 0.4)
        .attr('transform', 'translate(' + (Number(d3.select('#legendBar').attr('x')) + Number(d3.select('#legendBar').attr('width'))) + ',' + display.height * 0.4 + ')')
        .style('stroke', 'black')
        .style('fill', 'grey')
        .style('stroke-width', 1.5)
        .style('stroke-linejoin', 'round')
        .attr('points', '0,-3, 0,30, 12,30, 12,16, 0,-3')
    el.append('text')
        .attr('id', 'rText')
        .text('100%')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10px')
        .attr('text-anchor', 'start')
        .attr('x', Number(d3.select('#legendBar').attr('x')) + Number(d3.select('#legendBar').attr('width')))
        .attr('y', display.height * 0.4 + 42)
        .attr('font-weight', 'bold')

    el.append('rect')
        .attr('stroke', 'black')
        .attr('fill', 'lightgrey')
        .attr('width', 25).attr('height', 26)
        .attr('x', Number(d3.select('#legendBar').attr('x')) + Number(d3.select('#legendBar').attr('width')) + 30)
        .attr('y', Number(legendBar.attr('y')))
        .on('click', function () {
            console.log('add selection')
            let rText = d3.select('#rText')
            let lText = d3.select('#lText')
            let rTextValue = parseInt(d3.scaleLinear().domain([Number(legendBar.attr('x')), Number(legendBar.attr('width')) + Number(legendBar.attr('x'))]).range([0, 100])(Number(rText.attr('x'))))
            let lTextValue = parseInt(d3.scaleLinear().domain([Number(legendBar.attr('x')), Number(legendBar.attr('width')) + Number(legendBar.attr('x'))]).range([0, 100])(Number(lText.attr('x'))))
            addSelection(lTextValue, rTextValue)
        })
    el.append('text')
        .attr('pointer-events', 'none')
        .text('+')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '16px')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('x', Number(d3.select('#legendBar').attr('x')) + Number(d3.select('#legendBar').attr('width')) + 30 + 12)
        .attr('y', Number(legendBar.attr('y')) + 18)

    el.append('rect')
        .attr('stroke', 'black')
        .attr('fill', 'lightgrey')
        .attr('width', 25).attr('height', 26)
        .attr('x', Number(d3.select('#legendBar').attr('x')) + Number(d3.select('#legendBar').attr('width')) + 55)
        .attr('y', Number(legendBar.attr('y')))
        .on('click', function () {
            console.log('remove selection')
            let rText = d3.select('#rText')
            let lText = d3.select('#lText')
            let rTextValue = parseInt(d3.scaleLinear().domain([Number(legendBar.attr('x')), Number(legendBar.attr('width')) + Number(legendBar.attr('x'))]).range([0, 100])(Number(rText.attr('x'))))
            let lTextValue = parseInt(d3.scaleLinear().domain([Number(legendBar.attr('x')), Number(legendBar.attr('width')) + Number(legendBar.attr('x'))]).range([0, 100])(Number(lText.attr('x'))))
            removeSelection(lTextValue, rTextValue)
        })
    el.append('text')
        .attr('pointer-events', 'none')
        .text('-')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '16px')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('x', Number(d3.select('#legendBar').attr('x')) + Number(d3.select('#legendBar').attr('width')) + 55 + 12)
        .attr('y', Number(legendBar.attr('y')) + 18)

    /*
    let polylineDots = lCursor.attr('transX') + ',' + (Number(lCursor.attr('transY')) + 30) + ',' +
                      (Number(lCursor.attr('transX')) + Number(rCursor.attr('transX'))) / 2 + ',' + (Number(lCursor.attr('transY')) + 40) + ',' +
                      rCursor.attr('transX') + ',' + (Number(rCursor.attr('transY')) + 30)
    console.log(polylineDots)
    el.append('polyline')
        .style('stroke', 'black')
        .style('fill', 'none')
        .style('stroke-width', 1.5)
        .style('stroke-linejoin', 'round')
        .attr('points', polylineDots)
    */
    setDragEffect(lCursor)
    setDragEffect(rCursor)
}

const setDragEffect = (cursor) => {
    cursor.call(d3.drag()
        .on('start', function () { return dragstarted(cursor) })
        .on('drag', function () { return dragged(cursor) })
        .on('end', function () { return dragended(cursor) })
    )
}

const dragstarted = (cursor) => {
    cursor.attr('dragX', d3.event.x)
}

const updateCursorValue = () => {
    let bar = d3.select('#legendBar')
    let rText = d3.select('#rText')
    let rTextValue = parseInt(d3.scaleLinear().domain([Number(bar.attr('x')), Number(bar.attr('width')) + Number(bar.attr('x'))]).range([0, 100])(Number(rText.attr('x'))))
    let lText = d3.select('#lText')
    let lTextValue = parseInt(d3.scaleLinear().domain([Number(bar.attr('x')), Number(bar.attr('width')) + Number(bar.attr('x'))]).range([0, 100])(Number(lText.attr('x'))))
    if (rTextValue === lTextValue) {
        lText.text('')
        rText.text(rTextValue + '%')
        rText.attr('text-anchor', 'middle')
    } else {
        lText.text(lTextValue + '%')
        rText.text(rTextValue + '%')
        rText.attr('text-anchor', 'start')
    }
}

const dragged = (cursor) => {
    let step = cursor.attr('dragX') - d3.event.x
    let newX = (Number(cursor.attr('transX')) - step)
    let bar = d3.select('#legendBar')
    if (newX > Number(bar.attr('width')) + Number(bar.attr('x'))) newX = Number(bar.attr('width')) + Number(bar.attr('x'))
    if (newX < Number(bar.attr('x'))) newX = Number(bar.attr('x'))
    switch (cursor.attr('id')) {
    case 'lCursor':
        let rCursor = d3.select('#rCursor')
        if (rCursor.attr('transX') < newX) {
            rCursor.attr('transX', newX).attr('transform', 'translate(' + newX + ',' + rCursor.attr('transY') + ')')
            d3.select('#rText').attr('x', newX)
        }
        d3.select('#lText').attr('x', newX)
        break
    case 'rCursor':
        let lCursor = d3.select('#lCursor')
        if (lCursor.attr('transX') > newX) {
            lCursor.attr('transX', newX).attr('transform', 'translate(' + newX + ',' + lCursor.attr('transY') + ')')
            d3.select('#lText').attr('x', newX)
        }
        d3.select('#rText').attr('x', newX)
        break
    default:
    }
    updateCursorValue()
    cursor.attr('transform', 'translate(' + newX + ',' + Number(cursor.attr('transY')) + ')')
}

const dragended = (cursor) => {
    let step = cursor.attr('dragX') - d3.event.x
    cursor.attr('transX', Number(cursor.attr('transX')) - step)
}

const create = (el, display, legendType = 'none', ...fun) => {
    switch (legendType) {
    case 'heatMap':
        createHeatMapLegend(el, display, fun[0], fun[1])
        break
    default:
    }
}

const update = (el, state) => {
}

const destroy = (el) => {

}

exports.create = create
exports.destroy = destroy
exports.update = update
