import * as d3 from 'd3'
import data from '../lib/dataLib'

const create = (el, props) => {
    //
    /* d3.select(`div.view`).append('div')
        .classed(props.elementName, true)
        .style('position', 'absolute')
        .style('left', `${props.x/3}px`)
        .style('top', `${props.y/3}px`)
        .style('width',`300px`)
        .style('height', `100px`)
        .style('background-color', 'red') */
    if (el) {
        const { axis } = props
        d3.select(el)
            .append('foreignObject')
            .attr('width', axis.width + 200)
            .attr('height', 50)
            .append('xhtml:select')
            .style('margin-left', `${axis.width}px`)
        update(el, props)
    }
}

const assignBehavior = (el, props) => {
    const { selectElements, selectProperty, axis } = props
    const axisItems = d3.select(el).selectAll('.tick')
        .classed('selectable', d => {
            let data = axis.info.filter(i => `${i.key}` === `${d}`)
            return (data.length > 0)
        })
    axisItems.selectAll('text, line, rect')
        .on('click', (d) => {
            let data = axis.info.filter(i => `${i.key}` === `${d}`)
            if (data.length > 0) {
                selectElements(data[0].propName, data[0].values, data[0].category)
            }
        })
    const form = d3.select(el).select('select')
    form.on('change', (d, i) => {
        const newPath = form._groups[0][0].selectedOptions[0].value
        selectProperty(props.configs, props.zone, props.propIndex, newPath, props.dataset)
    })
}

const update = (el, props) => {
    //
    if (el) {
        const { axis } = props
        const { configs } = axis
        d3.select(el)
            .select('foreignObject select')
            .selectAll('option')
            .data(configs)
            .enter()
            .append('xhtml:option')
            .attr('value', d => d.path)
            .text(d => d.path)
        d3.select(el)
            .select('foreignObject select option')
            .filter(d => d.selected === true)
            .attr('selected', 'selected')
        resize(el, props)
        assignBehavior(el, props)
    }
}

const destroy = (el, props) => {
    //
    d3.select(`div.view ${props.elementName}`).remove()
    d3.select(el).remove()
}

const resize = (el, props) => {
    const { axis, type } = props
    const { info, category, width } = axis
    const scale = d3.scaleLinear()
        .domain([info[0].key, info[info.length - 1].key])
        .range([0, width])
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
        axisEl
            .tickFormat(d3.format('.0f'))
            .ticks(info.length) // to be fixed : if there's many empty values on the scale 
            // and the length of the info array is closer to a multiple, there might be only one out of two ticks
    }
    d3.select(el).append('g')
        .attr('class', `axis${type}`)
        .call(axisEl)
    d3.select(el).selectAll('.domain').remove()
    const ticks = d3.select(el).selectAll('.tick')
    const tickWidth = Math.floor(width / ticks.size())
    ticks.append('rect')
        .classed('reactzone', true)
        .attr('width', tickWidth)
        .attr('height', 7)
}

exports.create = create
exports.destroy = destroy
exports.update = update
