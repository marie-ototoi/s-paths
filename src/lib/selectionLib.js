const isSelected = (selector, zone, selections) => {
    //console.log(selections)
    let listSelections = selections.filter(s => s.zone === zone).map(s => s.selector)
    return listSelections.includes(selector)
}
const areSelected = (elements, zone, selections) => {
    let listSelections = selections.filter(s => s.zone === zone).map(s => s.selector)
    let allSelected = true
    for (let i = 0; i < elements.length; i++) {
        let el = elements[i]
        // console.log(el.selector, listSelections.includes(el.selector), selections, listSelections)
        if (!listSelections.includes(el.selector)) {
            allSelected = false
        }
        break
    }
    return allSelected
}

exports.areSelected = areSelected
exports.isSelected = isSelected
