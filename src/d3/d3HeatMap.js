import * as d3 from 'd3'
import d3Legend from './d3Legend'
import dataLib from '../lib/dataLib'
import statisticalOperator from '../lib/statLib'
import {getQuantitativeColors, getPatternsPalette, colorPattern} from '../lib/paletteLib.js'
import config from '../lib/configLib'

/*
const colorChooser = (value, min = 0, max = 1) => {
    let ramp = d3.scaleLinear().domain([min, max]).range([60, 0])
    if (ramp(value) <= 15) return 'hsl(' + d3.scaleLinear().domain([0, 15]).range([0, 18])(ramp(value)) + ', 100%, 50%)'
    if (ramp(value) <= 30) return 'hsl(' + d3.scaleLinear().domain([15, 30]).range([21, 29])(ramp(value)) + ', 94%, 50%)'
    if (ramp(value) <= 45) return 'hsl(' + d3.scaleLinear().domain([30, 45]).range([34, 44])(ramp(value)) + ', 88%, 50%)'
    else return 'hsl(' + d3.scaleLinear().domain([45, 60]).range([55, 60])(ramp(value)) + ', 82%, 50%)'
}

const getHue = (color) => {
    return Number(color.split('(')[1].split(',')[0])
}
*/
const repeat = (cell) => {
    cell.attr('stroke-dasharray', '5')
        .attr('stroke-dashoffset', '0')
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attr('stroke-dashoffset', '20')
        .on('end', function () { repeat(cell) })
}

/** ************************************************** PATTERN EXAMPLE *****************************************************/
const selectCell = (cell) => {
    /* let rand = Math.random() * (11 - 0) + 0
    var patterns = getPatternsPalette(11)
    var url = colorPattern(d3.select('#heatMapCenterPanel'), patterns[Math.trunc(rand)], cell.attr('fill'))
    cell.attr('fill', url) */
/*
    let indexProp1 = xElements.indexOf(d.prop1)
    let indexProp2 = yElements.indexOf(d.prop2)
    selectCell(d3.select('#id' + xElements[indexProp1 - 1] + yElements[indexProp2]))
    selectCell(d3.select('#id' + xElements[indexProp1 + 1] + yElements[indexProp2]))
    selectCell(d3.select('#id' + xElements[indexProp1] + yElements[indexProp2 + 1]))
    selectCell(d3.select('#id' + xElements[indexProp1] + yElements[indexProp2 - 1]))
*/
    d3.select(cell).attr('stroke-width', 4)
    repeat(d3.select(cell))
    d3.select(cell).attr('isSelected', 1)
}

const deselectCell = (cell) => {
    cell.attr('stroke-width', 0.5)
    cell.attr('isSelected', 0)
    cell.transition()
    cell.attr('stroke-dasharray', '0')
    cell.attr('stroke-dashoffset', '0')
}
/*
const addSelectionUsingRange = (min, max) => {
    let hmin = getHue(colorChooser(min, 0, 100))
    let hmax = getHue(colorChooser(max, 0, 100))
    d3.select('#heatMapCenterPanel').selectAll('rect')
        .each(function () {
            if (hmin >= getHue(this.getAttribute('fill')) && getHue(this.getAttribute('fill')) >= hmax && Number(this.getAttribute('isSelected')) === 0) {
                selectCell(d3.select(this))
            }
        })
} */

const removeSelectionUsingRange = (min, max) => {
/*    console.log(min, max)
    let hmin = colorChooser(min, 0, 100)
    let hmax = colorChooser(max, 0, 100)
    d3.select('#heatMapCenterPanel').selectAll('rec')
        .each(function () {
            if (hmin < this.getAttribute('fill').h < hmax) {
                this.setAttribute('width', itemSizeX)
                this.setAttribute('height', itemSizeY)
                this.setAttribute('x', xScale(d.prop1))
                this.setAttribute('y', yScale(d.prop2))
                this.setAttribute('stroke-width', 0.5)
                this.setAttribute('isSelected', 1)
            }
        }) */
}

