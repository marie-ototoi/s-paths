import * as d3 from 'd3'
import shallowEqual from 'shallowequal'

const create = (el, props) => {
    // console.log('create', configs)
    if (el) {
        draw(el, props)
        resize(el, props)
    }
}

const draw = (el, props) => {
    const { configs, currentIndex } = props
    d3.select(el).selectAll('circle.config')
        .data(configs)
        .enter()
        .append('circle')
        .attr('class', 'config')
        .attr('r', 4)
        .attr('stroke-width', 3)
        .attr('stroke', '#fff')

    d3.select(el).selectAll('circle.config')
        .attr('class', (d, i) => {
            if (d.status !== 'active') {
                return 'config hidden'
            } else if (i === currentIndex) {
                return 'config selected'
            } else if (i > 0 && shallowEqual(configs[i], configs[i - 1])) {
                return 'config nochange'
            } else {
                return 'config'
            }
        })
        .on('mouseup', (d, i) => {
            props.jumpHistory(i)
        })
}

const update = (el, props) => {
    if (el && props.configs) {
        draw(el, props)
        resize(el, props)
    }
}

const destroy = (el) => {
    //
}

const resize = (el, props) => {
    const { configs, currentIndex } = props
    d3.select(el).selectAll('circle.config')
        .attr('cx', (d, i) => i * 10)

    /*
        .attr('y', -unitHeight)
        .attr('height', d => unitHeight) */
}

exports.create = create
exports.destroy = destroy
exports.update = update
