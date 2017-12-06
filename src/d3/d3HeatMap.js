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

    let nbColor = props.dataStat.max - props.dataStat.min + 1
    const colors = getQuantitativeColors(nbColor)
    let step = (data.max - data.min + 1) / colors.length
    for (var i = 0; i < colors.length; i++) {
        let key = 'less than ' + (data.min + ((i) * step)).toFixed(0) + ' nobels'
        paletteObj.push({ key: key, color: colors[i] })
    }
    /* ******************************************************************************************************** */
    /* *****************************    Panel Initializtion    ************************************************ */
    /* ******************************************************************************************************** */
    let div = d3.select(el).append('g').attr('id', 'heatMapCenterPanel')
    d3.select(el).append('g').attr('id', 'centerPatternLib')

    div.append('g').attr('id', 'center')
        .selectAll('rect')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('id', d => '-' + d.prop1 + '-' + d.prop2 + '-')
        .attr('stroke', 'transparent')
        .attr('fill', function (d) {
            for (var i = 0; i < colors.length; i++) {
                if (!(data.min + ((i) * step) < d.value)) {
                    let color = paletteObj.filter(p => (p.key === ('less than ' + (data.min + ((i) * step)).toFixed(0) + ' nobels')))[0].color
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
    let xElements = d3.set(props.dataStat.data.map(item => item.prop1)).values()
    let yElements = d3.set(props.dataStat.data.map(item => item.prop2)).values()

    let width = props.display.viz.useful_width
    let height = props.display.viz.useful_height
    d3.select('#heatMapCenterPanel').attr('transform', ('translate(' + props.display.viz.horizontal_margin + ',' + props.display.viz.vertical_margin + ')'))

    let itemSizeX = width / xElements.length
    let itemSizeY = height / yElements.length

    let xScale = d3.scaleBand()
        .range([0, width])
        .domain(xElements)

    let yScale = d3.scaleBand()
        .range([0, height])
        .domain(yElements)
    d3.select('#center').selectAll('rect')
        .attr('id', d => 'id' + '-' + d.prop1 + '-' + d.prop2 + '-')
        .attr('width', itemSizeX - 1)
        .attr('height', itemSizeY - 1)
        .attr('x', d => xScale(d.prop1) + 0.5)
        .attr('y', d => yScale(d.prop2) + 0.5)
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

const heatMapAxisBehaviors = (type) => {
    return {}
    /*
    return {
        title: { mouseover: () => {},
            mouseleave: () => {},
            click: () => {} },
        key: {
            mouseover: (name) => {
                d3.select('#center').selectAll('rect').filter(function () {
                    return this.getAttribute('id').includes('-' + name + '-')
                }).attr('fill', 'blue')
            },
            mouseleave: (name) => {
                d3.select('#center').selectAll('rect').filter(function () {
                    return this.getAttribute('id').includes('-' + name + '-')
                }).attr('fill', function () { return this.getAttribute('savFill') })
            },
            click: () => {} }
    }
    */
}

exports.create = create
exports.destroy = destroy
exports.update = update
exports.heatMapAxisBehaviors = heatMapAxisBehaviors
