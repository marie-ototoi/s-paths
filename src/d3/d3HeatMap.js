import * as d3 from 'd3'
import d3Legend from './d3Legend'
import dataLib from '../lib/dataLib'
import statisticalOperator from '../lib/statLib'
import {getQuantitativeColors, getPatternsPalette, colorPattern} from '../lib/paletteLib.js'
import config from '../lib/configLib'

const selectCell = (cell, up, down, left, right) => {
    cell.attr('color', cell.attr('fill'))
    // cell.attr('fill', colorPattern(d3.select('#centerPatternLib'), 'lines', cell.attr('fill')))
    if (!up.empty()) {
        let idUp = 'selec' + up.attr('id') + cell.attr('id')
        if (Number(up.attr('isSelected')) === 1) {
            d3.select('#' + idUp).remove()
        } else {
            d3.select('#center').append('line')
                .attr('id', idUp)
                .attr('x1', cell.attr('x'))
                .attr('y1', cell.attr('y'))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', cell.attr('y'))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        }
    } else {
        d3.select('#center').append('line')
            .attr('id', 'selecUp' + cell.attr('id'))
            .attr('x1', cell.attr('x'))
            .attr('y1', cell.attr('y'))
            .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
            .attr('y2', cell.attr('y'))
            .attr('stroke', 'black')
            .attr('stroke-width', 4.5)
    }
    if (!down.empty()) {
        let idDown = 'selec' + cell.attr('id') + down.attr('id')
        if (Number(down.attr('isSelected')) === 1) {
            d3.select('#' + idDown).remove()
        } else {
            d3.select('#center').append('line')
                .attr('id', idDown)
                .attr('x1', cell.attr('x'))
                .attr('y1', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        }
    } else {
        d3.select('#center').append('line')
            .attr('id', 'selecDown' + cell.attr('id'))
            .attr('x1', cell.attr('x'))
            .attr('y1', Number(cell.attr('y')) + Number(cell.attr('height')))
            .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
            .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
            .attr('stroke', 'black')
            .attr('stroke-width', 4.5)
    }
    if (!left.empty()) {
        let idUp = 'selec' + left.attr('id') + cell.attr('id')
        if (Number(left.attr('isSelected')) === 1) {
            d3.select('#' + idUp).remove()
        } else {
            d3.select('#center').append('line')
                .attr('id', idUp)
                .attr('x1', cell.attr('x'))
                .attr('y1', cell.attr('y'))
                .attr('x2', cell.attr('x'))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        }
    } else {
        d3.select('#center').append('line')
            .attr('id', 'selecleft' + cell.attr('id'))
            .attr('x1', cell.attr('x'))
            .attr('y1', cell.attr('y'))
            .attr('x2', cell.attr('x'))
            .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
            .attr('stroke', 'black')
            .attr('stroke-width', 4.5)
    }
    if (!right.empty()) {
        let idUp = 'selec' + cell.attr('id') + right.attr('id')
        if (Number(right.attr('isSelected')) === 1) {
            d3.select('#' + idUp).remove()
        } else {
            d3.select('#center').append('line')
                .attr('id', idUp)
                .attr('x1', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y1', cell.attr('y'))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        }
    } else {
        d3.select('#center').append('line')
            .attr('id', 'selecRight' + cell.attr('id'))
            .attr('x1', Number(cell.attr('x')) + Number(cell.attr('width')))
            .attr('y1', cell.attr('y'))
            .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
            .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
            .attr('stroke', 'black')
            .attr('stroke-width', 4.5)
    }
    cell.attr('isSelected', 1)
}

const deselectCell = (cell, up, down, left, right) => {
    cell.attr('fill', cell.attr('color'))
    if (!up.empty()) {
        let idUp = 'selec' + up.attr('id') + cell.attr('id')
        if (Number(up.attr('isSelected')) === 1) {
            d3.select('#center').append('line')
                .attr('id', idUp)
                .attr('x1', cell.attr('x'))
                .attr('y1', cell.attr('y'))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', cell.attr('y'))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        } else {
            d3.select('#' + idUp).remove()
        }
    } else {
        d3.select('#selecUp' + cell.attr('id')).remove()
    }
    if (!down.empty()) {
        let idDown = 'selec' + cell.attr('id') + down.attr('id')
        if (Number(down.attr('isSelected')) === 1) {
            d3.select('#center').append('line')
                .attr('id', idDown)
                .attr('x1', cell.attr('x'))
                .attr('y1', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        } else {
            d3.select('#' + idDown).remove()
        }
    } else {
        d3.select('#selecDown' + cell.attr('id')).remove()
    }
    if (!left.empty()) {
        let idUp = 'selec' + left.attr('id') + cell.attr('id')
        if (Number(left.attr('isSelected')) === 1) {
            d3.select('#center').append('line')
                .attr('id', idUp)
                .attr('x1', cell.attr('x'))
                .attr('y1', cell.attr('y'))
                .attr('x2', cell.attr('x'))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        } else {
            d3.select('#' + idUp).remove()
        }
    } else {
        d3.select('#selecleft' + cell.attr('id')).remove()
    }
    if (!right.empty()) {
        let idUp = 'selec' + cell.attr('id') + right.attr('id')
        if (Number(right.attr('isSelected')) === 1) {
            d3.select('#center').append('line')
                .attr('id', idUp)
                .attr('x1', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y1', cell.attr('y'))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        } else {
            d3.select('#' + idUp).remove()
        }
    } else {
        d3.select('#selecRight' + cell.attr('id')).remove()
    }
    cell.attr('isSelected', 0)
}

const create = (el, props) => {
    if (!(el && dataLib.areLoaded(props.data, props.zone))) return
    let data = props.dataStat
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
    let div = d3.select(el).append('g').attr('id', 'heatMapCenterPanel')
    d3.select(el).append('g').attr('id', 'centerPatternLib')
    /*
    let ordonne = d3.select(el).append('g')
    let positionOrdonne = {x2: props.display.viz.horizontal_margin,
        y2: props.display.viz.vertical_margin,
        x1: props.display.viz.horizontal_margin,
        y1: props.display.viz.vertical_margin + props.display.viz.useful_height }
    let interactionsO = { title: { mouseover: () => {}, mouseleave: () => {}, click: () => {} }, key: { mouseover: () => {}, mouseleave: () => {}, click: () => {} } }
    d3Axis.create(ordonne, props, 'Gender', yElements, positionOrdonne, 'vertical', interactionsO)

    let abscisse = d3.select(el).append('g')
    let positionAbscisse = {x1: props.display.viz.horizontal_margin,
        y1: props.display.viz.vertical_margin + props.display.viz.useful_height,
        x2: props.display.viz.horizontal_margin + props.display.viz.useful_width,
        y2: props.display.viz.vertical_margin + props.display.viz.useful_height }
    let interactionsA = {
        title: { mouseover: () => {},
            mouseleave: () => {},
            click: () => {} },
        key: {
            mouseover: (name) => {
                d3.select('#center').selectAll('rect').filter(function () {
                    return this.getAttribute('id').includes(name)
                }).attr('savFill', function () { return this.getAttribute('fill') })
                    .attr('fill', 'blue')
            },
            mouseleave: (name) => {
                d3.select('#center').selectAll('rect').filter(function () {
                    return this.getAttribute('id').includes(name)
                }).attr('fill', function () { return this.getAttribute('savFill') })
            },
            click: () => {} }
    }
    d3Axis.create(abscisse, props, ['Date', 'EX1', 'EX2'], xElements, positionAbscisse, 'horizontal', interactionsA)
    //    let divLegend = d3.select(el).append('g').attr('id', 'heatmapLegend')
    /* ******************************************************************************************************** */
    /* *****************************    heatmap creation   **************************************************** */
    /* ******************************************************************************************************** */
    /*    let absc = div.append('g')
        .attr('id', 'abscisse')
    absc.append('g').attr('id', 'abscShadow')
    absc.append('g').attr('id', 'abscButton')
    absc.selectAll('text')
        .attr('font-weight', 'normal')
    d3.select('#abscButton')
        .selectAll('rect')
        .data(xElements)
        .enter()
        .append('rect')
        .on('click', function (d1) {
            d3.select('#center').selectAll('rect').each(function (d2) {
                if (d2.prop1 === d1 && Number(this.getAttribute('isSelected')) === 0) {
                    let indexProp1 = xElements.indexOf(d2.prop1)
                    let indexProp2 = yElements.indexOf(d2.prop2)
                    let left = d3.select('#id' + xElements[indexProp1 - 1] + yElements[indexProp2])
                    let right = d3.select('#id' + xElements[indexProp1 + 1] + yElements[indexProp2])
                    let down = d3.select('#id' + xElements[indexProp1] + yElements[indexProp2 + 1])
                    let up = d3.select('#id' + xElements[indexProp1] + yElements[indexProp2 - 1])
                    selectCell(d3.select(this), up, down, left, right)
                }
            })
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
            this.setAttribute('fill', '#b3ecff')
            //            this.setAttribute('stroke', 'black')
        })
        .on('mouseleave', function () {
            this.setAttribute('stroke-width', 0.5)
            this.setAttribute('fill', 'transparent')
            //            this.setAttribute('stroke', 'transparent')
        })
    let ordo = div.append('g')
        .attr('id', 'ordonne')
    ordo.append('g').attr('id', 'ordoButton')
    d3.select('#ordoButton')
        .selectAll('rect')
        .data(yElements)
        .enter()
        .append('rect')
        .on('click', function (d1) {
            d3.select('#center').selectAll('rect').each(function (d2) {
                if (d2.prop2 === d1 && Number(this.getAttribute('isSelected')) === 0) {
                    let indexProp1 = xElements.indexOf(d2.prop1)
                    let indexProp2 = yElements.indexOf(d2.prop2)
                    let left = d3.select('#id' + xElements[indexProp1 - 1] + yElements[indexProp2])
                    let right = d3.select('#id' + xElements[indexProp1 + 1] + yElements[indexProp2])
                    let down = d3.select('#id' + xElements[indexProp1] + yElements[indexProp2 + 1])
                    let up = d3.select('#id' + xElements[indexProp1] + yElements[indexProp2 - 1])
                    selectCell(d3.select(this), up, down, left, right)
                }
            })
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
        .on('mouseover', function (d1) {
            this.setAttribute('stroke-width', 1.5)
            // this.setAttribute('stroke', 'black')
            this.setAttribute('fill', '#b3ecff')
        })
        .on('mouseleave', function () {
            this.setAttribute('stroke-width', 0.5)
            // this.setAttribute('stroke', 'transparent')
            this.setAttribute('fill', 'transparent')
        })
*/
    div.append('g').attr('id', 'center')
        .selectAll('rect')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('id', d => d.prop1 + d.prop2)
        .attr('stroke', 'transparent')
        .attr('fill', function (d) {
            for (var i = 0; i < 5; i++) {
                if (!(data.min + ((i + 1) * step) < d.value)) {
                    let color = paletteObj.filter(p => (p.key === ('less than ' + data.min + ((i + 1) * step) + ' items')))[0].color
                    this.setAttribute('savFill', color)
                    return color
                }
            }
        })
        .on('mouseover', function () {
            this.setAttribute('stroke-width', 3)
            this.setAttribute('stroke', 'black')
        })
        .on('mouseleave', function () {
            this.setAttribute('stroke-width', 0.5)
            this.setAttribute('stroke', 'transparent')
        })
        .on('click', function (d) {
            let indexProp1 = xElements.indexOf(d.prop1)
            let indexProp2 = yElements.indexOf(d.prop2)
            let left = d3.select('#id' + xElements[indexProp1 - 1] + yElements[indexProp2])
            let right = d3.select('#id' + xElements[indexProp1 + 1] + yElements[indexProp2])
            let down = d3.select('#id' + xElements[indexProp1] + yElements[indexProp2 + 1])
            let up = d3.select('#id' + xElements[indexProp1] + yElements[indexProp2 - 1])
            if (Number(this.getAttribute('isSelected')) === 0) {
                selectCell(d3.select(this), up, down, left, right)
            } else {
                deselectCell(d3.select(this), up, down, left, right)
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

    let dy = 15
    /* let maxLength = getMaxLength(d3.select('#ordonne'))
    d3.select('#ordonne')
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')
        .attr('dx', -dy)
        .style('pointer-events', 'none')
    d3.select('#ordoButton').selectAll('rect')
        .attr('x', (-maxLength * 2) - 5)
        .attr('y', d => (yScale(d) + (itemSizeY / 2) - 15))
        .attr('width', maxLength * 2)
        .attr('height', 30)
        .attr('stroke', 'transparent')
        .attr('stroke-width', 0.5)
        .attr('fill', 'transparent')
        .attr('rx', 5)
        .attr('ry', 5)
*/
/*
    let maxLength = getMaxLength(d3.select('#abscisse'))
    d3.select('#abscisse')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')')
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style('text-anchor', 'middle')
        .attr('dy', dy)
        .style('pointer-events', 'none')
    d3.select('#abscButton').selectAll('rect')
        .attr('x', d => xScale(d) + itemSizeX / 6)
        .attr('y', (dy / 4))
        .attr('width', maxLength * 2)
        .attr('height', 30)
        .attr('stroke', 'transparent')
        .attr('stroke-width', 0.5)
        .attr('fill', 'transparent')
        .attr('rx', 5)
        .attr('ry', 5)
        */
}

const getMaxLength = (el) => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    if (ctx === null) return 50
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
