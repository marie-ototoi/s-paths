import * as d3 from 'd3'
import data from '../lib/dataLib'

const assignBehavior = (el, props) => {
    const { selectElements, info } = props
    const axisItems = d3.select(el).selectAll('.tick')
        .classed('selectable', d => {
            let data = info.filter(i => `${i.key}` === `${d}`)
            return (data.length > 0)
        })
    axisItems.selectAll('text, line, rect')
        .on('click', (d) => {
            let data = info.filter(i => `${i.key}` === `${d}`)
            if (data.length > 0) {
                selectElements(data[0].propName, data[0].values, data[0].category)
            }
        })
}

const update = (el, props) => {
    //
    if (el && props.data) {
        resize(el, props)
        assignBehavior(el, props)
    }
}

const destroy = (el) => {
    //
    d3.select(el).remove()
}

const resize = (el, props) => {
    const { category, info, width, type } = props
    const scale = d3.scaleLinear()
        .domain([info[0].key, info[info.length - 1].key])
        .range([0, width])
    d3.select(el).selectAll(`.axis${type}`).remove()
    const axis = d3[`axis${type}`]()
        .scale(scale)
    if (category === 'text' || category === 'uri') {
        axis
            .tickValues(info.map(v => v.key))
    } else if (category === 'number') {
        axis
            .tickFormat(d3.format(','))
            .tickValues(info.map(v => Number(v.key)))
    } else if (category === 'datetime') {
        axis
            .tickFormat(d3.format('.0f'))
            .ticks(info.length) // to be fixed : if there's many empty values on the scale 
            // and the length of the info array is closer to a multiple, there might be only one out of two ticks
    }
    d3.select(el).append('g')
        .attr('class', `axis${type}`)
        .call(axis)
    d3.select(el).selectAll('.domain').remove()
    const ticks = d3.select(el).selectAll('.tick')
    const tickWidth = Math.floor(width / ticks.size())
    ticks.append('rect')
        .classed('reactzone', true)
        .attr('width', tickWidth)
        .attr('height', 7)
}

exports.destroy = destroy
exports.update = update
