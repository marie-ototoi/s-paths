// import * as d3 from 'd3'
// import moment from 'moment'
import { SparqlClient } from 'sparql-client-2'
import configLib from './configLib'
import { select } from '../actions/selectionActions';

const makePropQuery = (prop, options, firstTimeQuery) => {
    const { constraints, defaultGraph } = options
    const { path } = prop
    const graph = defaultGraph ? `FROM <${defaultGraph}> ` : ``
    const avgchar = (prop.category === 'text') ? `(AVG(?charlength) as ?avgcharlength) ` : ``
    const char = (prop.category === 'text' && firstTimeQuery) ? `BIND(STRLEN(?object) AS ?charlength)` : ``
    return `SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(?object) AS ?total) ${avgchar}(COUNT(DISTINCT ?entrypoint) AS ?coverage) ${graph}
WHERE {
${constraints}
${FSL2SPARQL(path, 'object')} 
${char}
}`
}

const makeQueryFromConstraint = (constraint) => {
    const { category, group, propName, value } = constraint
    if (category === 'datetime') {
        const startValue = Number(value)
        if (group === 'century') {
            return `FILTER (?${propName} >= xsd:date("${startValue}-01-01") && ?${propName} < xsd:date("${(startValue + 99)}-12-31")) . `
        } else if (group === 'decade') {
            return `FILTER (?${propName} >= xsd:date("${startValue}-01-01") && ?${propName} < xsd:date("${(startValue + 9)}-12-31")) . `
        } else { // treats other case as year (should be refined to handle time)
            return `FILTER (?${propName} >= xsd:date("${startValue}-01-01") && ?${propName} < xsd:date("${startValue}-12-31")) . `
        }
    } else if (category === 'text') {
        return `FILTER regex(?${propName}, "^${value}$") . `
    } else if (category === 'aggregate') {
        return `FILTER (?${propName} >= ${value[0]} && ?${propName} < ${value[1]}) . `
    }
}

const makeSelectionConstraints = (selections, selectedConfig, zone) => {
    const uriSelections = selections.filter(sel => sel.query.type === 'uri' && sel.zone === zone)
    const uriRegex = uriSelections.map(sel => sel.query.value + '$').join('|')
    // add constraints for constrained groups of entities (heatmap)
    const setSelection = selections.filter(sel => sel.query.type === 'set' && sel.zone === zone)
    let paths = ''
    const setConstraints = setSelection.map((sel, iS) => {
        return '(' + sel.query.value.map((constraint, iC) => {
            const propName = 'contraint' + constraint.propName
            if (iS === 0) paths += FSL2SPARQL(selectedConfig.properties[iC].path, propName)
            if (constraint.category === 'datetime') {
                const conditions = constraint.value.map((r, iR) => {
                    const cast = (selectedConfig.properties[iC].datatype === 'http://www.w3.org/2001/XMLSchema#date') ? `xsd:date("${r}-${(iR === 0) ? '01-01' : '12-31'}")` : `xsd:integer("${r}")`
                    return `?${propName} ${(iR === 0) ? '>=' : '<='} ${cast}`
                }).join(' && ')
                return `(${conditions})`
            } else if (constraint.category === 'text' || constraint.category === 'uri') {
                return ` regex(?${propName}, '^${constraint.value}$', 'i')`
            }
        }).join(' && ') + ')'
    }).join(' || ')
    let totalQuery = ''
    if (uriRegex !== '') totalQuery += `FILTER regex(?entrypoint, '^${uriRegex}$', 'i') .`
    if (setConstraints !== '') totalQuery += `${paths} FILTER (${setConstraints}) . `
    return totalQuery
}

const makeTotalQuery = (entitiesClass, options) => {
    let { constraints, defaultGraph } = options
    const graph = defaultGraph ? `FROM <${defaultGraph}> ` : ``
    return `SELECT (COUNT(DISTINCT ?entrypoint) AS ?total) ${graph}
WHERE {
?entrypoint rdf:type ${entitiesClass} . ${constraints}
}`
}

const getData = (endpoint, query, prefixes) => {
    const client = new SparqlClient(endpoint)
        .registerCommon('rdf', 'rdfs')
        .register(prefixes)
    return client
        .query(query)
        .execute()
}

