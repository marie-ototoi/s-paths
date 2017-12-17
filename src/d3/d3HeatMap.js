import * as d3 from 'd3'
import d3Legend from './d3Legend'
import dataLib from '../lib/dataLib'
import {getQuantitativeColors} from '../lib/paletteLib.js'
import config from '../lib/configLib'
import {dragSelection} from './d3DragSelector'
import selectionLib from '../lib/selectionLib'

const selectCell = (el, cell, up, down, left, right) => {
    cell.attr('opacity', 1)
    // cell.attr('fill', colorPattern(d3.select(el).select('#centerPatternLib'), 'lines', cell.attr('fill')))
/*    if (!up.empty()) {
        let idUp = 'selec' + up.attr('id') + cell.attr('id')
        if (Number(up.attr('isSelected')) === 1) {
            d3.select(el).select('#' + idUp).remove()
        } else {
            d3.select(el).select('#selectionCenter').append('line')
                .attr('id', idUp)
                .attr('x1', cell.attr('x'))
                .attr('y1', cell.attr('y'))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', cell.attr('y'))
                .attr('stroke', 'blue')
                .attr('stroke-width', 4.5)
        }
    } else {
        d3.select(el).select('#selectionCenter').append('line')
            .attr('id', 'selecUp' + cell.attr('id'))
            .attr('x1', cell.attr('x'))
            .attr('y1', cell.attr('y'))
            .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
            .attr('y2', cell.attr('y'))
            .attr('stroke', 'blue')
            .attr('stroke-width', 4.5)
    }
    if (!down.empty()) {
        let idDown = 'selec' + cell.attr('id') + down.attr('id')
        if (Number(down.attr('isSelected')) === 1) {
            d3.select(el).select('#' + idDown).remove()
        } else {
            d3.select(el).select('#selectionCenter').append('line')
                .attr('id', idDown)
                .attr('x1', cell.attr('x'))
                .attr('y1', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'blue')
                .attr('stroke-width', 4.5)
        }
    } else {
        d3.select(el).select('#selectionCenter').append('line')
            .attr('id', 'selecDown' + cell.attr('id'))
            .attr('x1', cell.attr('x'))
            .attr('y1', Number(cell.attr('y')) + Number(cell.attr('height')))
            .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
            .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
            .attr('stroke', 'blue')
            .attr('stroke-width', 4.5)
    }
    if (!left.empty()) {
        let idUp = 'selec' + left.attr('id') + cell.attr('id')
        if (Number(left.attr('isSelected')) === 1) {
            d3.select(el).select('#' + idUp).remove()
        } else {
            d3.select(el).select('#selectionCenter').append('line')
                .attr('id', idUp)
                .attr('x1', cell.attr('x'))
                .attr('y1', cell.attr('y'))
                .attr('x2', cell.attr('x'))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'blue')
                .attr('stroke-width', 4.5)
        }
    } else {
        d3.select(el).select('#selectionCenter').append('line')
            .attr('id', 'selecleft' + cell.attr('id'))
            .attr('x1', cell.attr('x'))
            .attr('y1', cell.attr('y'))
            .attr('x2', cell.attr('x'))
            .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
            .attr('stroke', 'blue')
            .attr('stroke-width', 4.5)
    }
    if (!right.empty()) {
        let idUp = 'selec' + cell.attr('id') + right.attr('id')
        if (Number(right.attr('isSelected')) === 1) {
            d3.select(el).select('#' + idUp).remove()
        } else {
            d3.select(el).select('#selectionCenter').append('line')
                .attr('id', idUp)
                .attr('x1', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y1', cell.attr('y'))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'blue')
                .attr('stroke-width', 4.5)
        }
    } else {
        d3.select(el).select('#selectionCenter').append('line')
            .attr('id', 'selecRight' + cell.attr('id'))
            .attr('x1', Number(cell.attr('x')) + Number(cell.attr('width')))
            .attr('y1', cell.attr('y'))
            .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
            .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
            .attr('stroke', 'blue')
            .attr('stroke-width', 4.5)
    }

    /*
    d3.select('#selectionCenter').append('polygon')
            .attr('points',
                '' + (Number(cell.attr('x'))) + ',' + (Number(cell.attr('y'))) + ' ' +
                  '' + (Number(cell.attr('x'))) + ',' + (Number(cell.attr('y'))) + ' ' +
                  '' + (Number(cell.attr('x'))) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height'))) + ' ' +
                  '' + (Number(cell.attr('x')) + 4) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height')) - 15) + ' ')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', '#1a66ff')
        //        .attr('opacity', 0.85)
        d3.select('#selectionCenter').append('polygon')
            .attr('points',
                '' + (Number(cell.attr('x')) + 4) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height')) - 15) + ' ' +
                  '' + (Number(cell.attr('x'))) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height'))) + ' ' +
                  '' + (Number(cell.attr('x')) + Number(cell.attr('width'))) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height'))) + ' ' +
                  '' + (Number(cell.attr('x')) + Number(cell.attr('width')) + 4) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height')) - 15) + ' ')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', '#1a66ff')
        d3.select('#selectionCenter').append('polygon')
            .attr('points',
                '' + (Number(cell.attr('x'))) + ',' + (Number(cell.attr('y'))) + ' ' +
                '' + (Number(cell.attr('x'))) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height'))) + ' ' +
                '' + (Number(cell.attr('x')) + Number(cell.attr('width'))) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height'))) + ' ' +
                '' + (Number(cell.attr('x')) + Number(cell.attr('width'))) + ',' + (Number(cell.attr('y'))) + ' ')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('fill', cell.attr('fill'))
            .transition()
            .duration(200)
            .attr('points',
                '' + (Number(cell.attr('x'))) + ',' + (Number(cell.attr('y'))) + ' ' +
                '' + (Number(cell.attr('x')) + 4) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height')) - 15) + ' ' +
                '' + (Number(cell.attr('x')) + Number(cell.attr('width')) + 4) + ',' + (Number(cell.attr('y')) + Number(cell.attr('height')) - 15) + ' ' +
                '' + (Number(cell.attr('x')) + Number(cell.attr('width'))) + ',' + (Number(cell.attr('y'))) + ' ')
        //        .attr('opacity', 0.85)
        /*    d3.select('#selectionCenter').append('rect')
            .attr('x', cell.attr('x'))
            .attr('y', cell.attr('y'))
            .attr('width', cell.attr('width'))
            .attr('height', cell.attr('height'))
            .attr('fill', cell.attr('fill'))
            .attr('opacity', 0.85)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .transition()
            .duration(200)
            .attr('height', function () { return Number(this.getAttribute('height')) - 15 })

        cell.attr('fill', 'transparent')
    */
}
const deselectCell = (el, cell, up, down, left, right) => {
    cell.attr('opacity', 0.4)
    // console.log(cell.attr('color'))
    // cell.attr('fill', cell.attr('color'))
/*
    if (!up.empty()) {
        let idUp = 'selec' + up.attr('id') + cell.attr('id')
        if (Number(up.attr('isSelected')) === 1) {
            d3.select(el).select('#selectionCenter').append('line')
                .attr('id', idUp)
                .attr('x1', cell.attr('x'))
                .attr('y1', cell.attr('y'))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', cell.attr('y'))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        } else {
            d3.select(el).select('#' + idUp).remove()
        }
    } else {
        d3.select(el).select('#selecUp' + cell.attr('id')).remove()
    }
    if (!down.empty()) {
        let idDown = 'selec' + cell.attr('id') + down.attr('id')
        if (Number(down.attr('isSelected')) === 1) {
            d3.select(el).select('#selectionCenter').append('line')
                .attr('id', idDown)
                .attr('x1', cell.attr('x'))
                .attr('y1', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        } else {
            d3.select(el).select('#' + idDown).remove()
        }
    } else {
        d3.select(el).select('#selecDown' + cell.attr('id')).remove()
    }
    if (!left.empty()) {
        let idUp = 'selec' + left.attr('id') + cell.attr('id')
        if (Number(left.attr('isSelected')) === 1) {
            d3.select(el).select('#selectionCenter').append('line')
                .attr('id', idUp)
                .attr('x1', cell.attr('x'))
                .attr('y1', cell.attr('y'))
                .attr('x2', cell.attr('x'))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        } else {
            d3.select(el).select('#' + idUp).remove()
        }
    } else {
        d3.select(el).select('#selecleft' + cell.attr('id')).remove()
    }
    if (!right.empty()) {
        let idUp = 'selec' + cell.attr('id') + right.attr('id')
        if (Number(right.attr('isSelected')) === 1) {
            d3.select(el).select('#selectionCenter').append('line')
                .attr('id', idUp)
                .attr('x1', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y1', cell.attr('y'))
                .attr('x2', Number(cell.attr('x')) + Number(cell.attr('width')))
                .attr('y2', Number(cell.attr('y')) + Number(cell.attr('height')))
                .attr('stroke', 'black')
                .attr('stroke-width', 4.5)
        } else {
            d3.select(el).select('#' + idUp).remove()
        }
    } else {
        d3.select(el).select('#selecRight' + cell.attr('id')).remove()
    }
    */
}

