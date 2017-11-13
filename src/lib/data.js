import * as d3 from 'd3'
import moment from 'moment'

const getResults = (data, zone) => {
    return (areLoaded(data, zone))
        ? data.filter(d => d.zone === zone)[0].statements.results.bindings : []
}

const getHeadings = (data, zone) => {
    return (areLoaded(data, zone))
        ? data.filter(d => d.zone === zone)[0].statements.head.vars : []
}

const areLoaded = (data, zone) => {
    return data.filter(d => d.zone === zone).length > 0 &&
        data.filter(d => d.zone === zone)[0].statements.results !== undefined &&
        data.filter(d => d.zone === zone)[0].statements.results.bindings.length > 0
}

const groupTimeData = (data, propName, format, max) => {
    let dataToNest = data.map(d => {
        let dateProp = moment(d[propName].value, format)
        if (! dateProp.isValid()) throw 'Cannot use time format'

        return {
            ...d,
            dateProp,
            year: dateProp.format('Y'),
            decade: Math.floor(Number(dateProp.format('Y')) / 10) * 10,
            century: Math.floor(Number(dateProp.format('Y')) / 100) * 100
        }
    })
    let yearNest = d3.nest().key(prop => prop.year).entries(dataToNest)
    let decadeNest = d3.nest().key(prop => prop.decade).entries(dataToNest)
    let centuryNest = d3.nest().key(prop => prop.century).entries(dataToNest)
    console.log(yearNest.length)
    if (yearNest.length < max) {
        return yearNest
    } else if (decadeNest.length < max) {
        return decadeNest
    } else {
        return centuryNest
    }
}

exports.areLoaded = areLoaded
exports.getHeadings = getHeadings
exports.getResults = getResults
exports.groupTimeData = groupTimeData