const usesPrefix = (uri, prefixes) => {
    const parts = uri.split(':')
    return uri.match(/:/g) && !uri.match(/\//g) && prefixes[parts[0]] !== undefined
}

const createPrefix = (uri) => {
    return uri.replace(/([/:#_\-.]|purl|org|data|http|www)/g, (match, p1) => {
        if (p1) return ''
    }).toLowerCase()
}

const usePrefix = (uri, prefixes) => {
    return uri.replace(uri, (match, offset, string) => {
        for (var pref in prefixes) {
            let splittedUri = match.split(prefixes[pref])
            if (splittedUri.length > 1) return `${pref}:${splittedUri[1]}`
        }
        return match
    })
}

const useFullUri = (path, prefixes) => {
    return path.replace(path, (match, offset, string) => {
        for (var pref in prefixes) {
            let splittedUri = match.split(pref + ':')
            if (splittedUri.length > 1) return `${prefixes[pref]}${splittedUri[1]}`
        }
        return match
    })
}

const getRoot = (uri) => {
    const splitSlash = uri.split('/')
    const slashEnd = splitSlash[splitSlash.length - 1]
    const splitHash = uri.split('#')
    const hashEnd = splitHash[splitHash.length - 1]
    if ((slashEnd !== '' &&
    slashEnd.length < hashEnd.length)) {
        return splitSlash.slice(0, -1).join('/').concat('/')
    } else {
        return splitHash.slice(0, -1).join('#').concat('#')
    }
}

const getPropName = (uri) => {
    const root = getRoot(uri)
    return uri.replace(root, '')
}

const convertPath = (fullPath, prefixes) => {
    var uriRegex = /<[\w\d:.#_\-/#]+>?/gi
    return fullPath.replace(uriRegex, (match, p1) => {
        if (match) return usePrefix(match.substr(1, match.length - 2), prefixes)
    })
}

const makePropsQuery = (entitiesClass, options, level) => {
    // this is valid only for first level
    const { constraints, defaultGraph } = options
    const pathQuery = FSL2SPARQL(entitiesClass, 'interobject', 'subject')
    const graph = defaultGraph ? `FROM <${defaultGraph}> ` : ``
    const subject = (level === 1) ? '?subject' : '?interobject'
    return `SELECT DISTINCT ?property ?datatype ?language ?isiri ?isliteral ${graph}WHERE {
        ${pathQuery}${constraints}
        ${subject} ?property ?object .
        OPTIONAL { ?property rdfs:label ?propertylabel } .
        BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(ISLITERAL(?object) AS ?isliteral) .
        BIND(LANG(?object) AS ?language) .
    } GROUP BY ?property ?datatype ?language ?isiri ?isliteral`
    /* for (let index = 1; index <= levels; index ++) {
        let subject
    } */
}

const prefixDefined = (uri, prefixes) => {
    let root = getRoot(uri)
    let rootList = []
    for (let pref in prefixes) {
        rootList.push(prefixes[pref])
    }
    return rootList.includes(root)
}

const addSmallestPrefix = (url, prefixes) => {
    const root = getRoot(url)
    const flatRoot = createPrefix(root)
    const checkRoot = (len) => {
        let newPref = flatRoot.substr(0, len)
        if (prefixes[newPref]) {
            return checkRoot(len + 1)
        } else {
            return newPref
        }
    }
    let prefix = checkRoot(5)
    prefixes[prefix] = root
    return prefixes
}

const mergeStatsWithProps = (props, stats, totalEntities) => {
    return props.map((prop, index) => {
        if (stats[index].isFulfilled()) {
            let returnprops = { ...prop }
            let stat = stats[index].value()
            if (prop.category === 'text' && stat.results.bindings[0].avgcharlength) returnprops.avgcharlength = Math.floor(Number(stat.results.bindings[0].avgcharlength.value))
            return {
                ...returnprops,
                total: Number(stat.results.bindings[0].total.value),
                unique: Number(stat.results.bindings[0].unique.value),
                coverage: Number(stat.results.bindings[0].coverage.value) * 100 / totalEntities
            }
        } else {
            return prop
        }
    })
}

const defineGroup = (prop, previousProp, level, options) => {
    const { avgcharlength, property, datatype, isiri, isliteral, language } = prop
    const { ignoreList, maxChar, prefixes } = options
    const fullPath = `${previousProp.fullPath}/<${property.value}>/*`
    const path = convertPath(fullPath, prefixes)
    let returnprops = {}
    // console.log(datatype)
    if (ignoreList.includes(property.value)) {
        returnprops.category = 'ignore'
    } else if (isliteral && (isliteral.value === '1' || isliteral.value === 'true')) {
        if (datatype && datatype.value === 'http://www.w3.org/2001/XMLSchema#date') {
            returnprops.category = 'datetime'
        } else if (datatype && datatype.value === 'http://www.w3.org/2001/XMLSchema#integer') {
            let propName = getPropName(property.value)
            if (propName.match(/year|date|birthday/gi) ||
            propName === 'birth' ||
            propName === 'death') {
                returnprops.category = 'datetime'
            } else {
                returnprops.category = 'number'
            }
        } else if (datatype) {
            /* if (avgcharlength && avgcharlength.value > maxChar) {
                returnprops.category = 'ignore'
            } else { */
                returnprops.category = 'text'
            // }
        }
    } else if (isiri.value === '1' || isiri.value === 'true') {
        returnprops.category = 'uri'
    } else {
        returnprops.category = 'ovni'
    }
    // to add : geographical info
    if (language && language.value) returnprops.language = language.value
    return {
        ...returnprops,
        entrypoint: previousProp.entrypoint,
        endpoint: options.endpoint,
        property: property.value,
        datatype: (datatype) ? datatype.value : '',
        fullPath,
        path,
        level
    }
}

// to do : take constraints into account
const makeQuery = (entrypoint, configZone, zone, options) => {
    const { defaultGraph, constraints, prop1only } = options
    // console.log(configZone)
    let selectedConfig = configLib.getSelectedConfig(configZone, zone)
    // console.log(selectedConfig)
    let properties = selectedConfig.properties
    if (prop1only === true) properties = [properties[0]]
    const graph = defaultGraph ? `FROM <${defaultGraph}> ` : ``
    let propList = (configZone.entrypoint === undefined) ? `` : `?entrypoint `
    let groupList = (configZone.entrypoint === undefined) ? `` : `?entrypoint `
    let defList = ``
    let orderList = ``
    properties.forEach((prop, index) => {
        index += 1
        let hierarchical = false
        if (index === 1 && configZone.constraints[index - 1][0].hierarchical === true) {
            //console.log(prop, prop.category)
            hierarchical = prop.category === 'text' ? 'previous' : 'last'
        }
        propList = propList.concat(`?prop${index} ?labelprop${index} `)
        if (hierarchical) propList = propList.concat(`?directlink `)
        orderList = orderList.concat(`?prop${index} `)
        if (configZone.entrypoint === undefined) {
            propList = propList.concat(`(COUNT(?prop${index}) as ?countprop${index}) `)
            orderList = orderList.concat(`?countprop${index} `)
        }
        groupList = groupList.concat(`?prop${index} ?labelprop${index} `)
        if (hierarchical) groupList = groupList.concat(`?directlink `)
        const optional = configZone.constraints[index - 1] && configZone.constraints[index - 1][0].optional
        defList = defList.concat(FSL2SPARQL(prop.path, `prop${index}`, 'entrypoint', (index === 1), optional, hierarchical))
    })
    return `SELECT DISTINCT ${propList}${graph}
WHERE {
${constraints}
${defList}
} GROUP BY ${groupList}ORDER BY ${orderList}`
}

const makeTransitionQuery = (newConfig, newOptions, config, options, zone) => {
    let newConstraints = newOptions.constraints
    newConstraints = newConstraints.replace('?', '?new')
    const { defaultGraph, constraints } = options
    const graph = defaultGraph ? `FROM <${defaultGraph}> ` : ``
    //
    let selectedConfig = configLib.getSelectedConfig(config, zone)
    let propList = (config.entrypoint !== undefined || newConfig.entrypoint !== undefined) ? `?entrypoint ` : ``
    let groupList = (config.entrypoint !== undefined || newConfig.entrypoint !== undefined) ? `?entrypoint ` : ``
    let defList = ``
    let orderList = ``
    selectedConfig.properties.forEach((prop, index) => {
        if (prop.path !== '') {
            index += 1
            propList = propList.concat(`?prop${index} `)
            orderList = orderList.concat(`?prop${index} `)
            if (config.entrypoint === undefined) {
                propList = propList.concat(`(COUNT(?prop${index}) as ?countprop${index}) `)
                orderList = orderList.concat(`?countprop${index} `)
            }
            groupList = groupList.concat(`?prop${index} `)
            const optional = config.constraints[index - 1] && config.constraints[index - 1][0].optional
            defList = defList.concat(FSL2SPARQL(prop.path, `prop${index}`, 'entrypoint', (index === 1), optional))
        }
    })
    //
    let newdefList = ``
    let newSelectedConfig = configLib.getSelectedConfig(newConfig, zone)
    propList.concat((newConfig.entrypoint === undefined) ? `` : `?entrypoint `)
    groupList.concat((newConfig.entrypoint === undefined) ? `` : `?entrypoint `)
    newSelectedConfig.properties.forEach((prop, index) => {
        if (prop.path !== '') {
            index += 1
            propList = propList.concat(`?newprop${index} `)
            orderList = orderList.concat(`?newprop${index} `)
            if (config.entrypoint === undefined) {
                propList = propList.concat(`(COUNT(?newprop${index}) as ?newcountprop${index}) `)
                orderList = orderList.concat(`?newcountprop${index} `)
            }
            groupList = groupList.concat(`?newprop${index} `)
            newdefList = newdefList.concat(FSL2SPARQL(prop.path, `newprop${index}`, 'entrypoint', (index === 1), false))
        }
    })
    return `SELECT DISTINCT ${propList}${graph}
    WHERE {
        ${constraints}
        ${defList}
        OPTIONAL {
            ${newdefList}
        }
    } 
    GROUP BY ${groupList}
    ORDER BY ${orderList}`
}

const FSL2SPARQL = (FSLpath, propName = 'prop1', entrypointName = 'entrypoint', entrypointType = true, optional = false, hierarchical = null) => {
    let pathParts = FSLpath.split('/')
    let query = (entrypointType) ? `?${entrypointName} rdf:type ${pathParts[0]} . ` : ``
    let levels = Math.floor(pathParts.length / 2)
    for (let index = 1; index < pathParts.length; index += 2) {
        let predicate = pathParts[index]
        let objectType = pathParts[index + 1]
        let level = Math.ceil(index / 2)
        let thisSubject = (level === 1) ? entrypointName : `${propName}inter${(level - 1)}`
        let thisObject = (level === levels) ? propName : `${propName}inter${level}`
        query = query.concat(`?${thisSubject} ${predicate} ?${thisObject} . `)
        if (level === levels) query = query.concat(`${!optional ? 'OPTIONAL { ' : ''}?${thisObject} rdfs:label ?label${propName}${!optional ? ' } .' : ''} `)
        if (objectType !== '*') {
            query = query.concat(`?${thisObject} rdf:type ${objectType} . `)
        }
    }
    let queryHierarchical = ''
    if (hierarchical) {
        const prevPropName = (hierarchical !== 'last' && levels > 1) ? `${propName}inter${levels}` : propName
        const newPropName = (hierarchical !== 'last' && levels > 1) ? `${propName}inter${levels}bis` : `${propName}bis`
        queryHierarchical = query.replace(prevPropName, `${newPropName}`)
        queryHierarchical = `?${prevPropName} ?directlink ?${newPropName} . ` + queryHierarchical
        queryHierarchical = queryHierarchical.replace(/OPTIONAL {.*} \. /, '')
        //queryHierarchical = queryHierarchical.replace(prevPropName, newPropName)
        queryHierarchical = `OPTIONAL { ${queryHierarchical} }`
    }
    return `${optional ? 'OPTIONAL { ' : ''}${query}${queryHierarchical}${optional ? '} . ' : ''}`
}

exports.convertPath = convertPath
exports.createPrefix = createPrefix
exports.defineGroup = defineGroup
exports.FSL2SPARQL = FSL2SPARQL
exports.getData = getData
exports.getRoot = getRoot
exports.makeQuery = makeQuery
exports.makeQueryFromConstraint = makeQueryFromConstraint
exports.makePropQuery = makePropQuery
exports.makePropsQuery = makePropsQuery
exports.makeSelectionConstraints = makeSelectionConstraints
exports.makeTotalQuery = makeTotalQuery
exports.makeTransitionQuery = makeTransitionQuery
exports.mergeStatsWithProps = mergeStatsWithProps
exports.prefixDefined = prefixDefined
exports.addSmallestPrefix = addSmallestPrefix
exports.useFullUri = useFullUri
exports.usePrefix = usePrefix
exports.usesPrefix = usesPrefix
