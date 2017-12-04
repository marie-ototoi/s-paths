import * as d3 from 'd3'
import moment from 'moment'
import {SparqlClient, SPARQL} from 'sparql-client-2'

const makePropQuery = (prop, constraints, defaultGraph) => {
    const { path } = prop
    const graph = defaultGraph ? `FROM <${defaultGraph}> ` : ``
    const avgchar = (prop.category === 'text') ? `(AVG(?charlength) as ?avgcharlength) ` : ``
    const char = (prop.category === 'text') ? `BIND(STRLEN(?object) AS ?charlength)` : ``
    return `SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(?object) AS ?total) ${avgchar}(COUNT(DISTINCT ?entrypoint) AS ?coverage) ${graph}
WHERE {
${FSL2SPARQL(path, 'object')} 
${char}
}`
}

const makeTotalQuery = (entitiesClass, constraints, defaultGraph) => {
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

/*const getStats = (categorizedProps, options) => {
    const { endpoint, constraints, prefixes, defaultGraph } = options
    return Promise.all(categorizedProps.map(prop => {
        let propQuery = makePropQuery(prop, constraints, defaultGraph)
        console.log(prop.path, propQuery)
        return getData(endpoint, propQuery, prefixes)
    }))
}*/

const usePrefix = (uri, prefixes) => {
    return uri.replace(uri, (match, offset, string) => {
        for (var pref in prefixes) {
            let splittedUri = match.split(prefixes[pref])
            if (splittedUri.length > 1) return `${pref}:${splittedUri[1]}`
        }
        return match
    })
}

const makePropsQuery = (entitiesClass, constraints, level, defaultGraph) => {
    // this is valid only for first level
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

const mergeStatsWithProps = (props, stats, totalEntities) => {
    return props.map((prop, index) => {
        let returnprops = { ...prop }
        if (prop.category === 'text' && stats[index].results.bindings[0].avgcharlength) returnprops.avgcharlength = Math.floor(Number(stats[index].results.bindings[0].avgcharlength.value))
        return {
            ...returnprops,
            total: Number(stats[index].results.bindings[0].total.value),
            unique: Number(stats[index].results.bindings[0].unique.value),
            coverage: Number(stats[index].results.bindings[0].coverage.value) * 100 / totalEntities
        }
    })
}

const defineGroup = (prop, previousPath, level, options) => {
    const { property, datatype, isiri, isliteral, language } = prop
    const { ignoreList, prefixes } = options
    const path = `${previousPath}/${usePrefix(property.value, prefixes)}/*`
    let returnprops = {}
    // console.log(datatype)
    if (ignoreList.includes(property.value)) {
        returnprops.category = 'ignore'
    } /*else if (isliteral.value === '1' || isliteral.value === 'true') {
        if (datatype && datatype.value === 'datetime') {
            returnprops.category = 'datetime'
        } else if (datatype && datatype.value === 'http://www.w3.org/2001/XMLSchema#integer') {
            returnprops.category = 'number'
        } else {
            returnprops.category = 'text'
        } */
    else if (datatype && datatype.value === 'datetime') {
        returnprops.category = 'datetime'
    } else if (datatype && datatype.value === 'http://www.w3.org/2001/XMLSchema#integer') {
        returnprops.category = 'number'
    } else if (isiri.value === '1' || isiri.value === 'true') {
        returnprops.category = 'uri'
    } else {
        returnprops.category = 'ovni'
    }
    if (language && language.value) returnprops.language = language.value
    return {
        ...returnprops,
        property: property.value,
        path,
        level
    }
}

const makeQuery = (entrypoint, config, defaultGraph) => {
    const graph = defaultGraph ? `FROM <${defaultGraph}> ` : ``
    let propList = (config.entrypoint === undefined) ? `` : `?entrypoint `
    let groupList = (config.entrypoint === undefined) ? `` : `?entrypoint `
    let defList = ``
    let orderList = ``
    config.selectedMatch.properties.forEach((prop, index) => {
        index += 1
        propList = propList.concat(`?prop${index} ?labelprop${index} `)
        orderList = orderList.concat(`?prop${index} `)
        if (config.entrypoint === undefined) {
            propList = propList.concat(`(COUNT(?prop${index}) as ?countprop${index}) `)
            orderList = orderList.concat(`?countprop${index} `)
        }
        groupList = groupList.concat(`?prop${index} ?labelprop${index} `)
        defList = defList.concat(FSL2SPARQL(prop.path, `prop${index}`, 'entrypoint', (index === 1)))
    })
    /* console.log(`SELECT DISTINCT ${propList}
    WHERE { ?entrypoint rdf:type ${entrypoint} .
    ${defList}
    } GROUP BY ${groupList}ORDER BY ${orderList}`) */
    return `SELECT DISTINCT ${propList}${graph}
WHERE {
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

exports.defineGroup = defineGroup
exports.getData = getData
exports.FSL2SPARQL = FSL2SPARQL
exports.makeQuery = makeQuery
exports.makePropQuery = makePropQuery
exports.makePropsQuery = makePropsQuery
exports.makeTotalQuery = makeTotalQuery
exports.mergeStatsWithProps = mergeStatsWithProps
exports.usePrefix = usePrefix
