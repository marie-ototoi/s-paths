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
            .attr('x', -80)
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
            .attr('x', -75)
            .attr('y', 20)
        return this
    }

    mouseoverBehaviors (d) {
        let group = this.el
        let tab = d.split('-')
        for (var i = 1; i < tab.length; i++) {
            group.selectAll('line').selectAll('#id-' + tab[i]).style('fill', 'purple').style('stroke', 'purple')
            group.select('#idText-' + tab[i]).style('fill', 'purple')
        }
    }

    mouseleaveBehaviors (d) {
        let group = this.el
        let tab = d.split('-')
        for (var i = 1; i < tab.length; i++) {
            group.selectAll('line').selectAll('#id-' + tab[i]).style('fill', '#666').style('stroke', '#666')
            group.select('#idText-' + tab[i]).style('fill', '#666')
        }
    }

    addTick (group, size, visible) {
        group.append('line')
            .attr('id', (d, i) => 'id-' + i)
            .attr('x1', -size * 0.5)
            .attr('x2', size * 0.5)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke-width', 1)
            .attr('stroke', '#666')
        group.append('text')
            .attr('id', (d, i) => 'idText-' + i)
            .text(d => d)
            .attr('font-size', '16px')
            .attr('font-family', 'arial')
            .attr('font-weight', 'normal')
            .style('text-anchor', 'end')
            .style('stroke', 'none')
            .attr('x', -size)
            .attr('y', 5)
            .style('pointer-events', 'none')
            .style('visibility', visible ? 'visible' : 'hidden')
    }

    addRectSimple (group, size, visible) {
        group.append('rect')
            .classed('offsetRect', true)
            .attr('id', (d, i) => 'id-' + i)
            .attr('x', -40)
            .attr('y', -size / 2)
            .attr('width', 40)
            .attr('height', size)
            .style('fill', 'transparent')
    }

    addKeys (labels) {
        let el = this.el
        let positions =
         {
             x1: Number(this.el.select('line').attr('x1')),
             y1: Number(this.el.select('line').attr('y1')),
             x2: Number(this.el.select('line').attr('x2')),
             y2: Number(this.el.select('line').attr('y2'))
         }
        let step = Math.abs((positions.y2 - positions.y1)) / labels.length
        let tickRect = el.append('g').attr('id', 'ticksRect').selectAll('g')
            .data(labels)
            .enter()
            .append('g')
            .attr('transform', function (d, i) { return 'translate(' + positions.x1 + ',' + (positions.y2 + (i * step) + (step / 2)) + ')' })
        let tick = el.append('g').attr('id', 'ticks').selectAll('g')
            .data(labels)
            .enter()
            .append('g')
            .attr('transform', function (d, i) { return 'translate(' + positions.x1 + ',' + (positions.y2 + (i * step) + (step / 2)) + ')' })

        this.addTick(tick.filter(function (d, i) {
            var mod = parseInt(1 + (labels.length / 15))
            return i === 0 || i % mod === 0
        }), 15, true)
        this.addTick(tick.filter(function (d, i) {
            var mod = parseInt(1 + (labels.length / 15))
            return !(i === 0 || i % mod === 0)
        }), 30, false)
        this.addRectSimple(tickRect, step, true)

        d3.select('#ticks').append('g').append('line')
            .attr('x1', positions.x1 - 10)
            .attr('y1', positions.y1)
            .attr('x2', positions.x2 + 10)
            .attr('y2', positions.y1)
            .attr('stroke-width', 1.5)
            .attr('stroke', '#666')
        d3.select('#ticks').append('g').append('line')
            .attr('x1', positions.x1 - 10)
            .attr('y1', positions.y2)
            .attr('x2', positions.x2 + 10)
            .attr('y2', positions.y2)
            .attr('stroke-width', 1.5)
            .attr('stroke', '#666')

        this.ticks = tick
        this.ticksRect = tickRect
        return this
    }

    static replaceElements (el, props) {
        let panel = d3.select(el)

        panel.select('line')
            .attr('x1', props.display.viz.horizontal_margin)
            .attr('x2', props.display.viz.horizontal_margin)
            .attr('y1', props.display.viz.vertical_margin + props.display.viz.useful_height)
            .attr('y2', props.display.viz.vertical_margin)
        let positions =
        {
            x1: Number(panel.select('line').attr('x1')),
            y1: Number(panel.select('line').attr('y1')),
            x2: Number(panel.select('line').attr('x2')),
            y2: Number(panel.select('line').attr('y2'))
        }
        let xScale = d3.scaleBand()
            .range([ props.display.viz.vertical_margin, props.display.viz.vertical_margin + props.display.viz.useful_height ])
            .domain(props.keys)

        let step = Math.abs((props.display.viz.vertical_margin - props.display.viz.vertical_margin + props.display.viz.useful_height)) / props.keys.length
        panel.select('#ticks').selectAll('g').attr('transform', function (d, i) {
            return 'translate(' + props.display.viz.horizontal_margin + ',' + (xScale(d) + (step / 2)) + ')'
        })

        panel.select('#titles').selectAll('g').attr('transform', function (d, i) {
            return 'translate(' + ((props.display.viz.horizontal_margin) / 2) + ',' + ((props.display.viz.vertical_margin + props.display.viz.useful_height / 2) - 30 + (i * 30)) + ') rotate(-90)'
        })
    }

    static rescaleElements (el, props) {

    }

    static resize (el, props) {
        this.replaceElements(el, props)
        this.rescaleElements(el, props)
    }
}
