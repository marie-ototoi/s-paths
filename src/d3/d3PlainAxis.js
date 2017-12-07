import * as d3 from 'd3'
import data from '../lib/dataLib'

const assignBehavior = (el, props) => {
    const { selectElements, info } = props
    const axisItems = d3.select(el).selectAll('.tick text')
        .each(d => {
            let data = info.filter(i => i.label === d)
        })
        .on('click', (d) => {
            console.log('salut')
            selectElements(d.propName, d.key)
        }) // send list of selectors
}

const update = (el, props) => {
    //
    if (el && props.data) {
        resize(el, props)
        assignBehavior(el, props)
        color(el, props)
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
    d3.select(el).selectAll('.xaxis').remove()
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
}

const color = (el, props) => {
    d3.select(el).selectAll('.domain')
        .attr('stroke', '#bbb')
    d3.select(el).selectAll('.tick line')
        .attr('stroke', '#bbb')
    d3.select(el).selectAll('.tick text')
        .attr('fill', '#bbb')
}

exports.destroy = destroy
exports.update = update