const selectDrag = (props, el, position) => {
    let listRect = []
    position.x1 -= Number(d3.select(el).attr('transform').split(',')[0].split('(')[1])
    position.x2 -= Number(d3.select(el).attr('transform').split(',')[0].split('(')[1])
    if (position.x1 > position.x2) { let inter = position.x1; position.x1 = position.x2; position.x2 = inter }
    position.y1 -= Number(d3.select(el).attr('transform').split(',')[1].split(')')[0])
    position.y2 -= Number(d3.select(el).attr('transform').split(',')[1].split(')')[0])
    if (position.y1 > position.y2) { let inter = position.y1; position.y1 = position.y2; position.y2 = inter }
    d3.select(el).select('#center').selectAll('rect')
        .each(function (d) {
            let maxgauche = Math.max(Number(this.getAttribute('x')), position.x1)
            let mindroit = Math.min(Number(this.getAttribute('x')) + Number(this.getAttribute('width')), position.x2)
            let maxbas = Math.max(Number(this.getAttribute('y')), position.y1)
            let minhaut = Math.min(Number(this.getAttribute('y')) + Number(this.getAttribute('height')), position.y2)
            if (maxgauche < mindroit && maxbas < minhaut && Number(this.getAttribute('isSelected')) === 0) {
                listRect.push(d.selection)
            }
        })
    props.selectElements(listRect)
}

