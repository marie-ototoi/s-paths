// import * as d3 from 'd3'
// import moment from 'moment'
import { SparqlClient } from 'sparql-client-2'
import * as configLib from './configLib'

export const addSmallestPrefix = (url, prefixes) => {
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

export const createPrefix = (uri) => {
    return uri.replace(/([/:#_\-.]|purl|org|data|http|www)/g, (match, p1) => {
        if (p1) return ''
    }).toLowerCase()
}

export const convertPath = (fullPath, prefixes) => {
    const uriRegex = /<[\w\d:.#_\-/]+>?/gi
    return fullPath.replace(uriRegex, (match, p1) => {
        if (match) return usePrefix(match.substr(1, match.length - 2), prefixes)
    })
}

export const defineGroup = (prop, options) => {
    const { property, datatype, isiri, isliteral, language } = prop
    const { ignoreList } = options
    let propName = getPropName(property)
    let type, category, subcategory
    // console.log('oye ', property.value, datatype)
    if (isliteral && (isliteral === '1' || isliteral === 'true')) {
        type = 'literal'
    } else if (isiri === '1' || isiri === 'true') {
        type = 'uri'
    }
    if (ignoreList.includes(property)) {
        category = 'ignore'
    } else if (type === 'uri') {
        if (propName.match(/place|country|city/gi)) {
            category = 'geo'
            subcategory = 'name'
        } else if (propName.match(/depiction|picture/gi)) {
            category = 'image'
        } else {
            category = 'uri'
        }
    } else if ((datatype && datatype === 'http://www.w3.org/2001/XMLSchema#date') ||
        propName.match(/year|date|birthday/gi) ||
        propName.match(/[/#](birth|death|created|modified)$/gi)) {
        category = 'datetime'
    } else if (propName.match(/latitude/gi) ||
        propName.match(/[/#](lat)$/gi)) {
        category = 'geo'
        subcategory = 'latitude'
    } else if (propName.match(/longitude/gi) ||
        propName.match(/[/#](long)$/gi)) {
        category = 'geo'
        subcategory = 'longitude'
    }  else if (datatype && datatype === 'http://www.w3.org/2001/XMLSchema#integer') {
        category = 'number'
    } else {
        category = 'text'
    }
    return {
        ...prop,
        category,
        subcategory,
        type,
        language
    }
}

export const FSL2SPARQL = (FSLpath, options) => {
    let { constraints, entrypointName, entrypointType, graphs, hierarchical, optional, propName, resourceGraph, sample } = options
    let pathParts = FSLpath.split('/')
    let query = ``
    if (entrypointType) {
        const graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
        // const graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
        let entryDef = sample ? `{ SELECT ?${entrypointName} ${graph}WHERE { ?${entrypointName} rdf:type ${pathParts[0]} . ${constraints || ``}} LIMIT ${sample} } . ` : `?${entrypointName} rdf:type ${pathParts[0]} . `
        query = query.concat(entryDef)
    }
    let levels = Math.floor(pathParts.length / 2)
    let prevSubjects = []
    for (let index = 1; index < pathParts.length; index += 2) {
        let predicate = pathParts[index]
        let objectType = pathParts[index + 1]
        let level = Math.ceil(index / 2)
        let thisSubject = (level === 1) ? entrypointName : `${propName}inter${(level - 1)}`
        let thisObject = (level === levels) ? propName : `${propName}inter${level}`
        query = query.concat(`?${thisSubject} ${predicate} ?${thisObject} . `)
        // if (level === levels) query = query.concat(`${!optional ? 'OPTIONAL { ' : ''}?${thisObject} rdfs:label ?label${propName}${!optional ? ' } .' : ''} `)
        if (objectType !== '*') {
            query = query.concat(`?${thisObject} rdf:type ${objectType} . `)
        }
        prevSubjects.push(thisSubject)
        query = query.concat(`FILTER (`)
        for (let j = prevSubjects.length; j > 0; j--) {
            query = query.concat(`?${thisObject} != ?${prevSubjects[(j-1)]}`)
            if (j !== 1) query = query.concat(` && `)
        }
        query = query.concat(`) . `)
        
    }
    let queryHierarchical = ''
    if (hierarchical) {
        const prevPropName = (hierarchical !== 'last' && levels > 1) ? `${propName}inter${levels - 1}` : propName
        const newPropName = (hierarchical !== 'last' && levels > 1) ? `${propName}bisinter${levels - 1}` : `${propName}bis`
        queryHierarchical = query.replace(new RegExp(`[?]{1}${propName}`, 'gi'), `$&bis`)
        queryHierarchical = `?${prevPropName} ?directlink ?${newPropName} . ` + queryHierarchical
        // queryHierarchical = queryHierarchical.replace(/OPTIONAL {.*} \. /, '')
        // queryHierarchical = queryHierarchical.replace(prevPropName, newPropName)
        queryHierarchical = `OPTIONAL { ${queryHierarchical} }`
    }
    return `${optional ? 'OPTIONAL { ' : ''}${query}${queryHierarchical}${optional ? '} . ' : ''}`
}

export const getData = (endpoint, query, prefixes) => {
    console.log(query)
    const client = new SparqlClient(endpoint, {
        requestDefaults: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/sparql-results+json,application/json'
            }
        }
    })
        .registerCommon('rdf', 'rdfs')
        .register(prefixes)
    return client
        .query(query)
        .execute()
}

const getPropName = (uri) => {
    const root = getRoot(uri)
    return uri.replace(root, '')
}

export const getSplitUri = (uri) => {
    const root = getRoot(uri)
    return { root, name: uri.replace(root, '') }
}

export const getRoot = (uri) => {
    if (uri.slice(-1) === '/') uri = uri.slice(0, uri.length - 1)
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

export const ignorePromise = (promise) => {
    return promise.catch(e => {
        // console.error(e)
        return undefined
    })
}

export const makePath = (prop, previousProp, level, options) => {
    const { property } = prop
    const { prefixes } = options
    const fullPath = `${previousProp.fullPath}/<${property.value}>/*`
    const path = convertPath(fullPath, prefixes)
    return {
        entrypoint: previousProp.entrypoint,
        endpoint: options.endpoint,
        property: property.value,
        fullPath,
        path,
        level
    }
}

export const makePropQuery = (prop, options, queryType) => {
    // queryType: count, type, char
    const { constraints, graphs, resourceGraph } = options
    const { path } = prop
    // const graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    const graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    let props
    let bindProps
    let propsPath
    let limit = ``
    if (queryType === 'type') {
        props = `DISTINCT ?datatype ?language ?isiri ?isliteral ((?charlength) as ?avgcharlength) `
        bindProps = `BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(ISLITERAL(?object) AS ?isliteral) .
        BIND(LANG(?object) AS ?language) .
        BIND(STRLEN(xsd:string(?object)) AS ?charlength) .`
        propsPath = FSL2SPARQL(path, {
            propName: 'object',
            entrypointName: 'entrypoint',
            entrypointType: true,
            resourceGraph,
            graphs
        })
        limit = ` LIMIT 1`
    } else if (queryType === 'count') {
        props = `(COUNT(DISTINCT ?object) AS ?unique) (COUNT(?object) AS ?total) (COUNT(DISTINCT ?entrypoint) AS ?coverage) `
        bindProps = ``
        propsPath = FSL2SPARQL(path, {
            propName: 'object',
            entrypointName: 'entrypoint',
            entrypointType: true,
            resourceGraph,
            graphs
        })
    } else if (queryType === 'dateformat') {
        props = `DISTINCT ?object `
        bindProps = ``
        propsPath = FSL2SPARQL(path, {
            propName: 'object',
            entrypointName: 'entrypoint',
            entrypointType: true,
            resourceGraph,
            graphs
        })
        limit = ` LIMIT 30`
    }
    return `SELECT ${props}${graph}
WHERE {
${constraints}
${propsPath}
${bindProps}
}${limit}`
}

export const makePropsQuery = (entitiesClass, options, level) => {
    // this is valid only for first level
    const { constraints, graphs, resourceGraph } = options
    const pathQuery = FSL2SPARQL(entitiesClass, {
        propName: 'interobject',
        entrypointName: 'subject',
        entrypointType: true,
        // sample: 100,
        graphs,
        resourceGraph,
        constraints
    })
    // const graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    const graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    const subject = (level === 1) ? '?subject' : '?interobject'
    return `SELECT DISTINCT ?property ${graph}WHERE {
        ${pathQuery}${constraints}
        ${subject} ?property ?object .
    } GROUP BY ?property`
    /* for (let index = 1; index <= levels; index ++) {
        let subject
    } */
}

export const makeKeywordConstraints = (keyword, options) => {
    let { maxLevel } = options
    let start = `?value1`
    let def = ``
    let filter = ``
    for (let i = 2; i <= maxLevel; i++) {
        def = def.concat(`
        ${start} ?level${i} ?value${i} . `)
        filter = filter.concat(`regex(?value${i}, '${keyword}', 'i')`)
        if (i < maxLevel)  filter = filter.concat(` || `)
        start = `?value${i}`
    }
    let constraint = `?entrypoint ?level1 ?value1 . 
    OPTIONAL {${def}
    }
    FILTER (regex(?value1, '${keyword}', 'i') || ${filter}) . `
    return constraint
}

export const makeSelectionConstraints = (selections, selectedConfig, zone, dataset) => {
    const { resourceGraph, graphs } = dataset
    const uriSelections = selections.filter(sel => sel.query.type === 'uri' && sel.zone === zone)
    const uriRegex = uriSelections.map(sel => sel.query.value + '$').join('|')
    // add constraints for constrained groups of entities (heatmap)
    const setSelection = selections.filter(sel => sel.query.type === 'set' && sel.zone === zone)
    let paths = ''
    const setConstraints = setSelection.map((sel, iS) => {
        return '(' + sel.query.value.map((constraint, iC) => {
            const propName = 'contraint' + constraint.propName
            // console.log(constraint.category, constraint.subcategory)
            if (iS === 0) {
                paths += FSL2SPARQL(selectedConfig.properties[iC].path, {
                    propName,
                    entrypointName: 'entrypoint',
                    entrypointType: true,
                    resourceGraph,
                    graphs
                })
            }
            if (constraint.category === 'datetime') {
    
                const conditions = constraint.value.map((r, iR) => {
                    let theDate = new Date(r, (iR === 0) ? 0 : 11, (iR === 0) ? 1 : 31)
                    if (String(r).match(/\d{4}/)) {
                        return `xsd:integer(?${propName}) ${(iR === 0) ? '>=' : '<='} xsd:integer('${theDate.getFullYear()}')`
                    } else { 
                        return `xsd:date(?${propName}) ${(iR === 0) ? '>=' : '<='} xsd:date('${theDate.getFullYear()}-${theDate.getUTCMonth() + 1}-${theDate.getUTCDate()}')`
                    }                    
                }).join(' && ')
                return `(${conditions})`
            } else if (constraint.category === 'text' || constraint.category === 'uri' || (constraint.category === 'geo' && constraint.subcategory === 'name')) {
                return ` regex(?${propName}, '^${constraint.value.replace(`'`, `\\'`)}$', 'i')`
            }
        }).join(' && ') + ')'
    }).join(' || ')
    let totalQuery = ''
    if (uriRegex !== '') totalQuery += `FILTER regex(?entrypoint, '^${uriRegex}$', 'i') .`
    if (setConstraints !== '') totalQuery += `${paths} FILTER (${setConstraints}) . `
    // console.log(totalQuery)
    return totalQuery
}

// to do : take constraints into account
export const makeQuery = (entrypoint, configZone, zone, options) => {
    const { graphs, constraints, maxDepth, prop1only, resourceGraph, unique } = options
    // console.log(configZone)
    let defList = ``
    let groupList = unique ?  `` : `GROUP BY `
    let propList = ``
    let orderList = unique ? `` : `ORDER BY `
    // let graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    let graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    if (maxDepth) {
        propList = `DISTINCT ?entrypoint ?path1 ?prop1 ?level `
        if (!unique) groupList = groupList.concat(`?prop1 `)
        defList = `?entrypoint rdf:type <${entrypoint}> .
        OPTIONAL { ?entrypoint ?path1 ?prop1 .
        FILTER (?prop1 != ?entrypoint) .`
        for (let i = 1; i < maxDepth; i ++ ) {
            defList = defList.concat(`?prop${i} ?path${(i + 1)} ?prop${(i + 1)} . `)        
            defList = defList.concat(`FILTER (`)
            for (let j = i; j >= 1; j--) {
                defList = defList.concat(`?prop${(i + 1)} != ?prop${j}`)
                if (j !== 1) defList = defList.concat(` && `)
            }
            defList = defList.concat(`) . `)
            propList = propList.concat(`?path${(i + 1)} ?prop${(i + 1)} `)
            if (!unique) groupList = groupList.concat(`?path${(i + 1)} ?prop${(i + 1)} `)
            
        }
        orderList = orderList.concat(`?prop${maxDepth} `)
        defList = defList.concat(`BIND (${maxDepth} as ?level) . `)
        defList = defList.concat(`}`)
    } else {
        let selectedConfig = configLib.getSelectedMatch(configZone)
        // console.log(selectedConfig)
    
        let properties = selectedConfig.properties
        if (prop1only === true) properties = [properties[0]]
        propList = (configZone.entrypoint === undefined || unique) ? `DISTINCT ` : `DISTINCT ?entrypoint `
        if (unique) propList = propList.concat(`(COUNT(DISTINCT ?entrypoint) AS ?displayed) `)
        if (configZone.entrypoint !== undefined && !unique) groupList = groupList.concat(`?entrypoint `)
        properties.forEach((prop, index) => {
            index += 1
            let hierarchical = false
            if (!configZone.allProperties && index === 1 && configZone.constraints[index - 1][0].hierarchical === true) {
                // deactivate retrieval of hierarchy between concepts
                // hierarchical = prop.category === 'text' ? 'previous' : 'last'
            }
            if (!unique) {
                propList = propList.concat(`?prop${index} `)
                if (hierarchical) propList = propList.concat(`?directlink `)
                orderList = orderList.concat(`?prop${index} `)
                if (configZone.entrypoint === undefined) {
                    propList = propList.concat(`(COUNT(?prop${index}) as ?countprop${index}) `)
                    orderList = orderList.concat(`?countprop${index} `)
                }
                groupList = groupList.concat(`?prop${index} `)
            }
            if (hierarchical) groupList = groupList.concat(`?directlink `)
            const optional = !configZone.allProperties && (configZone.constraints[index - 1] && configZone.constraints[index - 1][0].optional)
            defList = defList.concat(FSL2SPARQL(prop.path, {
                propName: `prop${index}`,
                entrypointName: 'entrypoint',
                entrypointType: (index === 1),
                optional,
                resourceGraph,
                graphs,
                hierarchical
            }))
        })
    }
    /* let request = `SELECT DISTINCT ${propList}${graph}
    WHERE {
    ${constraints}
    ${defList}
    } ${groupList} ${orderList}` */
    return `SELECT ${propList}${graph}
WHERE {
${constraints}
${defList}
} ${groupList} ${orderList}`
}

export const makeQueryResources = (options) => {
    const { graphs } = options
    const graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    return `SELECT DISTINCT ?type (COUNT(?type) as ?occurrences) ${graph}
    WHERE {
      ?s rdf:type ?type
    }
    ORDER BY DESC(?occurrences)`
}

export const makeSubGraphQuery = (options, level) => {
    const { constraints, entrypoint, graphs, resourceGraph } = options
    const graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    let ins = level === 1 ? `?entrypoint ?prop1 ?value1 . ?entrypoint rdf:type <${entrypoint}> .` : ``
    let defs = ``
    for (let i = 1; i < level; i++ ) {
        if (i === level-1) ins = ins.concat(`?value${i} ?prop${(i+1)} ?value${(i+1)} . `)
        defs = defs.concat(`?value${i} ?prop${(i+1)} ?value${(i+1)} . `)
    }
    return `INSERT { 
        GRAPH <${resourceGraph}> {
            ${ins}
        }
      }
      ${graph}
      WHERE { 
        ?entrypoint ?prop1 ?value1 .
        ?entrypoint rdf:type <${entrypoint}> .
        ${constraints}
        ${defs}
    }`
}


export const makeTotalQuery = (entitiesClass, options) => {
    let { constraints, graphs, resourceGraph } = options
    // const graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    const graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    return `SELECT (COUNT(DISTINCT ?entrypoint) AS ?total) ${graph}
WHERE {
?entrypoint rdf:type ${entitiesClass} . ${constraints}
}`
}

export const makeTransitionQuery = (newConfig, newOptions, config, options, zone) => {
    // let newConstraints = newOptions.constraints
    // newConstraints = newConstraints.replace('?', '?new')
    const { graphs, resourceGraph, constraints } = options
    const graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    // const graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    
    let propList = (config.entrypoint !== undefined || newConfig.entrypoint !== undefined) ? `?entrypoint ` : ``
    let groupList = (config.entrypoint !== undefined || newConfig.entrypoint !== undefined) ? `?entrypoint ` : ``
    let defList = ``
    let orderList = ``
    if (!config.allProperties) {
        let selectedConfig = configLib.getSelectedMatch(config, zone)
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
                defList = defList.concat(FSL2SPARQL(prop.path, {
                    propName: `prop${index}`,
                    entrypointName: 'entrypoint',
                    entrypointType: (index === 1),
                    optional,
                    resourceGraph,
                    graphs
                }))
            }
        })
    }
    //
    let newdefList = ``
    
    propList.concat((newConfig.entrypoint && !config.entrypoint) ? `?entrypoint ` : ``)
    groupList.concat((newConfig.entrypoint && !config.entrypoint) ? `?entrypoint ` : ``)
    if(!newConfig.allProperties) {
        let newSelectedConfig = configLib.getSelectedMatch(newConfig, zone)
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
                newdefList = newdefList.concat(FSL2SPARQL(prop.path, {
                    propName: `newprop${index}`,
                    entrypointName: 'entrypoint',
                    entrypointType: (index === 1),
                    optional: false,
                    resourceGraph,
                    graphs
                }))
            }
        })
    }
    return `SELECT DISTINCT ${propList}${graph}
    WHERE {
        ${constraints}
        ${(constraints !== newOptions.constraints) ? newOptions.constraints : ''}
        ${defList}
        OPTIONAL {
            ${newdefList}
        }
    } 
    GROUP BY ${groupList}
    ORDER BY ${orderList}`
}

export const mergeStatsWithProps = (props, countStats, typeStats, totalEntities) => {
    return props.map((prop, index) => {
        if (countStats[index] && countStats[index].results.bindings[0]) {
            let countStat = countStats[index].results.bindings[0]
            let typeStat = typeStats[index] ? typeStats[index].results.bindings[0] : null
            let countProps = {
                total: Number(countStat.total.value),
                unique: Number(countStat.unique.value),
                coverage: Number(countStat.coverage.value) * 100 / totalEntities
            }
            let typeProps = (typeStat) ? {
                datatype: typeStat.datatype ? typeStat.datatype.value : ``,
                language: typeStat.language ? typeStat.language.value : ``,
                isiri: typeStat.isiri.value,
                isliteral: typeStat.isliteral.value,
                avgcharlength: Math.floor(Number(typeStat.avgcharlength.value))
            } : {}
            return {
                ...prop,
                ...countProps,
                ...typeProps
            }
        } else {
            return prop
        }
    })
}

export const prefixDefined = (uri, prefixes) => {
    let root = getRoot(uri)
    let rootList = []
    for (let pref in prefixes) {
        rootList.push(prefixes[pref])
    }
    return rootList.includes(root)
}

export const useFullUri = (path, prefixes) => {
    return path.replace(path, (match, offset, string) => {
        for (let pref in prefixes) {
            let splittedUri = match.split(pref + ':')
            if (splittedUri.length > 1) return `${prefixes[pref]}${splittedUri[1]}`
        }
        return match
    })
}

export const usePrefix = (uri, prefixes) => {
    return uri.replace(uri, (match, offset, string) => {
        for (let pref in prefixes) {
            let splittedUri = match.split(prefixes[pref])
            if (splittedUri.length > 1) return `${pref}:${splittedUri[1]}`
        }
        return match
    })
}

export const usesPrefix = (uri, prefixes) => {
    const parts = uri.split(':')
    return uri.match(/:/g) && !uri.match(/\//g) && prefixes[parts[0]] !== undefined
}
