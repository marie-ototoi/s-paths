import { groupTimeData } from './dataLib'

const findDateRatio = (data) => {

}
const findTextRatio = (data) => {

}
const findBestRatioSingleProp = (data) => {

}

const findBestRatioDoubleProps = (data, processing = 'RAW') => {
    switch (processing) {
    case 'RAW':

        break
    default:
    }
}

const computeStatisticalInformation = (data) => {
    //    console.log(data)
    //    console.log(groupTimeData(data.statements.results.bindings, 'prop1', 'Y', 10))
    /** ****************************** CHECK PROP1 and PROP2 *************************************/

    /** ****************************** CREATE GROUP FOR EACH PROPS *******************************/

    /** ****************************** COMPUTE RATIO % *******************************************/
    // getSelected...();
    let statistics = []
    let total = 0
    let res = []
    data.statements.results.bindings.forEach(function (item) {
        let prop1 = item.prop1.value
        let prop2 = item.prop2.value
        let index1 = (Number(prop1) - Number(prop1) % 5) + ''
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
            statistics[k1][k2] = statistics[k1][k2]
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

exports.computeStatisticalInformation = computeStatisticalInformation
