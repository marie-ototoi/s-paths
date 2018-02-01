const getSelectedConfig = (config, zone) => {
    return config.matches.filter(m => m[zone + 'Selected'] === true)[0]
}
const getConfigs = (configs, zone) => {
    return configs.filter(c => c.matches.filter(m => m[zone + 'Selected'] === true).length > 0)[0]
}
const getViewDef = (views, id) => {
    // console.log(views, id)
    return views.filter(c => c.id === id)[0] || {}
}
const inRange = (val, range) => {
    return (val >= range[0] && val <= range[1])
}
const underRange = (val, range) => {
    return (val < range[0])
}
const overRange = (val, range) => {
    return (val > range[1])
}
const getDeviationCost = (min, max, optimal, score) => {
    if (!optimal || (!min && !max)) return 0
    const gapMin = (min) ? optimal[0] - min : null
    const gapMax = (max) ? max - optimal[1] : null
    const maxGap = (gapMin > gapMax) ? gapMin : gapMax
    return (maxGap) ? (score / maxGap) : null
}
const getCost = (val, min, max, optimal, score) => {
    if (optimal && inRange(val, optimal)) return 0
    const deviationCost = getDeviationCost(min, max, optimal, score)
    if (underRange(val, optimal) && min) {
        return deviationCost * (optimal[0] - val)
    } else if (overRange(val, optimal) && max) {
        return deviationCost * (val - optimal[1])
    }
    return score / 2
}
const scoreProp = (prop, constraint) => {
    if (prop.path === '') return null
    // et eventuellement si la prop peut avoir plusieurs valeurs pour une meme instance (specifier dans la vue si c'est souhaite)
    const maxscore = 1
    let cost = 0
    switch (prop.category) {
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
        cost = getCost(prop.unique, min, max, optimal, maxscore)
        break
    default:
        //
    }
    // console.log(cost, prop.level, (cost + prop.level), prop)
    cost += prop.level * 0.3
    let score = maxscore - cost
    // modulates score according to the coverage of the dataset by this prop
    score *= prop.coverage / 10
    return (score > 0) ? score : 0
}
const scoreMatch = (match) => {
    match = match.filter(m => m.score >= 0)
    // mean of each property's score
    let score = match.map(m => m.score).reduce((a, b) => a + b, 0) / match.length
    let coverage = match.map(m => m.coverage).reduce((a, b) => a + b, 0) / match.length
    // bonus for each property represented
    score += 0.3 * match.length
    score *= coverage / 10
    // domain rules to add values for some properties : TO DO 
    return score
}
const findAllMatches = (inputList, addList) => {
    return inputList.map(match => {
        // console.log('match', match)
        return addList.map(addElt => {
            match.forEach(m => {
                // prevent from having several times the same prop
                if (m.path === addElt.path) addElt = { path: '' }
            })
            return [...match, addElt]
        })
    }).reduce((a, b) => {
        return a.concat(b)
    }, [])
}
const defineConfigs = (views, stats) => {
    return views.map(view => {
        let propList = []
        // make a list of all possible properties for each constrained prop zone
        view.constraints.forEach(constraintSet => {
            let propSet = []
            stats.statements.forEach(prop => {
                constraintSet.forEach(constraint => {
                    // generic conditions
                    if ((prop.category === constraint.category ||
                        constraint.category === '*') &&
                    !(
                        (constraint.unique.min && prop.unique < constraint.unique.min) ||
                        (constraint.unique.max && prop.unique > constraint.unique.max)
                    )) {
                        // conditions specific to each category
                        switch (prop.category) {
                        case 'datetime':
                            propSet.push({
                                ...prop,
                                score: scoreProp(prop, constraint)
                            })
                            break
                        case 'number':
                            propSet.push({
                                ...prop,
                                score: scoreProp(prop, constraint)
                            })
                            break
                        case 'geo':
                            propSet.push({
                                ...prop,
                                score: scoreProp(prop, constraint)
                            })
                            break
                        case 'text':
                            propSet.push({
                                ...prop,
                                score: scoreProp(prop, constraint)
                            })
                            break
                        default:
                            propSet.push({
                                ...prop,
                                score: scoreProp(prop, constraint)
                            })
                        }
                    }
                })
            })
            propList.push(propSet.sort((a, b) => {
                return b.score - a.score
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
            if (!inRange(stats.totalInstances, [min, max])) {
                // will result in each score being 0, so discard the view
                entrypointFactor = 0
            } else {
                // will higher each score
                entrypointFactor += getCost(stats.totalInstances, min, max, optimal, 0.3)
            }
        }
        // remove combinations where a mandatory prop is missing
        let scoredMatches = matches.map(match => {
            return {
                properties: match,
                score: scoreMatch(match) * entrypointFactor /*,
                entrypoint: (view.entrypoint !== undefined) */
            }
        })
        // sort by score and return
        return {
            ...view,
            matches: scoredMatches.sort((a, b) => {
                return b.score - a.score
            })/*.map((match, index) => {
                return {
                    ...match,
                    selected: (index === 0)
                }
            })*/
        }
    })
        .filter(view => view.matches.length > 0)
        .sort((a, b) => {
            return b.matches[0].score - a.matches[0].score
        })
}
const activateDefaultConfigs = (configs) => {
    return configs.map((vc, cIndex) => {
        return {
            ...vc,
            matches: vc.matches.map((match, mIndex) => {
                // if (cIndex === 0 && mIndex === 0) storeFirst = match
                let shouldSelectSecond = ((configs.length === 1 && cIndex === 0 && mIndex === 1) ||
                    (configs.length > 1 && cIndex === 1 && mIndex === 0))
                // would be interesting to check that properties for the seco nd choice are different, 
                // if possible, from those of the first choice 
                return {
                    ...match,
                    mainSelected: (cIndex === 0 && mIndex === 0),
                    asideSelected: shouldSelectSecond
                }
            })
        }
    })
}
const selectProperty = (config, propIndex, path) => {
    let selectedMatch = config.matches.filter(match => match.selected === true)[0]
    let possibleConfigs = config.matches.map((match, index) => {
        let score
        if (match.properties[propIndex].path !== path) {
            score = null
        } else {
            let indexProp = 0
            score = match.properties.reduce((acc, currentProp) => {
                if (currentProp.path === selectedMatch.properties[indexProp].path) {
                    acc += match.properties.length - indexProp
                }
                indexProp++
                return acc
            }, 0)
        }
        return {
            index,
            score
        }
    }).filter(match => {
        return match.score !== null
    }).sort((a, b) => {
        return b.score - a.score
    })
    let bestConfigIndex = possibleConfigs[0].index
    return {
        ...config,
        matches: config.matches.map((match, index) => {
            return {
                ...match,
                selected: (index === bestConfigIndex)
            }
        })
    }
}
exports.activateDefaultConfigs = activateDefaultConfigs
exports.selectProperty = selectProperty
exports.findAllMatches = findAllMatches
exports.defineConfigs = defineConfigs
exports.getConfigs = getConfigs
exports.getDeviationCost = getDeviationCost
exports.getViewDef = getViewDef
exports.inRange = inRange
exports.overRange = overRange
exports.getSelectedConfig = getSelectedConfig
exports.underRange = underRange