const create = (el, props) => {
    // console.log(el, props)
    if (!(el && props.data)) return

    let data = props.dataStat
    let xElements = d3.set(data.data.map(item => item.prop1)).values()
    let yElements = d3.set(data.data.map(item => item.prop2)).values()

    /* ******************************************************************************************************** */
    /* *****************************    Create group and bind data    ***************************************** */
    /* ******************************************************************************************************** */
    const { selectedConfig } = props
    let div = d3.select(el).append('g').attr('id', 'heatMapCenterPanel')
    d3.select(el).append('g').attr('id', 'centerPatternLib')
    div.append('g').attr('id', 'center')
    div.append('g').attr('id', 'selectionCenter')

    d3.select(el).select('#center').selectAll('rect')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('id', d => 'id-' + xElements.indexOf(d.prop1) + '-' + yElements.indexOf(d.prop2) + '-')
        .attr('idProp', d => 'id-' + d.prop1 + '-' + d.prop2 + '-')
        .attr('isSelected', 0)
        .attr('stroke', 'transparent')
        .attr('fill', function (d) {
            return d.color
        })
        .attr('opacity', 0.4)
        .each(function (d, i) {
            d.selection = {
                selector: `heatMap_element_${i}`,
                props: [
                    { path: selectedConfig.properties[0].path, value: d.prop1 },
                    { path: selectedConfig.properties[1].path, value: d.prop2 }
                ]
            }
        })

        /* ******************************************************************************************************** */
        /* *****************************    Assign behavior to data    ******************************************** */
        /* ******************************************************************************************************** */
    const { selectElements } = props
    d3.select(el).select('#center').selectAll('rect')
        .on('mouseover', function () {
            this.setAttribute('stroke-width', 3)
            this.setAttribute('stroke', 'black')
        })
        .on('mouseleave', function () {
            this.setAttribute('stroke-width', 0.5)
            this.setAttribute('stroke', 'transparent')
        })
        .on('click', function (d) {
            selectElements([d.selection])
        })

    /* ******************************************************************************************************** */
    /* *****************************    SELEC DRAG    ********************************************************* */
    /* ******************************************************************************************************** */
    div.call(dragSelection(div._groups[0][0], selectDrag.bind(this, props), () => {}))

    /* ******************************************************************************************************** */
    /* *****************************    init legend    ********************************************************* */
    /* ******************************************************************************************************** */
    const { setLegend } = props
    setLegend(props.palette)

    /* ******************************************************************************************************** */
    /* *****************************    compute size/placement of items    ************************************ */
    /* ******************************************************************************************************** */
    resize(el, props)
}

