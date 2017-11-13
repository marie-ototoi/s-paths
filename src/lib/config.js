
const inRange = (val, range) => {
    return (val >= range[0] && val <= range[1])
}
const underRange = (val, range) => {
    return (val < range[0])
}
const overRange = (val, range) => {
    return (val > range[1])
}
const getDeviationCost = (min, max, optimal, grade) => {
    if(!optimal || (!min && !max)) return 0
    const gapMin = (min) ? optimal[0] - min : null
    const gapMax = (max) ? max - optimal[1] : null
    const maxGap = (gapMin > gapMax) ? gapMin : gapMax
    return (maxGap) ? (grade / maxGap) : null
}
const getCost = (val, min, max, optimal, grade) => {
    if (optimal && inRange(val, optimal)) return 0
    const deviationCost = getDeviationCost(min, max, optimal, grade)
    if (underRange(val, optimal) && min) {
        return deviationCost * (optimal[0] - val)
    } else if (overRange(val, optimal) && max) {
        return deviationCost * (val - optimal[1])
    } 
    return grade / 2            
}
const gradeProp = (prop, constraint) => {
    if (prop.path === '') return null
    
    // et eventuellement si la prop peut avoir plusieurs valeurs pour une meme instance (specifier dans la vue si c'est souhaite)
    const maxGrade = 0.5
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
        const { min, max, optimal } = constraint.unique
        cost = getCost(prop.unique_values, min, max, optimal, maxGrade)
        break
    default:
        //
    }
    let grade = maxGrade - cost
    // modulates grade according to the coverage of the dataset by this prop
    grade *= prop.coverage / 100
    return grade
}

const gradeMatch = (match) => {
    match = match.filter(m => m.grade != null)
    // mean of each property's grade
    let grade = match.map(m => m.grade).reduce((a, b) => a + b , 0) / match.length
    // bonus for each property represented
    grade += 0.3 * match.length
    // domain rules to add values for some properties : TO DO 
    return grade        
}

const findAllMatches = (inputList, addList) => {
    return  inputList.map(match => {
        // console.log('match', match)
        return addList.map(addElt => {
            match.forEach(m => {
                // prevent from having several times the same prop
                if(m.path === addElt.path) addElt = { path: '' }
            })
            return [...match, addElt]
        })
    }).reduce((a, b) => {
        return a.concat(b)
    }, [])
}

const getConfigs = (views, stats) => {
    return views.map(view => {
        let propList = []
        // make a list of all possible properties for each constrained prop zone
        view.constraints.forEach(constraintSet => {
            let propSet = []
            stats.statements.forEach(prop => {
                constraintSet.forEach(constraint => {
                    // generic conditions
                    if ((prop.group === constraint.group ||
                        constraint.group === '*') &&
                    !(
                        (constraint.unique.min && prop.unique_values < constraint.unique.min) ||
                        (constraint.unique.max && prop.unique_values > constraint.unique.max)
                    )) {
                        // conditions specific to each group
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
            propList.push(propSet.sort((a, b) => {
                return b.grade - a.grade
            }))
        })
        // find all possible combinations
        let matches = propList[0].map(prop => [prop])
        for (let i = 1; i < propList.length; i++) {
            matches = findAllMatches(matches, propList[i])
        }
        // remove combinations where a mandatory prop is missing
        matches = matches.filter(match => {
            let missingProp = false
            match.forEach((prop, index) => {
                missingProp = ((prop.path === '') && (!view.constraints[index][0].optional))
            })
            return !missingProp
        })
        // if the view is supposed to display each entity
        let entrypointFactor = 1
        if (view.entrypoint) {
            const { min, max, optimal } = view.entrypoint
            let addValue
            if (! inRange(stats.total_instances, [min, max])) {
                // will result in each grade being 0, so discard the view
                entrypointFactor = 0
            } else {
                // will higher each grade
                entrypointFactor += getCost(stats.total_instances, min, max, optimal, 0.3)
            }
        }
        // remove combinations where a mandatory prop is missing
        let gradedMatches = matches.map(match => {
            return {
                properties: match.map(prop => prop.path), 
                grade: gradeMatch(match) * entrypointFactor
            }
        })
        // sort by grade and return
        return {
            ...view,
            matches: gradedMatches.sort((a, b) => {
                return b.grade - a.grade
            }).map((match, index) => {
                return {
                    ...match,
                    selected: (index === 0)
                }
            })
        }
    })
        .filter(view => view.matches.length > 0)
        .sort((a, b) => {
            return b.matches[0].grade - a.matches[0].grade
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
exports.getDeviationCost = getDeviationCost
exports.inRange = inRange
exports.overRange = overRange
exports.underRange = underRange