const create = (el, props) => {
    if (!(el && dataLib.areLoaded(props.data, props.zone))) return
    let data = statisticalOperator.computeStatisticalInformation(props.data.filter(d => d.zone === props.zone)[0])
    let xElements = d3.set(data.data.map(item => item.prop1)).values()
    let yElements = d3.set(data.data.map(item => item.prop2)).values()

    const { setLegend } = props
    const paletteObj = []
    const color = getQuantitativeColors(5)
    let step = (data.max - data.min) / 5
    for (var i = 0; i < 5; i++) {
        let key = 'less than ' + data.min + ((i + 1) * step) + ' items'
        paletteObj.push({ key: key, color: color[i] })
    }
    /* ******************************************************************************************************** */
    /* *****************************    Panel Initializtion    ************************************************ */
    /* ******************************************************************************************************** */
    var svgDefs = d3.select(el).append('defs')
    let shadowGradient = svgDefs.append('linearGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .attr('id', 'shadow')
    shadowGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#000000')
    shadowGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#999999')
    let div = d3.select(el).append('g').attr('id', 'heatMapCenterPanel')
    //    let divLegend = d3.select(el).append('g').attr('id', 'heatmapLegend')

    /* ******************************************************************************************************** */
    /* *****************************    heatmap creation   **************************************************** */
    /* ******************************************************************************************************** */
    let absc = div.append('g')
        .attr('id', 'abscisse')
    absc.append('g').attr('id', 'abscShadow')
    absc.append('g').attr('id', 'abscButton')
    absc.selectAll('text')
        .attr('font-weight', 'normal')
    d3.select('#abscShadow')
        .selectAll('rect')
        .data(xElements)
        .enter()
        .append('rect')
    d3.select('#abscButton')
        .selectAll('rect')
        .data(xElements)
        .enter()
        .append('rect')
        .on('click', function (d1) {
            d3.select('#center').selectAll('rect').each(function (d2) { if (d2.prop1 === d1) selectCell(this) })
            let posY = Number(this.getAttribute('y'))
            let bar = d3.select(this)
            bar.transition()
                .duration(20)
                .attr('y', posY + 3)
                .on('end', function () {
                    bar.transition()
                        .duration(20)
                        .attr('y', posY)
                })
        })
        .on('mouseover', function () {
            this.setAttribute('stroke-width', 1.5)
        })
        .on('mouseleave', function () {
            this.setAttribute('stroke-width', 0.5)
        })
    let ordo = div.append('g')
        .attr('id', 'ordonne')
    ordo.append('g').attr('id', 'ordoShadow')
    ordo.append('g').attr('id', 'ordoButton')
    ordo.selectAll('text')
        .attr('font-weight', 'normal')
        .style('text-anchor', 'start')
    d3.select('#ordoShadow')
        .selectAll('rect')
        .data(yElements)
        .enter()
        .append('rect')
    d3.select('#ordoButton')
        .selectAll('rect')
        .data(yElements)
        .enter()
        .append('rect')
        .on('click', function (d1) {
            d3.select('#center').selectAll('rect').each(function (d2) { if (d2.prop2 === d1) selectCell(this) })
            let posY = Number(this.getAttribute('y'))
            let bar = d3.select(this)
            bar.transition()
                .duration(20)
                .attr('y', posY + 3)
                .on('end', function () {
                    bar.transition()
                        .duration(20)
                        .attr('y', posY)
                })
        })
        .on('mouseover', function () {
            this.setAttribute('stroke-width', 1.5)
        })
        .on('mouseleave', function () {
            this.setAttribute('stroke-width', 0.5)
        })
    /*
    d3.select('#ordoButtonAdd').selectAll('text')
        .data(yElements)
        .enter()
        .append('text')
        .style('pointer-event', 'none')
    d3.select('#ordoButtonRem').selectAll('ellipse')
        .data(yElements)
        .enter()
        .append('ellipse')
        .on('click', function (d1) {
            d3.select('#center').selectAll('rect').each(function (d2) { if (d2.prop2 === d1) deselectCell(d3.select(this)) })
        })
    d3.select('#ordoButtonRem').selectAll('text')
        .data(yElements)
        .enter()
        .append('text')
        .style('pointer-event', 'none')
*/

    d3.select('#abscButtonAdd').selectAll('rect')
        .data(xElements)
        .enter()
        .append('rect')
        .on('click', function (d1) {
            d3.select('#center').selectAll('rect').each(function (d2) { if (d2.prop1 === d1) selectCell(this) })
        })
    /*    d3.select('#abscButtonAdd').selectAll('text')
        .data(xElements)
        .enter()
        .append('text')
        .style('pointer-event', 'none')
    d3.select('#abscButtonRem').selectAll('ellipse')
        .data(xElements)
        .enter()
        .append('ellipse')
        .on('click', function (d1) {
            d3.select('#center').selectAll('rect').each(function (d2) { if (d2.prop1 === d1) deselectCell(d3.select(this)) })
        })
    d3.select('#abscButtonRem').selectAll('text')
        .data(xElements)
        .enter()
        .append('text')
        .style('pointer-event', 'none')
*/
    div.append('g').attr('id', 'center')
        .selectAll('rect')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('id', d => d.prop1 + d.prop2)
        .attr('fill', function (d) {
            for (var i = 0; i < 5; i++) {
                if (!(data.min + ((i + 1) * step) < d.value)) return paletteObj.filter(p => (p.key === ('less than ' + data.min + ((i + 1) * step) + ' items')))[0].color
            }
        })

    resize(el, props)

    //  d3Legend.create(divLegend, props)
    setLegend(paletteObj)
}

const update = (el, props) => {
    if (el && props.data) {
        resize(el, props)
    }
}

const destroy = (el) => {

}

const resize = (el, props) => {
    let data = statisticalOperator.computeStatisticalInformation(props.data.filter(d => d.zone === props.zone)[0])
    let xElements = d3.set(data.data.map(item => item.prop1)).values()
    let yElements = d3.set(data.data.map(item => item.prop2)).values()

    let width = props.display.viz.useful_width
    let height = props.display.viz.useful_height

    d3.select('#heatMapCenterPanel').attr('transform', ('translate(' + props.display.viz.horizontal_margin + ',' + props.display.viz.vertical_margin + ')'))

    let itemSizeX = width / xElements.length
    let itemSizeY = height / yElements.length

    let xScale = d3.scaleBand()
        .range([0, width])
        .domain(xElements)
    let xAxis = d3.axisBottom()
        .scale(xScale)

    let yScale = d3.scaleBand()
        .range([0, height])
        .domain(yElements)
    let yAxis = d3.axisLeft()
        .scale(yScale)

    d3.select('#center').selectAll('rect')
        .attr('id', d => 'id' + d.prop1 + d.prop2)
        .attr('width', itemSizeX - 1)
        .attr('height', itemSizeY - 1)
        .attr('x', d => xScale(d.prop1) + 0.5)
        .attr('y', d => yScale(d.prop2) + 0.5)
    //        .attr('fill', d => colorChooser(d.value, data.min, data.max))d => paletteObj.filter(p => (p.key === d.prop2.value || p.key === d.labelprop2.value))[0].color )
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('isSelected', 0)
        .on('mouseover', function () {
            this.setAttribute('stroke-width', 3)
        })
        .on('mouseleave', function () {
            this.setAttribute('stroke-width', 0.5)
        })
        .on('click', function (d) {
            if (Number(this.getAttribute('isSelected')) === 0) {
                selectCell(this)
            } else {
                deselectCell(d3.select(this))
            }
        })

    let dy = 15
    let maxLength = getMaxLength(d3.select('#ordonne'))
    d3.select('#ordonne')
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .attr('dx', -dy)
    d3.select('#ordoButton').selectAll('rect')
        .attr('x', (-maxLength * 2) - 5)
        .attr('y', d => (yScale(d) + (itemSizeY / 2) - 15))
        .attr('width', maxLength * 2)
        .attr('height', 30)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('fill', '#f2f2f2')
        .attr('rx', 5)
        .attr('ry', 5)
    d3.select('#ordoShadow').selectAll('rect')
        .attr('x', (-maxLength * 2) - 5)
        .attr('y', d => (yScale(d) + (itemSizeY / 2) - 15))
        .attr('width', 2 + maxLength * 2)
        .attr('height', 32)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', 'url(#shadow)')
    /*    d3.select('#ordoButtonAdd').selectAll('text')
        .attr('x', 1)
        .attr('y', d => (yScale(d) + (itemSizeY / 4)))
        .attr('font-size', '20px')
        .text('+')
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
    d3.select('#ordoButtonRem').selectAll('ellipse')
        .attr('cx', 0)
        .attr('cy', d => (yScale(d) + (itemSizeY * (6 / 8))))
        .attr('rx', 18)
        .attr('ry', itemSizeY / 4)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', 'lightgrey')
    d3.select('#ordoButtonRem').selectAll('text')
        .attr('x', 1)
        .attr('y', d => (yScale(d) + (itemSizeY * (6 / 8))))
        .attr('font-size', '20px')
        .text('-')
        .attr('fill', 'black')
        .attr('text-anchor', 'middle') */
    maxLength = getMaxLength(d3.select('#abscisse'))
    d3.select('#abscisse')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')')
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style('text-anchor', 'middle')
        .attr('dy', dy)
    d3.select('#abscButton').selectAll('rect')
        .attr('x', d => xScale(d) + itemSizeX / 6)
        .attr('y', (dy / 4))
        .attr('width', maxLength * 2)
        .attr('height', 30)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('fill', '#f2f2f2')
        .attr('rx', 5)
        .attr('ry', 5)
    d3.select('#abscShadow').selectAll('rect')
        .attr('x', d => xScale(d) + itemSizeX / 6)
        .attr('y', (dy / 4))
        .attr('width', 2 + maxLength * 2)
        .attr('height', 32)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', 'url(#shadow)')
    //  d3Legend.update(d3.select('#heatmapLegend'), props)
}

const getMaxLength = (el) => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    ctx.font = '11px Arial'
    var max = 0
    el.selectAll('text').each(function () {
        let l = d3.select(this).text()
        let ml = ctx.measureText(l).width
        if (ml > max) max = ml
    })
    return max
}

exports.create = create
exports.destroy = destroy
exports.update = update
// exports.colorChooser = colorChooser
// exports.addSelectionUsingRange = addSelectionUsingRange
exports.removeSelectionUsingRange = removeSelectionUsingRange
