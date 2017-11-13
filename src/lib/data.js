
const getResults = (data, zone) => {
    return data.filter(d => d.zone === zone)[0].statements.results.bindings 
}
const getHeadings = (data, zone) => {
    return data.filter(d => d.zone === zone)[0].statements.head.vars 
}

const areLoaded = (data, zone) => {
    return data.filter(d => d.zone === zone)[0].statements.results &&
        data.filter(d => d.zone === zone)[0].statements.results.bindings.length > 0
}

exports.areLoaded = areLoaded
exports.getHeadings = getHeadings
exports.getResults = getResults
