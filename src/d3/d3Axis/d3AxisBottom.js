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
            .attr('x', positions.x2)
            .attr('y', function (d, i) { return positions.y2 - 15 + (i * 30) })
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
            .attr('x', positions.x2 + 10)
            .attr('y', function (d, i) { return positions.y2 + 5 + (i * 30) })
        return this
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
        let step = (positions.x2 - positions.x1) / labels.length
        let tick = el.append('g').attr('id', 'ticks').selectAll('g')
            .data(labels)
            .enter()
            .append('g')
            .attr('transform', function (d, i) { return 'translate(' + (positions.x1 + (i * step) + (step / 2)) + ',' + positions.y2 + ')' })

        tick.filter(function (d, i) {
            var mod = parseInt(1 + (labels.length / 15))
            return i === 0 || i % mod === 0
        }).append('line')
            .attr('id', d => 'id' + d)
            .attr('y1', -10)
            .attr('y2', 20)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('stroke-width', 2.5)
            .attr('stroke', 'black')
        tick.filter(function (d, i) {
            var mod = parseInt(1 + (labels.length / 15))
            return i === 0 || i % mod === 0
        }).append('text')
            .attr('id', d => 'id' + d)
            .text(d => d)
            .attr('font-size', '20px')
            .attr('font-family', 'arial')
            .attr('font-weight', 'normal')
            .style('text-anchor', 'middle')
            .style('stroke', 'none')
            .attr('y', 40)
            .attr('x', 0)
            .style('pointer-events', 'none')
            .each(function (d) {
                let bbox = this.getBBox()
                d3.select(this.parentNode).append('rect')
                    .attr('x', bbox.x)
                    .attr('y', bbox.y)
                    .attr('width', bbox.width)
                    .attr('height', bbox.height)
                    .attr('fill', 'transparent')
                    .on('mouseover', function (d) {
                        tick.selectAll('#id' + d).attr('fill', '#1B79C0').attr('stroke', '#1B79C0')
                        d3.select('#idText' + d).style('visibility', 'visible')
                        // interactions.key.mouseover(d)
                    })
                    .on('mouseleave', function (d) {
                        tick.selectAll('#id' + d).attr('fill', 'black').attr('stroke', 'black')
                        d3.select('#idText' + d).style('visibility', 'hidden')
                        // interactions.key.mouseleave(d)
                    })
            })
        tick.filter(function (d, i) {
            var mod = parseInt(1 + (labels.length / 15))
            return !(i === 0 || i % mod === 0)
        }).append('line')
            .attr('id', d => 'id' + d)
            .attr('y1', -8)
            .attr('y2', 8)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
        tick.filter(function (d, i) {
            var mod = parseInt(1 + (labels.length / 15))
            return !(i === 0 || i % mod === 0)
        }).append('text')
            .attr('id', d => 'idText' + d)
            .text(d => d)
            .attr('font-size', '20px')
            .attr('font-family', 'arial')
            .attr('font-weight', 'normal')
            .style('text-anchor', 'middle')
            .style('stroke', 'none')
            .attr('y', 24)
            .attr('x', 0)
            .attr('fill', '#1B79C0')
            .style('pointer-events', 'none')
            .style('visibility', 'hidden')
        tick.append('rect')
            .attr('x', -(step / 2))
            .attr('y', 0)
            .attr('width', step)
            .attr('height', step)
            .attr('fill', 'transparent')
            .on('mouseover', function (d) {
                d3.selectAll('#id' + d).attr('stroke', '#1B79C0').attr('fill', '#1B79C0')
                d3.select('#idText' + d).style('visibility', 'visible')
                // interactions.key.mouseover(d)
            })
            .on('mouseleave', function (d) {
                d3.selectAll('#id' + d).attr('stroke', 'black').attr('fill', 'black')
                d3.select('#idText' + d).style('visibility', 'hidden')
                // interactions.key.mouseleave(d)
            })

        d3.select('#ticks').append('g').append('line')
            .attr('x1', positions.x1)
            .attr('y1', positions.y1 - 10)
            .attr('x2', positions.x1)
            .attr('y2', positions.y2 + 10)
            .attr('stroke-width', 1.5)
            .attr('stroke', 'black')
        d3.select('#ticks').append('g').append('line')
            .attr('x1', positions.x2)
            .attr('y1', positions.y1 - 10)
            .attr('x2', positions.x2)
            .attr('y2', positions.y2 + 10)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
        this.ticks = tick
        return this
    }
}
