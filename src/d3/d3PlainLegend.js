import * as d3 from 'd3'
import data from '../lib/dataLib'

const create = (el, props) => {
    // console.log('create', props)
    if (el && data.areLoaded(props.data, props.zone)) {
        draw(el, props)
        resize(el, props)
        assignBehavior(el, props)
    }
}

const draw = (el, props) => {
    const { info } = props
    const items = d3.select(el)
        .selectAll('g.legenditem')
        .data(info)
        .enter()
        .append('g')
        .classed('legenditem', true)
    items
        .append('rect')
        .attr('fill', d => d.color)
    items
        .append('text')
        .text(d => d.label)
}

const assignBehavior = (el, props) => {
    const { selectElements } = props
    const legendItems = d3.select(el).selectAll('g.legenditem')
        .on('click', (d) => {
            selectElements(d.propName, d.key, d.category)
        }) // send list of selectors
}

const update = (el, props) => {
    if (el && props.data) {
        resize(el, props)
    }
}

const destroy = (el) => {
    //
}

const resize = (el, props) => {
    const rectangles = d3.select(el)
        .selectAll('rect')
        .attr('width', (d, i) => 25)
        .attr('height', (d, i) => 15)
        .attr('y', (d, i) => Math.ceil(i * 20))
    const texts = d3.select(el)
        .selectAll('text')
        .attr('x', 30)
        .attr('y', (d, i) => 14 + Math.ceil(i * 20))
}

exports.create = create
exports.destroy = destroy
exports.update = update
