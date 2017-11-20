import * as d3 from 'd3'
import d3Legend from './d3Legend'
import dataLib from '../lib/dataLib'
import statisticalOperator from '../lib/statLib'
import palette from '../lib/paletteLib.js'
import config from '../lib/configLib'

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

const repeat = (cell) => {
    cell.attr('stroke-dasharray', '5')
        .attr('stroke-dashoffset', '0')
        .transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attr('stroke-dashoffset', '20')
        .on('end', function () { repeat(cell) })
}

const selectCell = (cell) => {
    cell.attr('stroke-width', 4)
    repeat(cell)
    cell.attr('isSelected', 1)
}

const deselectCell = (cell) => {
    cell.attr('stroke-width', 0.5)
    cell.attr('isSelected', 0)
}

const addSelectionUsingRange = (min, max) => {
    let hmin = getHue(colorChooser(min, 0, 100))
    let hmax = getHue(colorChooser(max, 0, 100))
    d3.select('#heatMapCenterPanel').selectAll('rect')
        .each(function () {
            if (hmin >= getHue(this.getAttribute('fill')) && getHue(this.getAttribute('fill')) >= hmax && Number(this.getAttribute('isSelected')) === 0) {
                selectCell(d3.select(this))
            }
        })
}

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
    const { configs, palettes, zone, getPropPalette, setLegend } = props
    const selectedConfig = config.getSelectedConfig(configs, zone)
    const prop2 = selectedConfig.selectedMatch.properties[1].path
    const palette = getPropPalette(palettes, prop2, 6)
    const paletteObj = []
    for (var i = 0; i < 5; i++) {
        paletteObj.push({ key: '<' + (i + 1) * 20 + '%', color: palette[i] })
    }
    /* ******************************************************************************************************** */
    /* *****************************    Panel Initializtion    ************************************************ */
    /* ******************************************************************************************************** */

    let div = d3.select(el).append('g').attr('id', 'heatMapCenterPanel')
    //    let divLegend = d3.select(el).append('g').attr('id', 'heatmapLegend')

    /* ******************************************************************************************************** */
    /* *****************************    heatmap creation   **************************************************** */
    /* ******************************************************************************************************** */

    div.selectAll('rect')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('id', d => d.prop1 + d.prop2)
        .attr('fill', function (d) {
            let percent = ((d.value - data.min) * 100) / (data.max - data.min)
            if (percent < 20) percent += 20
            return paletteObj.filter(p => (p.key === ('<' + (percent - (percent % 20)) + '%')))[0].color
        })

    div.append('g')
        .attr('id', 'abscisse')
        .selectAll('text')
        .attr('font-weight', 'normal')

    div.append('g')
        .attr('id', 'ordonne')
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style('text-anchor', 'start')
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
    let xAxis = d3.axisTop()
        .scale(xScale)

    let yScale = d3.scaleBand()
        .range([0, height])
        .domain(yElements)
    let yAxis = d3.axisLeft()
        .scale(yScale)

    d3.select('#heatMapCenterPanel').selectAll('rect')
        .attr('width', itemSizeX)
        .attr('height', itemSizeY)
        .attr('x', d => xScale(d.prop1))
        .attr('y', d => yScale(d.prop2))
    //        .attr('fill', d => colorChooser(d.value, data.min, data.max))d => paletteObj.filter(p => (p.key === d.prop2.value || p.key === d.labelprop2.value))[0].color )
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .attr('isSelected', 0)
        .on('click', function (d) {
            if (Number(this.getAttribute('isSelected')) === 0) {
                selectCell(d3.select(this))
            } else {
                deselectCell(d3.select(this))
            }
        })

    d3.select('#ordonne')
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')

    d3.select('#abscisse')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')')
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style('text-anchor', 'start')
        .attr('dx', '.8em')
        .attr('dy', '.5em')
        .attr('transform', 'rotate(65)')

    //  d3Legend.update(d3.select('#heatmapLegend'), props)
}

exports.create = create
exports.destroy = destroy
exports.update = update
exports.colorChooser = colorChooser
exports.addSelectionUsingRange = addSelectionUsingRange
exports.removeSelectionUsingRange = removeSelectionUsingRange
