import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'
import shallowEqual from 'shallowequal'

class HistoryLayout extends AbstractLayout {

    draw (props) {
        const { historyConfigs, currentIndex } = props
        d3.select(this.el).selectAll('circle.config')
            .data(historyConfigs)
            .enter()
            .append('circle')
            .attr('class', 'config')
            .attr('r', 4)
            .attr('stroke-width', 3)
            .attr('stroke', '#fff')

        d3.select(this.el).selectAll('circle.config')
            .attr('class', (d, i) => {
                if (d.status !== 'active' || i === 0) {
                    return 'config hidden'
                } else if (i === currentIndex) {
                    return 'config selected'
                } else {
                    return 'config'
                }
            })
            .on('mouseup', (d, i) => {
                props.jumpHistory(i)
            })
    }
    resize (props) {
        d3.select(this.el).selectAll('circle.config')
            .attr('cx', (d, i) => i * 5)
    }
    checkSelection (props) {}
}
export default HistoryLayout