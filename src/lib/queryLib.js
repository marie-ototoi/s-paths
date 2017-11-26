import * as d3 from 'd3'
import moment from 'moment'

const ignoreList = ['']

const getDirectProps = (entitiesClass, constraints) => {
    
}

const getStatsProp = (path) => {
    return `SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(DISTINCT ?entrypoint) AS ?coverage) 
WHERE {
${FSL2SPARQL(path, 'object')} 
}`
}

const makePropsQuery = (entitiesClass, constraints, level) => {
    // this is valid only for first level
    return `SELECT DISTINCT ?property ?datatype ?type ?language WHERE {
        ?subject rdf:type ${entitiesClass} .
        ${constraints} .
        ?subject ?property ?object .
        ?object rdf:type ?type .
        BIND(DATATYPE(?object) AS ?datatype) .
        BIND(LANG(?object) AS ?language) .
    } GROUP BY ?property ?type ?datatype ?language`
    /* for (let index = 1; index <= levels; index ++) {
        let subject
    } */
}

const defineGroup = (prop) => {
    const { path, datatype, type, language } = prop
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
        if (level === levels) query = query.concat(`OPTIONAL { ?${thisObject} rdfs:label  ?label${propName} } . `)
        if (objectType !== '*') {
            query = query.concat(`?${thisObject} rdf:type ${objectType} . `)
        }
    }
    return query
}

exports.getDirectProps = getDirectProps
exports.getStatsProp = getStatsProp
exports.FSL2SPARQL = FSL2SPARQL
exports.makeQuery = makeQuery
