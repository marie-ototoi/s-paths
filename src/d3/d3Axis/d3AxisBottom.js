import * as d3 from 'd3'
import { d3AxisAbstract } from './d3AxisAbstract'

export default class d3AxisBottom extends d3AxisAbstract {
    addTitles (titles) {
        let positions =
           {
               x1: Number(this.el.select('line').attr('x1')),
               y1: Number(this.el.select('line').attr('y1')),
               x2: Number(this.el.select('line').attr('x2')),
               y2: Number(this.el.select('line').attr('y2'))
           }
        let el = this.el
        let dropdown = el.append('g').attr('id', 'titles').selectAll('g')
            .data(titles)
            .enter()
            .append('g')
            .each(function (d, i) { if (i !== 0) this.setAttribute('visibility', 'hidden') })
        dropdown.append('rect')
            .attr('x', 40)
            .attr('y', 0)
            .attr('width', 80)
            .attr('height', 30)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .on('mouseover', function () {
                dropdown.each(function (d, i) { if (i !== 0) this.setAttribute('visibility', 'visible') })
            })
            .on('mouseleave', function () {
                dropdown.each(function (d, i) { if (i !== 0) this.setAttribute('visibility', 'hidden') })
            })
        dropdown.append('text')
            .text(d => d)
            .attr('font-size', '20px')
            .attr('font-family', 'arial')
            .attr('font-weight', 'normal')
            .style('text-anchor', 'start')
            .style('pointer-events', 'none')
            .attr('x', 50)
            .attr('y', 20)
        return this
    }

    mouseoverBehaviors (d) {
        let group = this.el
        let tab = d.split('-')
        for (var i = 1; i < tab.length; i++) {
            group.selectAll('#id-' + tab[i]).style('fill', 'black').style('stroke', 'black')
            group.select('#idText-' + tab[i]).style('fill', 'black')
        }
    }

    mouseleaveBehaviors (d) {
        let group = this.el
        let tab = d.split('-')
        for (var i = 1; i < tab.length; i++) {
            group.selectAll('#id-' + tab[i]).style('fill', '#666').style('stroke', '#666')
            group.select('#idText-' + tab[i]).style('fill', '#666')
        }
    }

    addTickInterval (group, size, visible) {
        group.append('line')
            .attr('id', (d, i) => 'id-' + i)
            .attr('y1', -10)
            .attr('y2', 10)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('stroke-width', 1)
        group.append('text')
            .attr('id', (d, i) => 'idText-' + i)
            .text(d => d)
            .attr('font-size', '12px')
            .attr('font-family', 'arial')
            .attr('font-weight', 'normal')
            .style('text-anchor', 'middle')
            .style('stroke', 'none')
            .attr('y', 10 + 20)
            .attr('x', 0)
            .style('pointer-events', 'none')
            .style('visibility', visible ? 'visible' : 'hidden')
    }

    addRectInterval (group, size, visible) {
        group.append('rect')
            .classed('offsetRect', true)
            .attr('id', (d, i) => 'id-' + i + '-' + (i + 1))
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', size)
            .attr('height', 40)
            .style('fill', 'transparent')
    }

    addTickSimple (group, size, visible) {
        group.append('line')
            .attr('id', (d, i) => 'id-' + i)
            .attr('y1', -size * 0.5)
            .attr('y2', size * 0.5)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('stroke-width', 1)
        group.append('text')
            .attr('id', (d, i) => 'idText-' + i)
            .text(d => d)
            .attr('font-size', '12px')
            .attr('font-family', 'arial')
            .attr('font-weight', 'normal')
            .style('text-anchor', 'middle')
            .style('stroke', 'none')
            .attr('y', size + 5)
            .attr('x', 0)
            .style('pointer-events', 'none')
            .style('visibility', visible ? 'visible' : 'hidden')
    }

    addRectSimple (group, size, visible) {
        group.append('rect')
            .classed('offsetRect', true)
            .attr('id', (d, i) => 'id-' + i + '-' + (i + 1))
            .attr('x', -size / 2)
            .attr('y', 0)
            .attr('width', size)
            .attr('height', 40)
            .style('fill', 'transparent')
    }

