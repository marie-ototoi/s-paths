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
    const rectangles = d3.select(el)
        .selectAll('rect')
        .data(props.info)
        .enter()
        .append('rect')
        .attr('fill', d => d.color)
    const texts = d3.select(el)
        .selectAll('text')
        .data(props.info)
        .enter()
        .append('text')
        .text(d => d.key)
}

const assignBehavior = (el, props) => {
    const { selections, zone, select, selectElements } = props
    const legendItems = d3.select(el).selectAll('rect')
        .on('click', (d) => {
            selectElements(d.elements)
        }) // send list of selectors
}

const update = (el, props) => {
    //
    if (el && props.data) {
        //console.log('///////////',props.selections )
        resize(el, props)
        
    }
}

const destroy = (el) => {
    //
}

const resize = (el, props) => {
    const { display } = props
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