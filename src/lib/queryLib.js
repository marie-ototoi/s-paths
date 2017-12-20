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

const getPrefix = (uri, prefixes) => {
    /* const prefixes = [
        { prefix: 'dcterms', url: 'http://purl.org/dc/terms/' },
        { prefix: 'd2r', url: 'http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#' },
        { prefix: 'dbpedia', url: 'http://dbpedia.org/resource/' },
        { prefix: 'dbpedia-owl', url: 'http://dbpedia.org/ontology/' },
        { prefix: 'dbpprop', url: 'http://dbpedia.org/property/' },
        { prefix: 'foaf', url: 'http://xmlns.com/foaf/0.1/' },
        { prefix: 'freebase', url: 'http://rdf.freebase.com/ns/' },
        { prefix: 'map', url: 'http://data.nobelprize.org/resource/#' },
        { prefix: 'meta', url: 'http://www4.wiwiss.fu-berlin.de/bizer/d2r-server/metadata#' },
        { prefix: 'nobel', url: 'http://data.nobelprize.org/terms/' },
        { prefix: 'owl', url: 'http://www.w3.org/2002/07/owl#' },
        { prefix: 'rdf', url: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' },
        { prefix: 'rdfs', url: 'http://www.w3.org/2000/01/rdf-schema#' },
        { prefix: 'skos', url: 'http://www.w3.org/2004/02/skos/core#' },
        { prefix: 'viaf', url: 'http://viaf.org/viaf/' },
        { prefix: 'xsd', url: 'http://www.w3.org/2001/XMLSchema#' },
        { prefix: 'yago', url: 'http://yago-knowledge.org/resource/' },
        { prefix: 'bio', url: 'http://vocab.org/bio/0.1/' }, // BnF
        { prefix: 'bibo', url: 'http://purl.org/ontology/bibo/' },
        { prefix: 'dcmi-box', url: 'http://dublincore.org/documents/dcmi-box' },
        { prefix: 'dcmitype', url: 'http://purl.org/dc/dcmitype/' },
        { prefix: 'frbr-rda', url: 'http://rdvocab.info/uri/schema/FRBRentitiesRDA/' },
        { prefix: 'geo', url: 'http://www.w3.org/2003/01/geo/wgs84_pos#' },
        { prefix: 'geonames', url: 'http://www.geonames.org/ontology#' },
        { prefix: 'ign', url: 'http://data.ign.fr/ontology/topo.owl#' },
        { prefix: 'insee', url: 'http://rdf.insee.fr/geo' },
        { prefix: 'isni', url: 'http://isni.org/ontology#' },
        { prefix: 'marcrel', url: 'http://id.loc.gov/vocabulary/relators' },
        { prefix: 'mo', url: 'http://musicontology.com/' },
        { prefix: 'ore', url: 'http://www.openarchives.org/ore/terms/' },
        { prefix: 'rdagroup1elements', url: 'http://rdvocab.info/Elements/' },
        { prefix: 'rdagroup2elements', url: 'http://rdvocab.info/ElementsGr2/' },
        { prefix: 'rdarelationships', url: 'http://rdvocab.info/RDARelationshipsWEMI' },
        { prefix: 'schemaorg', url: 'http://schema.org/' },
        { prefix: 'blt', url: 'http://www.bl.uk/schemas/bibliographic/blterms#' }, // t-mus
        { prefix: 'event', url: 'http://purl.org/NET/c4dm/event.owl#' },
        { prefix: 'frbr', url: 'http://purl.org/vocab/frbr/core#' },
        { prefix: 'sim', url: 'http://purl.org/ontology/similarity/' },
        { prefix: 'slickm', url: 'http://slickmem.data.t-mus.org/' },
        { prefix: 'slickmem', url: 'http://slickmem.data.t-mus.org/terms/' }
    ]
    if (usePrefix(uri, prefixes).length === uri.length) {
        return 
    } else {
        return 
    } */
}

const usesPrefix = (uri) => {
    return uri.match(/:/g) && !uri.match(/\//g)
}

const createPrefix = (uri, length) => {
    return uri.replace(/([\/:#_\-.]|purl|org|http|www)/g, function (match, p1) { 
        if (p1) return ''
    }).toLowerCase().substr(0, length)
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

const defineGroup = (prop, previousPath, level, options) => {
    const { avgcharlength, property, datatype, isiri, isliteral, language } = prop
    const { ignoreList, maxChar, prefixes } = options
    const path = `${previousPath}/${usePrefix(property.value, prefixes)}/*`
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
    config.properties.forEach((prop, index) => {
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

exports.createPrefix = createPrefix
exports.defineGroup = defineGroup
exports.getData = getData
exports.getRoot = getRoot
exports.FSL2SPARQL = FSL2SPARQL
exports.makeQuery = makeQuery
exports.makePropQuery = makePropQuery
exports.makePropsQuery = makePropsQuery
exports.makeTotalQuery = makeTotalQuery
exports.mergeStatsWithProps = mergeStatsWithProps
exports.usePrefix = usePrefix
exports.usesPrefix = usesPrefix
