import * as d3 from 'd3'
import { colorChooser } from './d3HeatMap'

const createColoredBar = (el, id, x, y, width, height, value, addSelection, removeSelection) => {
    var svgDefs = el.append('defs')
    let mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'gradientBar' + id)
    mainGradient.append('stop')
        .attr('stop-color', colorChooser(value, 0, 100))
        .attr('offset', id * 25 + '%')
    mainGradient.append('stop')
        .attr('stop-color', colorChooser(value, 0, 100))
        .attr('offset', (id + 1) * 25 + '%')
    let shadowGradient = svgDefs.append('linearGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .attr('id', 'shadow')
    shadowGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'black')
    shadowGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'lightgrey')

    el.append('text')
        .text(id * 25 + '% <')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
        .attr('text-anchor', 'end')
        .attr('x', x - 5)
        .attr('y', y + height)
        .attr('font-weight', 'bold')
    el.append('rect')
        .attr('x', x)
        .attr('y', y + 5)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'url(#shadow)')
        .attr('stroke', 'none')
        .attr('rx', 4)
        .attr('ry', 4)
    el.append('rect')
        .attr('id', 'legendBar' + id)
        .attr('x', x)
        .attr('y', y)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'url(#gradientBar' + id + ')')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('rx', 2)
        .attr('ry', 2)
        .on('mouseover', function () {
            this.setAttribute('stroke-width', 1.5)
        })
        .on('mouseleave', function () {
            this.setAttribute('stroke-width', 0.5)
        })
        .on('click', function () {
            addSelection(id * 25, (id + 1) * 25)
            let posY = Number(this.getAttribute('y'))
            let bar = d3.select(this)
            bar.transition()
                .duration(20)
                .attr('y', posY + 5)
                .on('end', function () {
                    bar.transition()
                        .duration(20)
                        .attr('y', posY)
                })
        })
}

const createHeatMapLegend = (el, display, addSelection, removeSelection) => {
    /** *****************   PLACE LEGEND BAR   ******************************/
    let titlex = display.width * 0.5
    let titley = display.height * 0.2
    el.append('text')
        .text('Percent of Dy/Dx among data')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
        .attr('x', titlex)
        .attr('y', titley)
    for (var i = 0; i < 4; i++) {
        let barHeight = (display.height * 0.6) * 0.1
        let x = display.width * 0.4
        let y = (display.height * 0.3) + ((i * 2) * barHeight)
        let barWidth = display.width * 0.2
        createColoredBar(el, i, x, y, barWidth, barHeight, (i * 25), addSelection, removeSelection)
    }
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
