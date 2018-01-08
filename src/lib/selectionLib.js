const getSelections = (selections, zone) => {
    return selections.filter(s => s.zone === zone)
}
const isSelected = (el, zone, selections) => {
    // console.log(selections)
    let listSelections = selections.filter(s => s.zone === zone).map(s => s.selector)
    return listSelections.includes(el.selector)
}
const areSelected = (elements, zone, selections) => {
    let listSelections = selections.filter(s => s.zone === zone).map(s => s.selector)
    // console.log('list', elements, listSelections)
    let allSelected = 0
    elements.forEach(el => {
        // console.log(el.selector, listSelections.includes(el.selector), selections, listSelections)
        if (listSelections.includes(el.selector)) {
            allSelected++
        }
    })
    return allSelected === elements.length
}
const detectRectCollision = (rect1, rect2) => {
    return (rect1.x1 < rect2.x2 &&
        rect1.x2 > rect2.x1 &&
        rect1.y1 < rect2.y2 &&
        rect1.y2 > rect2.y1)
}

const getRectSelection = (selection) => {
    const { x1, y1, x2, y2 } = selection
    const selectionX1 = (x1 < x2) ? x1 : x2
    const selectionY1 = (y1 < y2) ? y1 : y2
    const selectionX2 = (x1 < x2) ? x2 : x1
    const selectionY2 = (y1 < y2) ? y2 : y1
    return {
        x1: selectionX1,
        y1: selectionY1,
        x2: selectionX2,
        y2: selectionY2
    }
}

exports.areSelected = areSelected
exports.detectRectCollision = detectRectCollision
exports.getRectSelection = getRectSelection
exports.getSelections = getSelections
exports.isSelected = isSelected
