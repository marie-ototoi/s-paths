
const flatten = (expandedData) => {
    return expandedData.map(row => {
        let  props = Object.getOwnPropertyNames(row)
        //console.log(props)
        props.forEach(name => {
            let desc = Object.getOwnPropertyDescriptor(row, name)
            Object.defineProperty(row, name, desc.value || desc)
        })
        return row 
    })
}

exports.flatten = flatten
