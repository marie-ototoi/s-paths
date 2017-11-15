import * as d3 from 'd3'
import config from '../lib/config'
import data from '../lib/data'


const create = (el, props) => {
    // console.log('create', config.getSelectedConfig(props.configs, props.zone))
    if (el && data.areLoaded(props.data, props.zone)) {
        const selectedConfig = config.getSelectedConfig(props.configs, props.zone)
        const selectedData = data.getResults(props.data, props.zone)
        const nestedData = data.groupTimeData(selectedData, 'prop1', selectedConfig.properties[0].format, 150)
        // console.log(selectedData[0].prop1.value, selectedData[selectedData.length - 1].prop1.value)
        const xScale = d3.scaleLinear()
            .domain([Number(selectedData[0].prop1.value), Number(selectedData[selectedData.length - 1].prop1.value)])
            .range([0, props.display.zones[props.zone].width])
        // console.log(nestedData)
        const timeUnits = d3.select(el)
            .selectAll('g.time')
            .data(nestedData)
            .enter()
            .append('g')
            .attr('class', 'time')
            .attr('transform', d => `translate(${xScale(Number(d.key))}, 0)`)
        timeUnits.selectAll('line')
            .data(d => d.values)
            .enter()
            .append('line')
            .attr('x1', (d, i) => i * 3)
            .attr('x2', (d, i) => i * 3)
            .attr('y1', d => 10)
            .attr('y2', d => 200)
            .attr('stroke', '#000')
    }
}

const update = (el, props) => {
    //
    if (el && props.data) {

    }
}

const destroy = (el) => {
    //
}

exports.create = create
exports.destroy = destroy
exports.update = update
