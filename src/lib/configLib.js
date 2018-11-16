import * as d3 from 'd3'

export const getSelectedMatch = (config) => {
    return config.selectedMatch
    // let thematch = config.matches.filter(m => m.selected === true)
    // return thematch.length > 0 ? thematch[0] : []
}
export const getConfigs = (configs, zone) => {
    return configs.views
}
export const getSelectedView = (configs) => {
    // console.log('OOOOO', configs)
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
const scoreProp = (prop, constraint, rankFactors, preferences) => {
    /* rankFactors = {
        category: 1,
        definition: 2,
        level: 2,
        coverage: 8
    } */
    if (prop.path === '') return null
    // et eventuellement si la prop peut avoir plusieurs valeurs pour une meme instance (specifier dans la vue si c'est souhaite)
    let score = {}
    const { min, max, optimal } = constraint.unique
    // if (prop.coverage < 10) return 0
    score.coverage = prop.coverage / 100   
    switch (prop.category) {
    case 'datetime':
        score.category = 0.9
        // repartition
        break
    case 'number':
        score.category = 0.4
        break
    case 'geo':
        score.category = 1
        break
    case 'text':
        // the closer to the optimal range, the better
        score.category = 0.6
        break
    default:
        score.category = 0.1
        //
    }
    
    score.customProps = preferences[prop.path] || 0.1
    // console.log(prop.path, score.customProps)
    score.definition = 1 - getCost(prop.unique, min, max, optimal, 1)
    score.total = 0
    score.level = 1 - prop.level
    let coeff = 0
    for (let factor in rankFactors) {
        score.total += score[factor] * rankFactors[factor]
        coeff += rankFactors[factor]
    }
    score.total = Math.round(score.total / coeff * 100) / 100
    return score.total
}

/**
 *
 * @param match
 * @param viewWeight
 * @param rankFactors
 * @returns {number|*}
 */
export const scoreMatch = (match, viewWeight, rankFactors) => {
    /* rankFactors = {
        view: 1,
        propsNumber: 1,
        propsAverage: 1
    } */
    let score = {}
    match = match.filter(p => p.score >= 0)
    // mean of each property's score
    score.propsNumber = match.length / 5
    score.propsAverage = match.map(p => p.score).reduce((a, b) => a + b, 0) / match.length
    score.view = viewWeight
    let total = 0
    let coeff = 0
    for (let factor in rankFactors) {
        total += score[factor] * rankFactors[factor]
        coeff += rankFactors[factor]
    }
    return Math.round(total / coeff * 100) / 100
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
    let statsDict = { '*': stats.statements }
    let nestedStats = d3.nest().key(stat => stat.category).entries(stats.statements)
    nestedStats.forEach(ns => {
        statsDict[ns.key] = ns.values.sort((a, b) => b.coverage - a.coverage)
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
export const defineConfigs = (views, stats, dataset) => {
    let statsDict = getDictStats(stats)
    let { rankPropFactors, rankMatchFactors } = dataset
    const configSetUp = views.map(view => {
        let propList = []
        if (view.entrypoint) {
            if (view.entrypoint.min > stats.selectionInstances || view.entrypoint.max < stats.selectionInstances) return { selectedMatch: undefined }
        }
        if (stats.selectionInstances === 1) {
            if (view.id === 'ListAllProps' || view.id === 'InfoCard') {
                let propSet = stats.statements.map(prop => {
                    return {
                        ...prop,
                        score: scoreProp(prop, view.constraints[0][0], rankPropFactors, dataset.propertyPreferences)
                    }
                }).sort((a, b) => {
                    return b.score - a.score
                })
                // console.log('OKKKKK', propSet)
                propList.push(propSet)
            } else {
                return { selectedMatch: undefined }
            }
        } else {
            // make a list of all possible properties for each constrained prop zone
            view.constraints.forEach(constraintSet => {
                let propSet = []
                let count = 0
                constraintSet.forEach(constraint => {
                    if(statsDict[constraint.category]) {
                        statsDict[constraint.category].forEach(prop => {                
                            // generic conditions
                            // console.log(prop.total, prop.path)
                            // console.log(constraint.unique, prop.unique, (!constraint.unique.min || (constraint.unique.min && prop.unique >= constraint.unique.min)), (!constraint.unique.max || (constraint.unique.max && prop.unique <= constraint.unique.max)))
                            // console.log(constraint.avg,
                            //    prop.avgcharlength,
                            //    !constraint.avg || !constraint.avg.min ||(constraint.avg.min && prop.avgcharlength >= constraint.avg.min), 
                            //    !constraint.avg ||!constraint.avg.max || (constraint.avg.max && prop.avgcharlength <= constraint.avg.max))
                            // console.log(constraint.subcategory, prop.subcategory, !constraint.subcategory)
                            if (prop.total > 0 &&
                            (!constraint.subcategory || constraint.subcategory === prop.subcategory) &&
                            (!constraint.unique.min || (constraint.unique.min && prop.unique >= constraint.unique.min)) &&
                            (!constraint.unique.max || (constraint.unique.max && prop.unique <= constraint.unique.max)) &&
                            (!constraint.avg || !constraint.avg.min || (constraint.avg.min && prop.avgcharlength >= constraint.avg.min)) &&
                            (!constraint.avg || !constraint.avg.max || (constraint.avg.max && prop.avgcharlength <= constraint.avg.max))
                            ) {
                                // console.log('PASSE ?')
                                propSet.push({
                                    ...prop,
                                    score: count > 50 ? 0.1 : scoreProp(prop, constraint, rankPropFactors, dataset.propertyPreferences)
                                })
                                count ++
                            }
                        })
                    }
                })
                propList.push(propSet.sort((a, b) => {
                    return b.score - a.score
                }).filter(p => p.score > 0))
            })
            // console.log(view.id,propList)
            propList = propList.reduce((acc, cur) => {
                if (cur.length > 0) acc.push(cur)
                return acc
            }, [])
        }
        // console.log(view.id, propList)
        // sort by score and return
        let alreadyInMatch = []
        let match = propList.map((list, listIndex) => {
            if (list.length > 0) {
                let index = 0
                while (alreadyInMatch.includes(list[index].path) && list[index + 1]){
                    index ++
                }
                if (!alreadyInMatch.includes(list[index].path)) {
                    alreadyInMatch.push(list[index].path)
                    return list[index]
                }
            }
        }).filter(list => list)
        // console.log(view.id, match)
        let selectedMatch
        if ((match.length === view.constraints.length) ||
            (view.constraints[view.constraints.length-1][0].optional !== undefined && 
                match.length === view.constraints.length - 1)) {
            selectedMatch = {
                properties: match,
                scoreMatch: scoreMatch(match, view.weight, rankMatchFactors)
            }
        }
        return {
            ...view,
            propList,
            selectedMatch,
            multiple: view.constraints.map((cs, csi) => {
                let xt = []
                cs.forEach(c => {
                    if(c.multiple) {
                        xt = statsDict[c.category]
                    }
                })
                return xt
            })
        }
        
    })
        .filter(view => view.selectedMatch !== undefined)
        .sort((a, b) => {
            return b.selectedMatch.scoreMatch - a.selectedMatch.scoreMatch
        })
    // if (configSetUp.matches) console.log('salut la config', configSetUp.matches.map(p => p.fullPath))
    // console.log(configSetUp)
    return { views: [...configSetUp] }
}
export const activateDefaultConfigs = (config) => {
    // console.log('activateDefaultConfigs', configs)
    return {
        ...config,
        views: config.views.map((view, vIndex) => {
            return {
                ...view,
                selected: (vIndex === 0)
            }
        })
    }
}
