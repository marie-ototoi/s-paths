import * as d3 from 'd3'
import dataLib from '../lib/dataLib'

const create = (el, props) => {
    //
    if (el && props.axis) {
        const { dimensions } = props
        draw(el, props)
        resize(el, props)
    }
}

const draw = (el, props) => {       
}

const update = (el, props) => {
    //
    if (el && props.axis) {
        draw(el, props)
        resize(el, props)
    }
}

const destroy = (el, props) => {
    //
}

const resize = (el, props) => {
    const { axis, dimensions, selectElements, type } = props
    const { info, category } = axis
    const scale = d3.scaleLinear()
        .domain([info[0].key, info[info.length - 1].key])
        .range([0, dimensions.width])
    d3.select(el).selectAll(`.axis${type}`).remove()
    const axisEl = d3[`axis${type}`]()
        .scale(scale)
    if (category === 'text' || category === 'uri') {
        axisEl
            .tickValues(info.map(v => v.key))
    } else if (category === 'number') {
        axisEl
            .tickFormat(d3.format(','))
            .tickValues(info.map(v => Number(v.key)))
    } else if (category === 'datetime') {
        const minDif = info.reduce((acc, current) => {
            if (acc.prev) {
                let dif = Number(current.key) - Number(acc.prev.key)
                if (!acc.dif || dif < acc.dif) acc.dif = dif            
            }
            acc.prev = current
            return acc
        }, {}).dif
        let ticksNumber = (Number(info[info.length - 1].key) - Number(info[0].key)) / minDif
        axisEl
            .tickFormat(d3.format('.0f'))
            .ticks(ticksNumber) // to be fixed : if there's many empty values on the scale 
            // and the length of the info array is closer to a multiple, there might be only one out of two ticks
    }
    d3.select(el).append('g')
        .attr('class', `axis${type}`)
        .call(axisEl)
    d3.select(el).selectAll('.domain').remove()
    const ticks = d3.select(el).selectAll('.tick')
    const tickWidth = Math.floor(dimensions.width / ticks.size())
    ticks.append('rect')
        .classed('reactzone', true)
        .attr('width', tickWidth)
        .attr('y', 2)
        .attr('height', 7)

    d3.select(el).selectAll('.tick')
        .on('click', (d) => {
            let data = axis.info.filter(i => `${i.key}` === `${d}`)
            if (data.length > 0) {
                selectElements(data[0].propName, data[0].values, data[0].category)
            }
        })
        .classed('selectable', d => {
            let data = axis.info.filter(i => `${i.key}` === `${d}`)
            return (data.length > 0 && data[0].values !== null)
        })
}

exports.create = create
exports.destroy = destroy
exports.update = update
