import * as d3 from 'd3'

export class d3AxisAbstract {
    constructor (el, positions) {
        this.el = d3.select(el)
        d3.select(el).append('line')
            .attr('x1', positions.x1)
            .attr('y1', positions.y1)
            .attr('x2', positions.x2)
            .attr('y2', positions.y2)
            .attr('stroke-width', 1.5)
            .attr('stroke', '#666')
    }

    addTitles (titles) {
        throw new Error('You have to implement the method addTitles!')
    }

    addKeys (keys) {
        throw new Error('You have to implement the method addKeys!')
    }

    assignBehaviors (behaviors) {
        var that = this
        var items = ['key', 'titles']
        var type = ['mouseover', 'mouseleave', 'click']
        for (var i = 0; i < items.length; i++) {
            for (var j = 0; j < type.length; j++) {
                that.assignBehavior(items[i], type[j], behaviors)
            }
        }
        return this
    }

    assignBehavior (items, type, fun) {
        var that = this
        switch (items) {
        case 'key':
            if (type === 'mouseover') {
                this.ticksRect.on(type, function (d) {
                    console.log(this)
                    that.mouseoverBehaviors(d3.select(this).select('rect').attr('id'))
                    fun(items, type, d)
                })
            } else if (type === 'mouseleave') {
                this.ticksRect.on(type, function (d) {
                    that.mouseleaveBehaviors(d3.select(this).select('rect').attr('id'))
                    fun(items, type, d)
                })
            } else {
                this.ticksRect.on(type, function (d) {
                    fun(items, type, d)
                })
            }
            break
        default:
        }
        return this
    }

    mouseoverBehaviors (id) {
        throw new Error('You have to implement the method mouseover!')
    }

    mouseleaveBehaviors (id) {
        throw new Error('You have to implement the method mouseleave!')
    }

    destroy () {
    }

    resize () {

    }
}