const update = (el, props) => {
    if (el && props.data) {
        resize(el, props)
        redraw(el, props)
    }
}

const destroy = (el) => {

}

const redraw = (el, props) => {
    // change color or class when component is rerendered
    const { selections, zone, selectElements } = props
    d3.select(el).select('#center').selectAll('rect')
        .each(function (d, i) {
            d.selected = selectionLib.areSelected([d.selection], zone, selections)
            let indexProp1 = Number(this.getAttribute('id').split('-')[1])
            let indexProp2 = Number(this.getAttribute('id').split('-')[2])
            let left = d3.select(el).select('#id-' + (indexProp1 - 1) + '-' + indexProp2 + '-')
            let right = d3.select(el).select('#id-' + (indexProp1 + 1) + '-' + indexProp2 + '-')
            let down = d3.select(el).select('#id-' + indexProp1 + '-' + (indexProp2 + 1) + '-')
            let up = d3.select(el).select('#id-' + indexProp1 + '-' + (indexProp2 - 1) + '-')

            if (d.selected && d3.select(this).attr('isSelected') === '0') {
                selectCell(el, d3.select(this), up, down, left, right)
                d3.select(this).attr('isSelected', 1)
            } else if (!d.selected && d3.select(this).attr('isSelected') === '1') {
                deselectCell(el, d3.select(this), up, down, left, right)
                d3.select(this).attr('isSelected', 0)
            }
        })
}

const resize = (el, props) => {
    let xElements = d3.set(props.dataStat.data.map(item => item.prop1)).values()
    let yElements = d3.set(props.dataStat.data.map(item => item.prop2)).values()

    let width = props.display.viz.useful_width
    let height = props.display.viz.useful_height
    d3.select(el).select('#heatMapCenterPanel').attr('transform', ('translate(' + props.display.viz.horizontal_margin + ',' + props.display.viz.vertical_margin + ')'))

    let itemSizeX = width / xElements.length
    let itemSizeY = height / yElements.length

    let xScale = d3.scaleBand()
        .range([0, width])
        .domain(xElements)

    let yScale = d3.scaleBand()
        .range([0, height])
        .domain(yElements)
    /*
    if (d3.select('#selectionCenter').attr('itemX') === null) d3.select('#selectionCenter').attr('itemX', itemSizeX - 1)
    if (d3.select('#selectionCenter').attr('itemY') === null) d3.select('#selectionCenter').attr('itemY', itemSizeY - 1)

    let ratioX = ((itemSizeX - 1) / d3.select('#selectionCenter').attr('itemX'))
    let ratioY = ((itemSizeY - 1) / d3.select('#selectionCenter').attr('itemY'))
    console.log(ratioX, ratioY)

    d3.select('#selectionCenter').attr('transform', 'scale(' + ratioX + ',' + ratioY + ')')

    .selectAll('line')
        .attr('x1', function () { return this.getAttribute('x1')  ratio })
        .attr('y1', function () { return this.getAttribute('y1') * ratio })
        .attr('x2', function () { return this.getAttribute('x2') * ratio })
        .attr('y2', function () { return this.getAttribute('y2') * ratio })
*/
    d3.select(el).select('#center').selectAll('rect')
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
    return {
        title: {
            mouseover: () => {},
            mouseleave: () => {},
            click: () => {}
        },
        key: {
            mouseover: () => {},
            mouseleave: () => {},
            click: (selectElements, name) => {
                let listRect = []
                d3.select('#center').selectAll('rect').filter(function () {
                    return this.getAttribute('idProp').includes('-' + name + '-')
                }).each(function (d) {
                    listRect.push(d.selection)
                })
                selectElements(listRect)
            }
        }
    }
}

const heatMapLegendBehavior = (color) => {
    let listRect = []
    d3.select('#center').selectAll('rect').filter(function () {
        return this.getAttribute('fill').includes(color)
    }).each(function (d) {
        listRect.push(d.selection)
    })
    return listRect
}

exports.create = create
exports.destroy = destroy
exports.update = update
exports.heatMapAxisBehaviors = heatMapAxisBehaviors
exports.heatMapLegendBehavior = heatMapLegendBehavior
