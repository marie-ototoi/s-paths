import * as d3 from 'd3'
import config from '../lib/config'
import data from '../lib/data'

const create = (el, props) => {
    // console.log('create', config.getSelectedConfig(props.configs, props.zone))
    if (el && data.areLoaded(props.data, props.zone)) {
        const selectedConfig = config.getSelectedConfig(props.configs, props.zone)
        const selectedData = data.getResults(props.data, props.zone)
        const nestedData = data.groupTimeData(selectedData, 'prop1', selectedConfig.selectedMatch.properties[0].format, 150)
        // console.log(props.display)
        
        // console.log(nestedData)
        const timeUnits = d3.select(el)
            .selectAll('g.time')
            .data(nestedData)
            .enter()
            .append('g')
            .attr('class', 'time')
        const bookUnits = timeUnits.selectAll('line')
            .data(d => d.values)
            .enter()
            .append('line')
        resize(el, props)
    }
}

const update = (el, props) => {
    //
    if (el && props.data) {
        resize(el, props)
    }
}

const destroy = (el) => {
    //
}

const resize = (el, props) => {
    const { display } = props
    const selectedData = data.getResults(props.data, props.zone)
    const xScale = d3.scaleLinear()
        .domain([Number(selectedData[0].prop1.value), Number(selectedData[selectedData.length - 1].prop1.value)])
        .range([0, display.viz.useful_width])
    let maxUnitsPerYear = 1
    const timeUnits = d3.select(el)
        .selectAll('g.time')
        .attr('transform', d => `translate(${xScale(Number(d.key))}, 0)`)
        .each(d => {
            if (d.values.length > maxUnitsPerYear) maxUnitsPerYear = d.values.length
        })
    const bookUnits = timeUnits.selectAll('line')        
    const unitHeight = Math.floor(display.viz.useful_height / maxUnitsPerYear)
    const unitWidth = Math.floor(display.viz.useful_width / timeUnits.size())
    bookUnits
        .attr('x1', Math.ceil(unitWidth/2))
        .attr('x2', Math.ceil(unitWidth/2))
        .attr('y1', (d, i) => display.viz.useful_height - (i * unitHeight))
        .attr('y2', (d, i) => display.viz.useful_height - (i * unitHeight + unitHeight - 1))
        .attr('stroke', '#000')
        .attr('stroke-width', unitWidth - 1)
    
    d3.select(el).selectAll('.xaxis').remove()
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format('.0f'))
        
    d3.select(el).append('g')
        .attr('class', 'xaxis')
        .attr('transform', `translate(0, ${display.viz.useful_height})`)
        .call(xAxis)
}

exports.create = create
exports.destroy = destroy
exports.update = update
