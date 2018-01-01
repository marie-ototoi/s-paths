import * as d3 from 'd3'
import moment from 'moment'
import {SparqlClient, SPARQL} from 'sparql-client-2'
import configLib from './configLib'

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
    return uri.replace(/([\/:#_\-.]|purl|org|data|http|www)/g, (match, p1) => { 
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

const convertPath = (fullPath, prefixes) => {
    var uriRegex = /<[\w\d:\.#\-_\/#]+>?/gi
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
            returnprops.category = 'number'
        } else if (datatype) {
            if (avgcharlength && avgcharlength.value > maxChar) {
                returnprops.category = 'ignore'
            } else {
                returnprops.category = 'text'
            }
        }
    } else if (isiri.value === '1' || isiri.value === 'true') {
        returnprops.category = 'uri'
    } else {
        returnprops.category = 'ovni'
    }
    if (language && language.value) returnprops.language = language.value
    return {
        ...returnprops,
        entrypoint: previousProp.entrypoint,
        property: property.value,
        fullPath,
        path,
        level
    }
}

// to do : take constraints into account
const makeQuery = (entrypoint, configZone, options) => {
    const { defaultGraph, constraints } = options
    let selectedConfig = configLib.getSelectedConfig(configZone)
    const graph = defaultGraph ? `FROM <${defaultGraph}> ` : ``
    let propList = (configZone.entrypoint === undefined) ? `` : `?entrypoint `
    let groupList = (configZone.entrypoint === undefined) ? `` : `?entrypoint `
    let defList = ``
    let orderList = ``
    // console.log(selectedConfig)
    selectedConfig.properties.forEach((prop, index) => {
        index += 1
        propList = propList.concat(`?prop${index} ?labelprop${index} `)
        orderList = orderList.concat(`?prop${index} `)
        if (configZone.entrypoint === undefined) {
            propList = propList.concat(`(COUNT(?prop${index}) as ?countprop${index}) `)
            orderList = orderList.concat(`?countprop${index} `)
        }
        groupList = groupList.concat(`?prop${index} ?labelprop${index} `)
        defList = defList.concat(FSL2SPARQL(prop.path, `prop${index}`, 'entrypoint', (index === 1)))
    })
    /* console.log(`SELECT DISTINCT ${propList}${graph}
    WHERE {
        OPTIONAL {
        ${defList}
        }
        } GROUP BY ${groupList}ORDER BY ${orderList}`) */
    return `SELECT DISTINCT ${propList}${graph}
WHERE {
${constraints}
${defList}
} GROUP BY ${groupList}ORDER BY ${orderList}`
}

const FSL2SPARQL = (FSLpath, propName = 'prop1', entrypointName = 'entrypoint', entrypointType = true) => {
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
        if (level === levels) query = query.concat(`OPTIONAL { ?${thisObject} rdfs:label ?label${propName} } . `)
        if (objectType !== '*') {
            query = query.concat(`?${thisObject} rdf:type ${objectType} . `)
        }
    }
    return query
}

exports.convertPath = convertPath
exports.createPrefix = createPrefix
exports.defineGroup = defineGroup
exports.FSL2SPARQL = FSL2SPARQL
exports.getData = getData
exports.getRoot = getRoot
exports.makeQuery = makeQuery
exports.makePropQuery = makePropQuery
exports.makePropsQuery = makePropsQuery
exports.makeTotalQuery = makeTotalQuery
exports.mergeStatsWithProps = mergeStatsWithProps
exports.prefixDefined = prefixDefined
exports.addSmallestPrefix = addSmallestPrefix
exports.useFullUri = useFullUri
exports.usePrefix = usePrefix
exports.usesPrefix = usesPrefix
