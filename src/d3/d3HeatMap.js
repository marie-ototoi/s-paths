import * as d3 from 'd3'
import d3Legend from './d3Legend'
import dataLib from '../lib/dataLib'
import statisticalOperator from '../lib/statLib'

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
    /* ******************************************************************************************************** */
    /* *****************************    Panel Initializtion    ************************************************ */
    /* ******************************************************************************************************** */
    let width = props.display.zones.main.width
    let centerWidth = width * 0.5
    let height = props.display.zones.main.height
    let centerHeight = height * 0.5
    let div = d3.select(el).append('g').attr('id', 'heatMapCenterPanel').attr('transform', ('translate(' + (width - centerWidth) / 2 + ',' + (height - centerHeight) / 2 + ')'))
    let divLegend = d3.select(el).append('g').attr('id', 'legend').attr('transform', ('translate(' + 0 + ',' + (centerHeight + (height - centerHeight) / 2) + ')'))
    d3Legend.create(divLegend, {width: (width - centerWidth) / 2, height: (height - centerHeight) / 2}, 'heatMap', addSelectionUsingRange, removeSelectionUsingRange)

    /* ******************************************************************************************************** */
    /* *****************************    data verification    ************************************************** */
    /* ******************************************************************************************************** */
    let xElements = d3.set(data.data.map(item => item.prop1)).values()
    let yElements = d3.set(data.data.map(item => item.prop2)).values()

    /* ******************************************************************************************************** */
    /* *****************************    heatmap creation   **************************************************** */
    /* ******************************************************************************************************** */

    let itemSizeX = centerWidth / xElements.length
    let itemSizeY = centerHeight / yElements.length

    let xScale = d3.scaleBand()
        .domain(xElements)
        .range([0, centerWidth])
    let xAxis = d3.axisTop()
        .scale(xScale)

    let yScale = d3.scaleBand()
        .domain(yElements)
        .range([0, centerHeight])
    let yAxis = d3.axisLeft()
        .scale(yScale)

    let cells = div.selectAll('rect')
        .data(data.data)
        .enter().append('g').append('rect')
        .attr('id', d => d.prop1 + d.prop2)
        .attr('width', itemSizeX)
        .attr('height', itemSizeY)
        .attr('x', d => xScale(d.prop1))
        .attr('y', d => yScale(d.prop2))
        .attr('fill', d => colorChooser(d.value, data.min, data.max))
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

    div.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')

    div.append('g')
        .attr('class', 'x axis')
        .call(xAxis)
        .attr('transform', 'translate(0,' + centerHeight + ')')
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style('text-anchor', 'start')
        .attr('dx', '.8em')
        .attr('dy', '.5em')
        .attr('transform', 'rotate(65)')
}

const update = (el, props) => {
    if (el && props.data) {
        resize(el, props)
    }
}

const destroy = (el) => {

}

const resize = (el, props) => {
    const { display } = props
}

exports.create = create
exports.destroy = destroy
exports.update = update
exports.colorChooser = colorChooser
