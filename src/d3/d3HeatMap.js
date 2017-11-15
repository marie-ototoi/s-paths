import * as d3 from 'd3'
import d3Legend from './d3Legend'

const colorChooser = (value, min = 0, max = 1) => {
    let ramp = d3.scaleLinear().domain([min, max]).range([120, 0])
    return 'hsl(' + (ramp(value) > 75 ? ramp(value) + 120 : ramp(value)) + ', 100%, 50%)'
}

const getHue = (color) => {
    return Number(color.split('(')[1].split(',')[0])
}

const addSelectionUsingRange = (min, max) => {
    console.log(min, max)
    let hmin = getHue(colorChooser(min, 0, 100))
    let hmax = getHue(colorChooser(max, 0, 100))
    console.log(hmin, hmax)
    d3.select('#heatMapCenterPanel').selectAll('rect')
        .each(function () {
            console.log(getHue(this.getAttribute('fill')))
            if (hmin >= getHue(this.getAttribute('fill')) && getHue(this.getAttribute('fill')) >= hmax && Number(this.getAttribute('isSelected')) === 0) {
                let reductionPx = Number(this.getAttribute('width')) * 0.15
                this.setAttribute('y', Number(this.getAttribute('y')) + reductionPx)
                this.setAttribute('x', Number(this.getAttribute('x')) + reductionPx)
                this.setAttribute('width', Number(this.getAttribute('width')) - reductionPx * 2)
                this.setAttribute('height', Number(this.getAttribute('height')) - reductionPx * 2)
                this.setAttribute('stroke-width', reductionPx * 2)
                this.setAttribute('isSelected', 1)
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

const create = (el, display, data, addSelection, removeSelection) => {
    /* ******************************************************************************************************** */
    /* *****************************    Panel Initializtion    ************************************************ */
    /* ******************************************************************************************************** */
    let width = display.zones.main.width
    let centerWidth = width * 0.5
    let height = display.zones.main.height
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
                let reductionPx = Number(this.getAttribute('width')) * 0.15
                this.setAttribute('y', Number(this.getAttribute('y')) + reductionPx)
                this.setAttribute('x', Number(this.getAttribute('x')) + reductionPx)
                this.setAttribute('width', Number(this.getAttribute('width')) - reductionPx * 2)
                this.setAttribute('height', Number(this.getAttribute('height')) - reductionPx * 2)
                this.setAttribute('stroke-width', reductionPx * 2)
            } else {
                this.setAttribute('width', itemSizeX)
                this.setAttribute('height', itemSizeY)
                this.setAttribute('x', xScale(d.prop1))
                this.setAttribute('y', yScale(d.prop2))
                this.setAttribute('stroke-width', 0.5)
            }
            this.setAttribute('isSelected', (Number(this.getAttribute('isSelected')) + 1) % 2)
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

const update = (el, state) => {
}

const destroy = (el) => {

}

exports.create = create
exports.destroy = destroy
exports.update = update
exports.colorChooser = colorChooser
