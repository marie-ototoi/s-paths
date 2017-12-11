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

    addTick (group, size, visible) {
        group.append('line')
            .attr('id', d => 'id' + d)
            .attr('x1', -size * 0.5)
            .attr('x2', size * 0.5)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke-width', 1)
            .attr('stroke', '#666')
        group.append('text')
            .attr('id', d => 'idText' + d)
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
            .each(function (d) {
                if (this.getBBox === undefined) return
                let bbox = this.getBBox()
                d3.select(this.parentNode).append('rect')
                    .attr('x', bbox.x)
                    .attr('y', bbox.y)
                    .attr('width', bbox.width)
                    .attr('height', bbox.height)
                    .attr('fill', 'transparent')
                    .on('mouseover', function (d) {
                        group.selectAll('#id' + d).attr('fill', 'purple').attr('stroke', 'purple')
                        d3.select('#idText' + d).style('visibility', 'visible').attr('fill', 'purple')
                    })
                    .on('mouseleave', function (d) {
                        group.selectAll('#id' + d).attr('fill', 'black').attr('stroke', '#666')
                        d3.select('#idText' + d).style('visibility', visible ? 'visible' : 'hidden').attr('fill', 'black')
                    })
            })
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
