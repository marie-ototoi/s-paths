import * as d3 from 'd3'

let colorChooser = (value, min = 0, max = 1) => {
    let ramp = d3.scaleLinear().domain([min, max]).range([135, 0])
    return 'hsl(' + (ramp(value) > 75 ? ramp(value) + 135 : ramp(value)) + ', 100%, 50%)'
}

let dataSort = (data) => {
    let statistics = []
    let total = 0
    let res = []
    data.statements.results.bindings.forEach(function (item) {
        let prop1 = item.prop1.value
        let prop2 = item.prop2.value
        let index1 = (Number(prop1) - Number(prop1) % 10) + ''
        if (index1 in statistics) {
            if (prop2 in statistics[index1]) {
                statistics[index1][prop2] = statistics[index1][prop2] + 1
                total++
            } else {
                statistics[index1][prop2] = 1
                total++
            }
        } else {
            statistics[index1] = []
            statistics[index1][prop2] = 1
            total++
        }
    })
    let minValue = 1
    let maxValue = 0
    for (let k1 in statistics) {
        for (let k2 in statistics[k1]) {
            statistics[k1][k2] = statistics[k1][k2] / total
            if (statistics[k1][k2] > maxValue) maxValue = statistics[k1][k2]
            if (statistics[k1][k2] < minValue) minValue = statistics[k1][k2]
            let newItem = {}
            newItem.prop1 = k1
            newItem.prop2 = k2
            newItem.value = statistics[k1][k2]
            res.push(newItem)
        }
    }
    return { data: res, min: minValue, max: maxValue }
}

const create = (el, state) => {
    /* ******************************************************************************************************** */
    /* *****************************    data verification    ************************************************** */
    /* ******************************************************************************************************** */
    let sortedData = null
    state.data.forEach(function (item) {
        if (item.zone === state.zone) sortedData = dataSort(item)
    })
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
