
const getResults = (data, zone) => {
    return data.filter(d => d.zone === zone)[0].results || []
}
const getHeadings = (data, zone) => {
    return data.filter(d => d.zone === zone)[0].headings || []
}

const areLoaded = (data, zone) => {
    return data.filter(d => d.zone === zone)[0].statements.results
}

exports.areLoaded = areLoaded
exports.getHeadings = getHeadings
exports.getResults = getResults
