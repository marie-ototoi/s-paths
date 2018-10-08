import * as d3 from 'd3'

export const getSelectedMatch = (config) => {
    let thematch = config.matches.filter(m => m.selected === true)
    return thematch.length > 0 ? thematch[0] : []
}
export const getConfigs = (configs, zone) => {
    return configs.views
}
export const getSelectedView = (configs, zone) => {
    return configs.views ? configs.views.filter(v => v.selected)[0] : undefined
}
export const getViewByName = (views, name) => {
    let filtered = views.filter(c => c.id === name)
    return (filtered.length > 0) ? filtered[0] : null
}
export const getCurrentConfigs = (configs, zone, status) => {
    if (zone === 'main') {
        if (configs.present.status === 'transition' && status === 'active') {
            // console.log('main', status, configs.present.status, 'PREV')
            return configs.past[configs.past.length - 1]
        } else {
            // console.log('main', status, configs.present.status, 'PRES')
            return configs.present
        }
    } else {
        if (configs.present.status === 'transition' && status === 'active') {
            // console.log('aside', status, configs.present.status, 'PREV')
            return configs.past.length >= 1 ? configs.past[configs.past.length - 1] : []
        } else {
            // console.log('aside', status, configs.present.status, 'PRES')
            return configs.past.length >= 2 ? configs.past[configs.past.length - 2] : []
        }
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
export const isMatchValid = (match, config) => {
    
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
    match = match.filter(p => p.score >= 0)
    // mean of each property's score
    let score = match.map(p => p.score).reduce((a, b) => a + b, 0) / match.length
    let coverage = match.map(p => isNaN(p.coverage) ? 50 : p.coverage).reduce((a, b) => a + b, 0) / match.length
    // bonus for each property represented
    score += 10 * match.length
    score *= coverage / 10
    // domain rules to add values for some properties : TO DO
    return score // * entrypointFactor
}
export const findAllMatches = (inputList, addList) => {
    return inputList.map(match => {
        // console.log('match', match)
        return addList.map(addElt => {
            match.forEach(m => {
                // prevent from having several times the same prop
                if (m.path === addElt.path) addElt = { path: '' }
            })
            // console.log([...match, addElt])
            return [...match, addElt]
        })
    }).reduce((a, b) => {
        // console.log(a.concat(b))
        return a.concat(b)
    }, [])
}
export const getDictStats = (stats) => {
    let statsDict = { '*' : stats.statements }
    let nestedStats = d3.nest().key(stat => stat.category).entries(stats.statements)
    nestedStats.forEach(ns => {
        statsDict[ns.key] = ns.values
    })
    return statsDict
}
export const getTimelineDict = (data, propName) => {
    let dict = { }
    let nestedStats = d3.nest().key(dp => dp[propName].value).entries(data)
    nestedStats.forEach(ns => {
        dict[ns.key] = { events: [] }
        for (let i = 0; i < ns.values.length; i ++) {
            dict[ns.key].entrypoint = ns.values[i].entrypoint.value
            dict[ns.key].prop1 = ns.values[i].prop1.value
            dict[ns.key].prop2 = ns.values[i].prop2.value
        }
        
    })
    return dict
}
export const defineConfigs = (views, stats) => {
    let statsDict = getDictStats(stats)
    const configSetUp = views.map(view => {
        let propList = []
        if (view.entrypoint) {
            if (view.entrypoint.min > stats.selectionInstances || view.entrypoint.max < stats.selectionInstances) return { matches: [] }
        }
        if (stats.selectionInstances === 1) {
            return {
                ...view,
                matches: view.id === 'ListAllProps' ? stats.statements.sort((a, b) => {
                    return b.score - a.score
                }) : []
            }
        } else {
            // make a list of all possible properties for each constrained prop zone
            view.constraints.forEach(constraintSet => {
                let propSet = []
                constraintSet.forEach(constraint => {
                    if(statsDict[constraint.category]) {
                        statsDict[constraint.category].forEach(prop => {                
                            // generic conditions
                            if (prop.total > 0 &&
                            (!constraint.subcategory || constraint.subcategory === prop.subcategory) &&
                            (!constraint.unique.min || (constraint.unique.min && (prop.unique >= constraint.unique.min && stats.selectionInstances >= constraint.unique.min))) &&
                            (!constraint.unique.max || (constraint.unique.max && prop.unique <= constraint.unique.max)) &&
                            (!constraint.avg || !constraint.avg.min || (constraint.avg.min && prop.avgcharlength >= constraint.avg.min)) &&
                            (!constraint.avg || !constraint.avg.max || (constraint.avg.max && prop.avgcharlength <= constraint.avg.max))
                            ) {
                                propSet.push({
                                    ...prop,
                                    score: scoreProp(prop, constraint)
                                })
                            }
                        })
                    }
                })
                propList.push(propSet.sort((a, b) => {
                    return b.score - a.score
                }))
            })
            // console.log(view.id, propList)
            if (propList.length === 0 || propList[0].length === 0) return { matches: [] }
            // find all possible combinations
            let matches = propList[0].map(prop => [prop])
            if (propList.length > 1 && propList[1].length > 0) {
                for (let i = 1; i < propList.length; i++) {
                    if(propList[i].length > 0) matches = findAllMatches(matches, propList[i])
                }
            }
            // console.log(view.id, statsDict, matches, propList)
            // remove combinations where a mandatory prop is missing
            // or where latitude and longitude are not coordinated
            matches = matches.map(match => {
                let optionalProp = view.constraints[view.constraints.length -1][0].optional !== undefined
                if (!((match.length === view.constraints.length) || (match.length === view.constraints.length -1 && optionalProp))) return undefined
                let geo = []
                match.forEach((m, index) => {
                    if (m.category === 'geo') geo.push(m.subcategory)
                })
                if (geo.length > 0) {
                    if (!(geo.length === 0 || (geo[0] === 'latitude' && geo[1] === 'longitude'))) return undefined
                }
                let unique = new Set(match.map(m => m.property))
                if (!(unique.size === match.length)) return undefined
                return match
            }).filter(match => match)
            // console.log(view.id, matches)
            if (matches.length === 0) return { matches }

            // if the view is supposed to display each entity
            let entrypointFactor = 1
            if (view.entrypoint) {
                const { min, max, optimal } = view.entrypoint
                if (optimal) {
                    // will higher each score
                    entrypointFactor += getCost(stats.selectionInstances, min, max, optimal, 0.3)
                }
            }
            let scoredMatches
            if ( view.id === 'ListAllProps' ) {
                scoredMatches = [ {
                    score: 170,
                    properties: matches.map(match => match[0])
                } ]
            } else {
                scoredMatches = matches.map(match => {
                    return {
                        properties: match,
                        entrypointFactor,
                        multiple: view.constraints.map((cs, csi) => {
                            let xt = []
                            cs.forEach(c => {
                                if(c.multiple) {
                                    xt = statsDict[c.category].filter(stat =>  stat.path !== match[csi].path)
                                }
                            })
                            return xt
                        }),
                        score: scoreMatch(match, entrypointFactor) /*,
                        entrypoint: (view.entrypoint !== undefined) */
                    }
                })
            }
            // console.log(view.id, scoredMatches)
            // sort by score and return
            return {
                ...view,
                matches: scoredMatches.sort((a, b) => {
                    return b.score - a.score
                })
            }
        }
    })
        .filter(view => view.matches.length > 0)
        .sort((a, b) => {
            return b.matches[0].score - a.matches[0].score
        })
    // if (configSetUp.matches) console.log('salut la config', configSetUp.matches.map(p => p.fullPath))
    return { views: [...configSetUp] }
}
export const activateDefaultConfigs = (config) => {
    // console.log('activateDefaultConfigs', configs)
    return {
        ...config,
        views: config.views.map((view, vIndex) => {
            let selectedView = (vIndex === 0)
            return {
                ...view,
                selected: selectedView,
                matches: selectedView ? view.matches.map((match, mIndex) => {
                    return {
                        ...match,
                        selected: mIndex === 0
                    }
                }) : view.matches
            }
        })
    }
}
export const getPropsLists = (configs, zone, dataset) => {
    // const { labels, prefixes } = dataset
    const maxPropIndex = d3.max(configs.matches.map(m => m.properties.length))
    return Array.from(Array(maxPropIndex).keys()).map(propIndex => {
        return configs.matches
            .filter(config => config.properties[propIndex].path !== '')
            .map(config => {
                return {
                    path: config.properties[propIndex].path,
                    readablePath: config.properties[propIndex].readablePath,
                    // readablePath: dataLib.getReadablePathsParts(config.properties[propIndex].path, labels, prefixes),
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
    let selectedMatch = getSelectedMatch(config, zone)
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
