import * as d3 from 'd3'
import * as dataLib from './dataLib'

export const getSelectedConfig = (config, zone) => {
    return config.matches.filter(m => m.selected === true)[0]
}
export const getConfigs = (configs, zone) => {
    return configs.filter(c => c.zone === zone)[0].views
}
export const getConfig = (configs, zone) => {
    return configs.filter(c => c.zone === zone)[0].views.filter(v => v.selected)[0]
}
export const getCurrentConfigs = (configs, status) => {
    if (configs.present[0].status === 'transition') {
        return (status === 'active') ? configs.past[configs.past.length - 1] : configs.present
    } else {
        return configs.present
    }
}
export const getViewDef = (views, id) => {
    // console.log(views, id)
    return views.filter(c => c.id === id)[0] || {}
}
export const inRange = (val, range) => {
    return (val >= range[0] && val <= range[1])
}
export const underRange = (val, range) => {
    return (val < range[0])
}
export const overRange = (val, range) => {
    return (val > range[1])
}
export const getDeviationCost = (min, max, optimal, score) => {
    if (!optimal || (!min && !max)) return 0
    const gapMin = (min) ? optimal[0] - min : null
    const gapMax = (max) ? max - optimal[1] : null
    const maxGap = (gapMin > gapMax) ? gapMin : gapMax
    return (maxGap) ? (score / maxGap) : null
}
const getCost = (val, min, max, optimal, score) => {
    if ((optimal && inRange(val, optimal)) || !optimal) return 0
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
    const { min, max, optimal } = constraint.unique
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
const scoreMatch = (match, entrypointFactor) => {
    match = match.filter(m => m.score >= 0)
    // mean of each property's score
    let score = match.map(m => m.score).reduce((a, b) => a + b, 0) / match.length
    let coverage = match.map(m => m.coverage).reduce((a, b) => a + b, 0) / match.length
    // bonus for each property represented
    score += 0.3 * match.length
    score *= coverage / 10
    // domain rules to add values for some properties : TO DO
    return score * entrypointFactor
}
export const findAllMatches = (inputList, addList) => {
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
export const defineConfigs = (views, stats) => {
    const configSetUp = views.map(view => {
        let propList = []
        // make a list of all possible properties for each constrained prop zone
        view.constraints.forEach(constraintSet => {
            let propSet = []
            stats.statements.forEach(prop => {
                constraintSet.forEach(constraint => {
                    // generic conditions
                    if ((prop.category === constraint.category) &&
                    (!constraint.subcategory || constraint.subcategory === prop.subcategory) &&
                    (!constraint.unique.min || (constraint.unique.min && (prop.unique > constraint.unique.min))) &&
                    (!constraint.unique.max || (constraint.unique.max && prop.unique < constraint.unique.max))
                    ) {
                        propSet.push({
                            ...prop,
                            score: scoreProp(prop, constraint)
                        })
                    }
                })
            })
            propList.push(propSet.sort((a, b) => {
                return b.score - a.score
            }))
        })
        // find all possible combinations
        let matches = propList[0].map(prop => [prop])
        // console.log(matches, propList)
        if (propList.length > 1 && propList[1].length > 0) {
            for (let i = 1; i < propList.length; i++) {
                matches = findAllMatches(matches, propList[i])
            }
        }
        // console.log(matches, propList)
        // remove combinations where a mandatory prop is missing
        // or where latitude and longitude are not coordinated
        matches = matches.filter(match => {
            let missingProp = false
            let geo = []
            match.forEach((prop, index) => {
                missingProp = ((prop.path === '') && (!view.constraints[index][0].optional))
                if (prop.category === 'geo') geo.push(prop.subcategory)
            })
            let validgeo = (geo.length === 0 || (geo.length === 1 && geo[0] === 'name') || (geo[0] === 'latitude' && geo[1] === 'longitude'))
            let unique = new Set(match.map(m => m.property))
            return !missingProp && unique.size === match.length && validgeo && match.length === view.constraints.length
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
                entrypointFactor,
                score: scoreMatch(match, entrypointFactor) /*,
                entrypoint: (view.entrypoint !== undefined) */
            }
        })
        // sort by score and return
        return {
            ...view,
            matches: scoredMatches.sort((a, b) => {
                return b.score - a.score
            })
        }
    })
        .filter(view => view.matches.length > 0)
        .sort((a, b) => {
            return b.matches[0].score - a.matches[0].score
        })
    return [
        { zone: 'main', views: [...configSetUp] },
        { zone: 'aside', views: [...configSetUp] }
    ]
}
export const activateDefaultConfigs = (configs) => {
    // console.log('activateDefaultConfigs', configs)
    return configs.map((config, cIndex) => {
        return {
            ...config,
            views: config.views.map((view, vIndex) => {
                let selected = ((cIndex === 0 && vIndex === 0) ||
                    (cIndex === 1 && vIndex === 1) ||
                    (cIndex === 1 && vIndex === 0 && config.views.length === 1))
                let selectedMatchIndex
                if (selected) {
                    if (cIndex === 0 || (cIndex === 1 && config.views.length === 1) || cIndex === 1) {
                        selectedMatchIndex = 0
                    } else {
                        selectedMatchIndex = 1
                        // would be interesting to check that properties for the second choice are different,
                        // if possible, from those of the first choice
                    }
                }
                return {
                    ...view,
                    selected,
                    matches: view.matches.map((match, mIndex) => {
                        return {
                            ...match,
                            selected: selectedMatchIndex === mIndex
                        }
                    })
                }
            })
        }
    })
}

export const getPropsLists = (configs, zone, dataset) => {
    const { labels, prefixes } = dataset
    const maxPropIndex = d3.max(configs.matches.map(m => m.properties.length))
    return Array.from(Array(maxPropIndex).keys()).map(propIndex => {
        return configs.matches
            .filter(config => config.properties[propIndex].path !== '')
            .map(config => {
                return {
                    path: config.properties[propIndex].path,
                    readablePath: dataLib.getReadablePathsParts(config.properties[propIndex].path, labels, prefixes),
                    selected: config.selected
                }
            }).reduce((configAcc, config) => {
                let existsIndex
                const exists = configAcc.filter((c, i) => {
                    if (c.path === config.path) existsIndex = i
                    return c.path === config.path
                })
                if (!exists.length > 0) {
                    configAcc.push(config)
                } else {
                    if (config.selected) configAcc[existsIndex].selected = true
                }
                return configAcc
            }, [])
    })
}

export const selectProperty = (config, zone, propIndex, path) => {
    let selectedMatch = getSelectedConfig(config, zone)
    // console.log(config, zone, selectedMatch)
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
    // console.log('bestConfigIndex', bestConfigIndex)
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

export const selectView = (id, configs) => {
    return configs.map(config => {
        return {
            ...config,
            selected: (config.id === id),
            matches: config.matches.map((match, index) => {
                return {
                    ...match,
                    selected: (config.id === id && index === 0)
                }
            })
        }
    })
}
