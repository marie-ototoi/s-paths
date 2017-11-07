
const gradeProp = (prop, constraint) => {
    let grade = 0
    switch (prop.group) {
    case 'datetime':
        break
    case 'number':
        break
    case 'geo':
        break
    case 'text':
        break
    default:
        //
    }
    return grade        
}

const getConfigs = (views, stats) => {
    return views.map(view => {
        return {
            ...view,
            properties: view.constraints.map(constraintSet => {
                let propList = []
                stats.statements.forEach(prop => {
                    constraintSet.forEach(constraint => {
                        // generic conditions
                        if (prop.group === constraint.group &&
                        !(
                            (constraint.unique.min && prop.unique < constraint.unique.min) ||
                            (constraint.unique.max && prop.unique > constraint.unique.max)
                        )) {
                            // conditions specific to a group
                            switch (prop.group) {
                            case 'datetime':
                                propList.push({
                                    ...prop,
                                    grade: gradeProp(prop, constraint)
                                })
                                break
                            case 'number':
                                propList.push({...prop})
                                break
                            case 'geo':
                                propList.push({...prop})
                                break
                            case 'text':
                                propList.push({...prop})
                                break
                            default:
                                propList.push({...prop})
                            }
                        }
                    })
                })
                return propList
            })
        }
    })
}

const activateDefaultConfigs = (configs) => {
    // temporary : select the first 2 ones
    return configs.map((vc, index) => {
        let zone
        if (index === 0) zone = 'main'
        if (index === 1) zone = 'aside'
        return {
            ...vc,
            zone: (index <= 1) ? zone : null
        }
    })
}

exports.getConfigs = getConfigs
exports.activateDefaultConfigs = activateDefaultConfigs