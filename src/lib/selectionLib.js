const isSelected = (el, zone, selections) => {
    //console.log(selections)
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
            allSelected ++
        }
    })
    return allSelected === elements.length
}

exports.areSelected = areSelected
exports.isSelected = isSelected
