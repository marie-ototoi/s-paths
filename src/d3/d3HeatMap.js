import * as d3 from 'd3'
import statisticalOperator from '../lib/statisticalOperator'

const colorChooser = (value, min = 0, max = 1) => {
    let ramp = d3.scaleLinear().domain([min, max]).range([135, 0])
    return 'hsl(' + (ramp(value) > 75 ? ramp(value) + 135 : ramp(value)) + ', 100%, 50%)'
}

const create = (el, state) => {
    /* ******************************************************************************************************** */
    /* *****************************    data verification    ************************************************** */
    /* ******************************************************************************************************** */
    let sortedData = statisticalOperator.computeStatisticalInformation(state.data.filter(d => d.zone === state.zone)[0])
    let xElements = d3.set(sortedData.data.map(item => item.prop1)).values()
    let yElements = d3.set(sortedData.data.map(item => item.prop2)).values()

    /* ******************************************************************************************************** */
    /* *****************************    heatmap creation   **************************************************** */
    /* ******************************************************************************************************** */

    let div = d3.select(el)
    let width = state.display.zones.main.width
    let height = state.display.zones.main.height
    let itemSizeX = width / xElements.length
    let itemSizeY = height / yElements.length

    let xScale = d3.scaleBand()
        .domain(xElements)
        .range([0, width])
    let xAxis = d3.axisTop()
        .scale(xScale)

    let yScale = d3.scaleBand()
        .domain(yElements)
        .range([0, height])
    let yAxis = d3.axisLeft()
        .scale(yScale)

    let cells = div.selectAll('rect')
        .data(sortedData.data)
        .enter().append('g').append('rect')
        .attr('class', 'cell')
        .attr('width', itemSizeX)
        .attr('height', itemSizeY)
        .attr('x', d => xScale(d.prop1))
        .attr('y', d => yScale(d.prop2))
        .attr('fill', d => colorChooser(d.value, sortedData.min, sortedData.max))
        .on('click', function (d) {
            console.log(d.prop1, d.prop2, d.value)
        })

    div.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .selectAll('text')
        .attr('font-weight', 'normal')

    div.append('g')
        .attr('class', 'x axis')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')')
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
