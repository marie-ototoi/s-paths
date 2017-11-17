import * as d3 from 'd3'
import { colorChooser, addSelectionUsingRange, removeSelectionUsingRange } from './d3HeatMap'

const createColoredBar = (el, id, value) => {
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
        .attr('id', 'textbar' + id)
        .text(id * 25 + '% <')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
        .attr('text-anchor', 'end')
        .attr('font-weight', 'bold')
    el.append('rect')
        .attr('id', 'shadowbar' + id)
        .attr('fill', 'url(#shadow)')
        .attr('stroke', 'none')
        .attr('rx', 4)
        .attr('ry', 4)
    el.append('rect')
        .attr('id', 'legendbar' + id)
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
            addSelectionUsingRange(id * 25, (id + 1) * 25)
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

const create = (el, props) => {
    /** *****************   PLACE LEGEND BAR   ******************************/
    el.append('text')
        .attr('id', 'legendtitle')
        .text('Percent of Dy/Dx among data')
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
        .attr('text-anchor', 'middle')
    for (var i = 0; i < 4; i++) {
        createColoredBar(el, i, (i * 25))
    }
    resize(el, props)
}

const update = (el, props) => {
    if (el && props.data) {
        resize(el, props)
    }
}

const resize = (el, props) => {
    el.attr('transform', 'translate(0,' + (props.display.viz.useful_height + props.display.viz.vertical_margin) + ')')
    let titlex = props.display.viz.horizontal_margin * 0.5
    let titley = props.display.viz.vertical_margin * 0.2
    d3.select('#legendtitle')
        .attr('x', titlex)
        .attr('y', titley)
    for (var i = 0; i < 4; i++) {
        let height = (props.display.viz.vertical_margin * 0.6) * 0.1
        let x = props.display.viz.horizontal_margin * 0.4
        let y = (props.display.viz.vertical_margin * 0.3) + ((i * 2) * height)
        let width = props.display.viz.horizontal_margin * 0.2
        d3.select('#textbar' + i)
            .attr('x', x - 5)
            .attr('y', y + height)
        d3.select('#shadowbar' + i)
            .attr('x', x)
            .attr('y', y + 5)
            .attr('width', width)
            .attr('height', height)
        d3.select('#legendbar' + i)
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
    }
}

const destroy = (el) => {

}

exports.create = create
exports.destroy = destroy
exports.update = update
