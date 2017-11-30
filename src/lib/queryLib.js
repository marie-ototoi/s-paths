import * as d3 from 'd3'
import moment from 'moment'
import {SparqlClient, SPARQL} from 'sparql-client-2'

const ignoreList = ['']

const makePropQuery = (path, constraints) => {
    return `SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(DISTINCT ?entrypoint) AS ?coverage) 
WHERE {
${FSL2SPARQL(path, 'object')} 
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

const usePrefix = (uri, prefixes) => {
    return uri.replace(uri, (match, offset, string) => {
        for (var pref in prefixes) {
            let splittedUri = match.split(prefixes[pref])
            if (splittedUri.length > 1) return `${pref}:${splittedUri[1]}`
        }
        return match
    })
}

const makePropsQuery = (entitiesClass, constraints, level) => {
    // this is valid only for first level
    return `SELECT DISTINCT ?property ?datatype ?language ?type ?isiri WHERE {
        ?subject rdf:type ${entitiesClass} . ${constraints}
        ?subject ?property ?object .
        OPTIONAL { ?object rdf:type ?type } .
        OPTIONAL { ?property rdfs:label ?propertylabel } .
        BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(LANG(?object) AS ?language) .
    } GROUP BY ?property ?datatype ?language ?type ?isiri`
    /* for (let index = 1; index <= levels; index ++) {
        let subject
    } */
}

const defineGroup = (prop, previousPath, level, prefixes) => {
    const { property, datatype, type, language, isiri } = prop
    const path = `${previousPath}/${usePrefix(property.value, prefixes)}/*`
    let category
    if (datatype === 'datetime') {
        category = 'datetime'
    } else if (ignoreList.includes(property.value)) {
        category = 'ignore'
    } else if (isiri) {
        category = 'uri'
    } else {
        category = 'ignore'
    }
    return {
        ...prop,
        path,
        category
    }
}

const exploreDataSet = (entitiesClass, constraints, options) => {
    const { maxLevels, maxUnique, maxChars } = options
    const directProps = getDirectProps(entitiesClass, constraints)
    return //
}

const makeQuery = (entrypoint, config) => {
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
    return `SELECT DISTINCT ${propList}
WHERE {
${defList}
} GROUP BY ${groupList}ORDER BY ${orderList}`
}

const FSL2SPARQL = (FSLpath, propName = 'prop1', entrypointName = 'entrypoint', entrypointType = true) => {
    let pathParts = FSLpath.split('/')
    let query = (entrypointType) ? `?entrypoint rdf:type ${pathParts[0]} . ` : ``
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
exports.usePrefix = usePrefix