    addKeys (labels, mode) {
        let el = this.el
        let positions =
         {
             x1: Number(this.el.select('line').attr('x1')),
             y1: Number(this.el.select('line').attr('y1')),
             x2: Number(this.el.select('line').attr('x2')),
             y2: Number(this.el.select('line').attr('y2'))
         }

        let xScale = d3.scaleBand()
            .range([positions.x1, positions.x2])
            .domain(labels)
        let tickRect = el.append('g').attr('id', 'ticksRect').selectAll('g')
            .data(labels)
            .enter()
            .append('g')
        let tick = el.append('g').attr('id', 'ticks').selectAll('g')
            .data(labels)
            .enter()
            .append('g')

        if (mode === 'simple') {
            el.select('#ticks').attr('mode', 'simple')
            let step = (positions.x2 - positions.x1) / labels.length
            tick.attr('transform', function (d, i) { return 'translate(' + (xScale(d) + (step / 2)) + ',' + positions.y2 + ')' })
            this.addTickSimple(tick.filter(function (d, i) {
                var mod = parseInt(1 + (labels.length / 15))
                return i === 0 || i % mod === 0
            }), 30, true)
            this.addTickSimple(tick.filter(function (d, i) {
                var mod = parseInt(1 + (labels.length / 15))
                return !(i === 0 || i % mod === 0)
            }), 15, false)
            d3.select('#ticks').append('g').append('line')
                .attr('x1', positions.x1)
                .attr('y1', positions.y1 - 10)
                .attr('x2', positions.x1)
                .attr('y2', positions.y2 + 10)
                .attr('stroke-width', 1.5)
                .attr('stroke', '#666')
            d3.select('#ticks').append('g').append('line')
                .attr('x1', positions.x2)
                .attr('y1', positions.y1 - 10)
                .attr('x2', positions.x2)
                .attr('y2', positions.y2 + 10)
                .attr('stroke-width', 1.5)
                .attr('stroke', '#666')
        } else if (mode === 'interval') {
            el.select('#ticks').attr('mode', 'interval')
            let step = (positions.x2 - positions.x1) / (labels.length - 1)
            tick.attr('transform', function (d, i) { return 'translate(' + (xScale(d)) + ',' + positions.y2 + ')' })
            this.addTickInterval(tick, step, true)
            tickRect.attr('transform', function (d, i) { return 'translate(' + (xScale(d)) + ',' + positions.y2 + ')' })
            this.addRectInterval(tickRect, step, true)
        }
        this.ticks = tick
        this.ticksRect = tickRect
        return this
    }

    static replaceElements (el, props) {
        let panel = d3.select(el)

        panel.select('line')
            .attr('x1', props.display.viz.horizontal_margin)
            .attr('x2', props.display.viz.horizontal_margin + props.display.viz.useful_width)
            .attr('y1', props.display.viz.vertical_margin + props.display.viz.useful_height)
            .attr('y2', props.display.viz.vertical_margin + props.display.viz.useful_height)
        let positions =
        {
            x1: Number(panel.select('line').attr('x1')),
            y1: Number(panel.select('line').attr('y1')),
            x2: Number(panel.select('line').attr('x2')),
            y2: Number(panel.select('line').attr('y2'))
        }

        let xScale = d3.scaleBand()
            .range([props.display.viz.horizontal_margin, props.display.viz.horizontal_margin + props.display.viz.useful_width])
            .domain(props.keys)

        if (panel.select('#ticks').attr('mode') === 'simple') {
            let step = (props.display.viz.horizontal_margin - props.display.viz.horizontal_margin + props.display.viz.useful_width) / props.keys.length
            panel.select('#ticks').selectAll('g').attr('transform', function (d, i) {
                return 'translate(' + (xScale(d) + (step / 2)) + ',' + (props.display.viz.vertical_margin + props.display.viz.useful_height) + ')'
            })
        } else if (panel.select('#ticks').attr('mode') === 'interval') {
            panel.select('#ticks').selectAll('g').attr('transform', function (d, i) {
                return 'translate(' + (xScale(d)) + ',' + (props.display.viz.vertical_margin + props.display.viz.useful_height) + ')'
            })
        }

        panel.select('#titles').selectAll('g').attr('transform', function (d, i) {
            return 'translate(' + (props.display.viz.horizontal_margin / 2 + ((positions.x2 - positions.x1) / 2)) + ',' + (positions.y2 + 60 + (i * 30)) + ')'
        })
    }

    static rescaleElements (el, props) {

    }

    static resize (el, props) {
        this.replaceElements(el, props)
        this.rescaleElements(el, props)
    }
}
