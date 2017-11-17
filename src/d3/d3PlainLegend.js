import * as d3 from 'd3'
import data from '../lib/dataLib'

const create = (el, props) => {
    // console.log('create', config.getSelectedConfig(props.configs, props.zone))
    if (el && data.areLoaded(props.data, props.zone)) {
        console.log('salut')
        const rectangles = d3.select(el)
            .selectAll('rect')
            .data(props.legend)
            .enter()
            .append('rect')
        const texts = d3.select(el)
            .selectAll('text')
            .data(props.legend)
            .enter()
            .append('text')
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
    const rectangles = d3.select(el)
        .selectAll('rect')
        .attr('width', (d, i) => 100)
        .attr('height', (d, i) => 18)
        .attr('y', (d, i) => Math.ceil(i * 20))
}

exports.create = create
exports.destroy = destroy
exports.update = update
