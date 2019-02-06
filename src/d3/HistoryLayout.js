import * as d3 from 'd3'
import AbstractLayout from './AbstractLayout'
import shallowEqual from 'shallowequal'

class HistoryLayout extends AbstractLayout {

    draw (props) {
        let { historyConfigs, currentIndex } = props
        // console.log(historyConfigs, currentIndex)
        historyConfigs = historyConfigs.map(c => {
            return {
                ...c,
                visible: c.status === 'active' && !c.multiple && (c.checked || c.views.length > 1)
            }
        })
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
                if (i === currentIndex) {
                    return 'config selected'
                } else if (d.visible) {
                    return 'config'
                } else {
                    return 'hidden'
                }
            })
            .on('mouseup', (d, i) => {
                props.jumpHistory(i)
            })
    }
    resize (props) {
        d3.select(this.el).selectAll('circle.config')
            .attr('cx', (d, i) => 7 + i * 10)
    }
    checkSelection (props) {}
}
export default HistoryLayout