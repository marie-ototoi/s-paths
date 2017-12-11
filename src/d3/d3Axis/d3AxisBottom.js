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

    addTick (group, size, visible) {
        group.append('line')
            .attr('id', d => 'id' + d)
            .attr('y1', -size * 0.5)
            .attr('y2', size * 0.5)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('stroke-width', 1)
            .attr('stroke', '#666')
        group.append('text')
            .attr('id', d => 'idText' + d)
            .text(d => d)
            .attr('font-size', '16px')
            .attr('font-family', 'arial')
            .attr('font-weight', 'normal')
            .style('text-anchor', 'middle')
            .style('stroke', 'none')
            .attr('y', size + 5)
            .attr('x', 0)
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

        let xScale = d3.scaleBand()
            .range([positions.x1, positions.x2])
            .domain(labels)

        let step = (positions.x2 - positions.x1) / labels.length

        let tick = el.append('g').attr('id', 'ticks').selectAll('g')
            .data(labels)
            .enter()
            .append('g')
            .attr('transform', function (d, i) { return 'translate(' + (xScale(d) + (step / 2)) + ',' + positions.y2 + ')' })

        this.addTick(tick.filter(function (d, i) {
            var mod = parseInt(1 + (labels.length / 15))
            return i === 0 || i % mod === 0
        }), 30, true)
        this.addTick(tick.filter(function (d, i) {
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
        this.ticks = tick
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

        let step = (props.display.viz.horizontal_margin - props.display.viz.horizontal_margin + props.display.viz.useful_width) / props.keys.length
        panel.select('#ticks').selectAll('g').attr('transform', function (d, i) {
            return 'translate(' + (xScale(d) + (step / 2)) + ',' + (props.display.viz.vertical_margin + props.display.viz.useful_height) + ')'
        })

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
