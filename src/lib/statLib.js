import * as d3 from 'd3'

function agregateByDate (data, mode) {
    let statistics = []
    let total = 0
    let res = []
    data.forEach(function (item) {
        let prop1 = item.prop1.value
        let prop2 = item.prop2.value
        let index1 = (new Date(prop1).getFullYear() - new Date(prop1).getFullYear() % mode) + ''
        if (index1 in statistics) {
            if (prop2 in statistics[index1]) {
                statistics[index1][prop2] = statistics[index1][prop2] + 1
                total++
            } else {
                statistics[index1][prop2] = 1
                total++
            }
        } else {
            statistics[index1] = []
            statistics[index1][prop2] = 1
            total++
        }
    })
    let minValue = 1
    let maxValue = 0
    for (let k1 in statistics) {
        for (let k2 in statistics[k1]) {
            if (statistics[k1][k2] > maxValue) maxValue = statistics[k1][k2]
            if (statistics[k1][k2] < minValue) minValue = statistics[k1][k2]
            let newItem = {}
            newItem.prop1 = k1
            newItem.prop2 = k2
            newItem.value = statistics[k1][k2]
            res.push(newItem)
        }
    }
    return { data: res, min: minValue, max: maxValue, total: total }
}

function ecartType (data) {
    let mean = d3.mean(data, d => d.value)
    let total = data.length
    let newArray = data.map(function (d) { return Math.pow(d.value - mean, 2) })
    let res = Math.sqrt(newArray.reduce((a, b) => a + b, 0) / (total - 1))
    return Math.abs(mean - res)
}

const computeStatisticalInformation = (data, selectedConfig) => {
    if (data === undefined) return
    /*
    const nestedData = dataLib.groupTimeData(data, 'prop1', selectedConfig.selectedMatch.properties[0].format, 150)
    console.log(data)
    console.log(nestedData)

    console.log('%1', nestedData.length)

    let decade = []
    let century = []
    nestedData.forEach(function (item) {
        for (var i = 0; i < item.values.length; i++) {
            let indexD = item.values[i].decade + ''
            if (indexD in decade) {
                decade[indexD] += 1
                total++
            } else {
                decade[indexD] = []
                decade[indexD] = 1
                total++
            }

            let indexC = item.values[i].century + ''
            if (indexC in century) {
                century[indexC] += 1
                total++
            } else {
                century[indexC] = []
                century[indexC] = 1
                total++
            }
        }
    })
    console.log(decade)
    console.log(century)

  */
    //    console.log(groupTimeData(data.statements.results.bindings, 'prop1', 'Y', 10))
    /** ****************************** CHECK PROP1 and PROP2 *************************************/

    /** ****************************** CREATE GROUP FOR EACH PROPS *******************************/

    /** ****************************** COMPUTE RATIO % *******************************************/
    let unit = agregateByDate(data, 1)
    let dec = agregateByDate(data, 10)
    let cen = agregateByDate(data, 100)
    return dec
/*
    let eu = ecartType(unit.data, unit.total)
    let ed = ecartType(dec.data, dec.total)
    let ec = ecartType(cen.data, cen.total)
    if (eu > ed && eu > ec) return unit
    if (ed > ec) return dec
    return cen
    */
}

exports.computeStatisticalInformation = computeStatisticalInformation
