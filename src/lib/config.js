
const inRange = (val, range) => {
    return (val >= range[0] && val <= range[1])
}
const underRange = (val, range) => {
    return (val < range[0])
}
const overRange = (val, range) => {
    return (val > range[1])
}
const getDeviationCost = (unique, grade) => {    
    let gapMin = (unique.min) ? unique.optimal[0] - unique.min : null
    let gapMax = (unique.max) ? unique.max - unique.optimal[1] : null
    let maxGap = (gapMin > gapMax) ? gapMin : gapMax
    return (maxGap) ? (grade / maxGap) : null
}

const gradeProp = (prop, constraint) => {
    // to do : prendre en compte la representativite de la prop par rapport au dataset
    // et eventuellement si la prop peut avoir plusieurs valeurs pour une meme instance (specifier dans la vue si c'est souhaite)
    let maxGrade = 0.5
    let cost = 0
    switch (prop.group) {
    case 'datetime':
        // repartition
        break
    case 'number':
        break
    case 'geo':
        break
    case 'text':
        // the closer to the optimal range, the better
        if (!(constraint.unique.optimal && 
        inRange(prop.unique_values, constraint.unique.optimal))) {
            let deviationCost = getDeviationCost(constraint.unique, maxGrade)
            if (underRange(prop.unique_values, constraint.unique.optimal) &&
                constraint.unique.min) {
                cost = deviationCost * (constraint.unique.optimal[0] - prop.unique_values)
            } else if (overRange(prop.unique_values, constraint.unique.optimal) &&
            constraint.unique.max) {
                cost = deviationCost * (prop.unique_values - constraint.unique.optimal[1])
            } else {
                cost = maxGrade / 2
            }            
        }
        break
    default:
        //
    }
    return maxGrade - cost
}

const gradeMatch = (match) => {
    // mean of each property's grade
    let grade = match.map(m => m.grade).reduce((a, b) => a+b , 0) / match.length
    // bonus for each property represented
    grade += 0.3 * match.length
    // domain rules to add values for some properties : TO DO 
    // console.log('grade', grade)
    return grade        
}

const findAllMatches = (inputList, addList) => {
    return  inputList.map(match => {
        // console.log('match', match)
        return addList.map(addElt => {
            return [...match, addElt]
        })
    }).reduce((a, b) => {
        return a.concat(b)
    }, [])
}

const getConfigs = (views, stats) => {
    return views.map(view => {
        let propList = []
        // makes a list of all possible properties for each constrained prop zone
        view.constraints.forEach(constraintSet => {
            let propSet = []
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
                            propSet.push({
                                ...prop,
                                grade: gradeProp(prop, constraint)
                            })
                            break
                        case 'number':
                            propSet.push({
                                ...prop,
                                grade: gradeProp(prop, constraint)
                            })
                            break
                        case 'geo':
                            propSet.push({
                                ...prop,
                                grade: gradeProp(prop, constraint)
                            })
                            break
                        case 'text':
                            propSet.push({
                                ...prop,
                                grade: gradeProp(prop, constraint)
                            })
                            break
                        default:
                            propSet.push({
                                ...prop,
                                grade: gradeProp(prop, constraint)
                            })
                        }
                    }
                })
            })
            propList.push(propSet)
        })
        // finds all possibles combinations
        let matches = propList[0].map(prop => [prop])
        for (let i = 1; i < propList.length; i++) {
            matches = findAllMatches(matches, propList[i])
        }
        // grade different combinations
        let gradedMatches = matches.map(match => {
            return {
                properties: match.map(prop => prop.path), 
                grade: gradeMatch(match)
            }
        })
        // grade the combinations
        
        return {
            ...view,
            matches: gradedMatches
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

exports.activateDefaultConfigs = activateDefaultConfigs
exports.findAllMatches = findAllMatches
exports.getConfigs = getConfigs