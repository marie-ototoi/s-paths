import * as d3 from 'd3'

const create = (el, props) => {
    // console.log('create', props)
    if (el && props.legend) {
        draw(el, props)
        resize(el, props)
    }
}

const draw = (el, props) => {
    const { legend, selectElements } = props
    const items = d3.select(el).selectAll('g.legenditem')
        .data(legend.info)
    const enterItems = items
        .enter()
        .append('g')
        .classed('legenditem', true)
    items
        .exit()
        .remove()
    enterItems
        .append('rect')
    enterItems
        .append('text')
    d3.select(el).selectAll('g.legenditem')
        .on('click', (d) => {
            selectElements(d.propName, d.key, d.category)
        })
}

const update = (el, props) => {
    if (el && props.legend) {
        draw(el, props)
        resize(el, props)
    }
}

const destroy = (el) => {
    //
}

const resize = (el, props) => {
    let total = d3.select(el).selectAll('g.legenditem').size() * 13
    d3.select(el).selectAll('g.legenditem').select('rect')
        .attr('width', (d, i) => 15)
        .attr('height', (d, i) => 10)
        .attr('y', (d, i) => props.dimensions.height - total + Math.ceil(i * 13))
        .attr('fill', d => d.color)
    d3.select(el).selectAll('g.legenditem').select('text')
        .attr('x', 20)
        .attr('y', (d, i) => props.dimensions.height - total + Math.ceil(i * 13) + 9)
        .text(d => d.label)
}

exports.create = create
exports.destroy = destroy
exports.update = update
