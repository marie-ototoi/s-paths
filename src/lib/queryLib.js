// import * as d3 from 'd3'
// import moment from 'moment'
import { SparqlClient } from 'sparql-client-2'
import fetch from 'node-fetch'
import * as configLib from './configLib'
import { convertDate } from './dataLib'

export const addPrefix = (url, prefixes, prefixcc) => {
    //let find
    const root = getRoot(url)
    let prefix
    if (prefixcc) {
        return fetch((`https://prefix.cc/reverse?uri=${root}&format=ini`),
            {
                method: 'GET'
            })
            .then(res => res.text())
            .then(res => {
                // if no results
                if (res.substr(0, 5) === '<?xml') {
                    prefix = getSmallestPrefix(root, prefixes)
                } else {
                    prefix = res.split('=')[0]
                }
                prefixes[prefix] = root
                return prefixes
            })
            .catch(err => {
                prefix = getSmallestPrefix(root, prefixes)
                prefixes[prefix] = root
                return prefixes
            })
    } else {
        prefix = getSmallestPrefix(root, prefixes)
        prefixes[prefix] = root
        return prefixes
    }
}

export const getSmallestPrefix = (root, prefixes) => {

    const flatRoot = createPrefix(root)
    const checkRoot = (len) => {
        let newPref = flatRoot.substr(0, len)
        if (prefixes[newPref]) {
            return checkRoot(len + 1)
        } else {
            return newPref
        }
    }
    return checkRoot(5)
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
        if (propName.match(/depiction|picture/gi)) {
            category = 'image'
        } else {
            category = 'uri'
        }
    } else if ((datatype && datatype === 'http://www.w3.org/2001/XMLSchema#date') ||
        propName.match(/year/gi)) {
        //||
        //propName.match(/(birth|death|created|modified)$/gi)) 
        category = 'datetime'
    } else if (propName.match(/latitude/gi) ||
        propName.match(/(lat|latd)$/gi)) {
        category = 'geo'
        subcategory = 'latitude'
    } else if (propName.match(/longitude/gi) ||
        propName.match(/(long|longd)$/gi)) {
        category = 'geo'
        subcategory = 'longitude'
    }  else if (datatype && datatype === 'http://www.w3.org/2001/XMLSchema#integer') {
        category = 'number'
    } else {
        category = 'text'
    }
    console.log(property, category, subcategory)
    return {
        ...prop,
        category,
        subcategory,
        type,
        language
    }
}

export const FSL2SPARQL = (FSLpath, options) => {
    let { aggregate, category, coeff, constraints, entrypointName, entrypointType, graphs, hierarchical, optional, propName, resourceGraph, sample, whichGraph } = options
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
        let thisObject = (level === levels) ? (aggregate ? `bind${propName}` : propName) : `${propName}inter${level}`
        query = whichGraph ? query.concat(`GRAPH ?g${level} { ?${thisSubject} ${predicate} ?${thisObject} . } `) : query.concat(`?${thisSubject} ${predicate} ?${thisObject} . `)
        // if (level === levels) query = query.concat(`${!optional ? 'OPTIONAL { ' : ''}?${thisObject} rdfs:label ?label${propName}${!optional ? ' } .' : ''} `)
        
        if (objectType === '?') {
            query = query.concat(`?${thisObject} rdf:type ?type${thisObject} . `)
        } else if (objectType !== '*') {
            query = query.concat(`?${thisObject} rdf:type ${objectType} . `)
        }
        prevSubjects.push(thisSubject)
        query = query.concat(`FILTER (`)
        for (let j = prevSubjects.length; j > 0; j--) {
            query = query.concat(`?${thisObject} != ?${prevSubjects[(j-1)]}`)
            if (j !== 1) query = query.concat(` && `)
        }
        query = query.concat(`) . `)
        if (aggregate && level === levels) {
            if (category === 'number') {
                query = query.concat(`BIND(FLOOR(?bind${propName}/${coeff})*${coeff} as ?${propName}) . `)
            }
        }
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
    //console.log('ici getData', endpoint, prefixes ,query)
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

export const getPropName = (uri) => {
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

export const makeCheckPivotQuery = (properties, dataset) => {
    const { graphs, resourceGraph } = dataset
    let defList = `?entrypoint rdf:type ?typeentrypoint . `
    let groupList = `GROUP BY ?typeentrypoint `
    let propList = `?typeentrypoint `
    let orderList = `ORDER BY ?typeentrypoint `
    // let graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    let graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    properties.forEach((prop, index) => {
        let pathParts = prop.path.split('/')
        if(pathParts.length > 3) {
            for (let i = 1; i < pathParts.length - 2; i += 2) {
                let level = Math.ceil(i / 2)
                propList = propList.concat(`?typeprop${(index+1)}inter${level} `)
            }
        }
    })
    properties.forEach((prop, index) => {
        index += 1
        defList = defList.concat(FSL2SPARQL(prop.path, {
            propName: `prop${index}`,
            entrypointName: 'entrypoint',
            entrypointType: (index === 1),
            optional: false,
            resourceGraph,
            graphs,
            hierarchical: false
        }))
    })
    return `SELECT ${propList}${graph}
WHERE {
${defList}
} ${groupList}${orderList}LIMIT 100`
}

export const makePropQuery = (prop, options, queryType) => {
    // queryType: count, type, char
    const { constraints, graphs, resourceGraph } = options
    const { path, level } = prop
    // const graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    let graph = ''
    if (queryType !== 'type') {
        graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    }
    let props
    let bindProps
    let propsPath
    let filterGraphs = ''
    let limit = ``
    if (queryType === 'type') {
        props = `DISTINCT ?datatype ?language ?isiri ?isliteral ((?charlength) as ?avgcharlength) `
        for (let i = 1; i <= level; i++) {
            props = props.concat(`?g${i} `)
        }
        bindProps = `BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(ISLITERAL(?object) AS ?isliteral) .
        BIND(LANG(?object) AS ?language) .
        BIND(STRLEN(xsd:string(?object)) AS ?charlength) .`
        propsPath = FSL2SPARQL(path, {
            propName: 'object',
            entrypointName: 'entrypoint',
            entrypointType: true,
            graphs,
            whichGraph: true
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
${filterGraphs}
}${limit}`
}

export const makePropsQuery = (initialPath, options, level, prefixes) => {
    // this is valid only for first level
    const { constraints, graphs, resourceGraph } = options
    const pathQuery = FSL2SPARQL(initialPath, {
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
    let pathsParts = initialPath.split('/')
    let countAllResources = Math.floor(pathsParts.length / 3)
    let filter = `FILTER (${subject} != ?object) . `
    if (countAllResources >= 1) {
        for (let i = 1; i <= countAllResources; i++) {
            let prop = useFullUri(pathsParts[(i * 2)-1], prefixes)
            let inter = (countAllResources === 1) ? `interobject` : `interobjectinter${i}`
            filter = filter.concat(`FILTER (?${inter} != ?object && ?property != <${prop}>) . `)
        }
    }
    return `SELECT DISTINCT ?property ${graph}WHERE {
        ${pathQuery}${constraints}
        ${subject} ?property ?object .
        ${filter}
    } GROUP BY ?property`
    /* for (let index = 1; index <= levels; index ++) {
        let subject
    } */
}

export const hasMoreSpecificPath = (path, level, pathList) => {
    return pathList.find(comparePath => {
        // console.log(comparePath.path, path, comparePath.path.indexOf(path))
        return comparePath.level > level && comparePath.path.indexOf(path) === 0
    }) !== undefined
}

export const makeKeywordConstraints = (keywords, options) => {
    let maxLevel = 3
    let start = `?value1`
    let def = ``
    for (let i = 2; i <= maxLevel; i++) {
        def = def.concat(`
        ${start} ?level${i} ?value${i} . `)
        start = `?value${i}`
    }
    let filter = keywords.map(keyword => {
        let fk = '('
        for (let i = 1; i <= maxLevel; i++) {
            fk += `(isLiteral(?value${i}) && regex(?value${i}, '${keyword}', 'i'))`
            if (i < maxLevel) fk += ` || `
        }
        fk += ')'
        return fk
    })
    let constraint = `?entrypoint ?level1 ?value1 . 
    OPTIONAL {${def}
    }
    FILTER (${filter}) . `
    // console.log(constraint)
    return constraint
}

export const makeSelectionConstraints = (selectionsLayers, selectedConfig, zone, dataset, pivot) => {
    const { resourceGraph, graphs } = dataset
    let paths = ''
    let bind = ''
    let keywords = []
    let uriRegex = ''
    let mainentrypointName
    // console.log(selectionsLayers)
    const setConstraints = selectionsLayers.map((selections, si) => {
        let keywordSelections = selections.filter(sel => sel.query.type === 'keyword')
        if (keywordSelections.length > 0) {
            keywords.push(keywordSelections[0].query.value)
        }

        let uriSelections = selections.filter(sel => sel.query.type === 'uri' && sel.zone === zone)
        let entrypointName = pivot ? 'formerentrypoint' : 'entrypoint'
        
        if (uriSelections.length > 0) {
            uriRegex = uriSelections.map(sel => sel.query.value.replace(/\?/g, '.') + '$').join('|')
            mainentrypointName = entrypointName
        }
        // add constraints for constrained groups of entities (heatmap)
        let setSelection = selections.filter(sel => sel.query.type === 'set' && sel.zone === zone)
        // let def = ''
        // console.log('SALUT', setSelection, zone)
        // console.log('ici ?', selectedConfig, selections)
        
        return setSelection.map((sel, iS) => {
            // console.log('ici ?')
            selectedConfig = sel.config.selectedMatch
            return '(' + sel.query.value.map((constraint, iC) => {
                const propName = 'set_' + si + '_contraint' + constraint.propName
                // console.log(constraint.category, constraint.subcategory, selectedConfig.properties, iC)
                if ((si === 0 && iS === 0) || si > 0) {
                    paths += FSL2SPARQL(selectedConfig.properties[iC].path, {
                        propName,
                        entrypointName,
                        entrypointType: entrypointName !== 'entrypoint',
                        resourceGraph,
                        graphs
                    })
                }
                if (constraint.category === 'datetime') {
                    // console.log(constraint)
                    let datePropName = 'date' + propName
                    if (iS === 0 && constraint.format === 'yearstring') {
                        bind += `BIND (xsd:integer(?${propName}) as ?${datePropName}) . `
                    } else if (iS === 0) {
                        bind += `BIND (xsd:date(?${propName}) as ?${datePropName}) . `
                    }
                    // console.log(constraint, iC, iS)
                    const conditions = constraint.value.map((r, iR) => {
                        // console.log(String(r).match(/(\d{4})$/), String(r).match(/(\d{4})[-/.](\d{2})[-/.](\d{2})$/), String(r).match(/(\d{2})[-/.](\d{2})[-/.](\d{4})$/))
                        let theDate
                        if (constraint.format === 'yearstring') {
                            return `?${datePropName} ${(iR === 0) ? '>=' : '<='} '${Number(r)}'^^xsd:integer`
                        } else {
                            if (iR === 0) {
                                theDate = convertDate(r)
                            } else {
                                theDate = convertDate(r, { month: 11, day: 31 })
                            }
                            let month = (theDate.getMonth() + 1) <10 ? '0' +  (theDate.getMonth() + 1) : (theDate.getMonth() + 1)
                            let day = theDate.getDate() <10 ? '0' +  theDate.getDate() : theDate.getDate()
                            // console.log(`?${datePropName} ${(iR === 0) ? '>=' : '<='} '${theDate.getFullYear()}-${theDate.getUTCMonth() + 1}-${theDate.getUTCDate()}'^^xsd:date`)
                            return `?${datePropName} ${(iR === 0) ? '>=' : '<='} '${theDate.getFullYear()}-${month}-${day}'^^xsd:date`
                        }                    
                    }).join(' && ')
                    return `(${conditions})`
                } else if (constraint.category === 'geo' ) {
                    const conditions = constraint.value.map((r, iR) => {
                        return `?${propName} ${(iR === 0) ? '>=' : '<='} ${r}`                   
                    }).join(' && ')
                    return `(${conditions})`
                } else if (constraint.category === 'text' || constraint.category === 'uri' || (constraint.category === 'geo' && constraint.subcategory === 'name')) {
                    return ` regex(?${propName}, '^${constraint.value.replace(`'`, `\\'`)}$', 'i')`
                }
            }).join(' && ') + ')'
        }).join(' || ')
    }).filter(s => s !== '').join(') && (')
    let totalQuery = ''

    if (setConstraints !== '') totalQuery += `${paths} ${bind}FILTER ((${setConstraints})) . `
    if (uriRegex !== '') totalQuery += `FILTER regex(?${mainentrypointName}, '^${uriRegex}$', 'i') . `
    if (keywords.length > 0) totalQuery +=  makeKeywordConstraints(keywords)
    //console.log(']]]]]]', totalQuery)
    return totalQuery
}

export const makeDetailQuery = (entrypoint, configZone, zone, options) => {
    const { graphs, constraints, resourceGraph } = options
    // console.log(configZone)
    let defList = ``
    let groupList = `GROUP BY `
    let propList = `DISTINCT ?entrypoint `
    let orderList = `ORDER BY `
    // let graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    let graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    let selectedConfig = configLib.getSelectedMatch(configZone)    
    
    selectedConfig.properties.forEach((prop, index) => {
        let pathParts = prop.path.split('/')
        if(pathParts.length > 3) {
            for (let i = 1; i < pathParts.length - 2; i += 2) {
                let level = Math.ceil(i / 2)
                propList = propList.concat(`?prop${(index+1)}inter${level} `)
            }
        }
    })
    selectedConfig.properties.forEach((prop, index) => {
        index += 1
        propList = propList.concat(`?prop${index} `)
        orderList = orderList.concat(`?prop${index} `)
        groupList = groupList.concat(`?prop${index} `)
        defList = defList.concat(FSL2SPARQL(prop.path, {
            propName: `prop${index}`,
            entrypointName: 'entrypoint',
            entrypointType: (index === 1),
            optional: false,
            resourceGraph,
            graphs,
            hierarchical: false
        }))
    })
    return `SELECT ${propList}${graph}
WHERE {
${constraints}
${defList}
} ${groupList} ${orderList}LIMIT 5`
}
export const makePivotConstraints = (entrypointName, entrypoint, configZone, options) => {
    let { graphs, resourceGraph } = options
    entrypoint, configZone
    let selectedConfig = configLib.getSelectedMatch(configZone)    
    let properties = selectedConfig.properties 
    let defList = ``
    properties.forEach((prop, index) => {
        index += 1
        defList = defList.concat(FSL2SPARQL(prop.path, {
            propName: `formerprop${index}`,
            entrypointName,
            entrypointType: (index === 1),
            optional: false,
            resourceGraph,
            graphs,
            hierarchical: false
        }))
    })
    return defList + ' '
}
// to do : take constraints into account
export const makeQuery = (entrypoint, configZone, zone, options) => {
    let { graphs, constraints, maxDepth, maxLevel, prop1only, resourceGraph, singleURI, unique } = options
    // console.log(configZone)
    let defList = ``
    let groupList = unique ?  `` : `GROUP BY `
    let propList = ``
    let orderList = unique ? `` : `ORDER BY `
    // let graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    let graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    if (maxDepth) {
        //FILTER regex(?entrypoint, '^http://data.nobelprize.org/resource/laureateaward/22$$', 'i') .
        propList = `DISTINCT ?entrypoint ?path1 ?prop1 `
        defList = `<${singleURI}> ?path1 ?prop1 . `
        orderList = orderList.concat(`?path1 ?prop$1 `)
        groupList = groupList.concat(`?path1 ?prop$1 `)
        for (let i = 1; i < maxDepth; i ++ ) {
            defList = defList.concat(`?prop${i} ?path${(i + 1)} ?prop${(i + 1)} . `)
            defList = defList.concat(`FILTER (?path${(i + 1)} != <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> && `)
            for (let j = i; j >= 1; j--) {
                defList = defList.concat(`?prop${(i + 1)} != ?prop${j}`)
                if (j !== 1) defList = defList.concat(` && `)
            }
            defList = defList.concat(`) . `)
            propList = propList.concat(`?path${(i + 1)} ?prop${(i + 1)} `)
            groupList = groupList.concat(`?path${(i + 1)} ?prop${(i + 1)} `)
            orderList = orderList.concat(`?path${(i + 1)} ?prop${(i + 1)} `)
        }
        constraints = ''
        defList = defList.concat(`BIND (<${singleURI}> as ?entrypoint)`)
    } else {
        let selectedConfig = configLib.getSelectedMatch(configZone)    
        let properties = !configZone.allProperties ? selectedConfig.properties : []
        if (prop1only === true) properties = [properties[0]]
        propList = (configZone.entrypoint.aggregate || unique) ? `DISTINCT ` : `DISTINCT ?entrypoint `
        if (unique) propList = propList.concat(`(COUNT(DISTINCT ?entrypoint) AS ?displayed) `)
        if (!configZone.entrypoint.aggregate && !unique) groupList = groupList.concat(`?entrypoint `)
        properties.forEach((prop, index) => {
            index += 1
            let hierarchical = false
            if (!configZone.allProperties && index === 1 && configZone.constraints[index - 1][0].hierarchical === true) {
                // deactivate retrieval of hierarchy between concepts
                // hierarchical = prop.category === 'text' ? 'previous' : 'last'
            }
            if (!unique) {
                // if geo, we want a max of 1000 results
                // BIND( FLOOR(YEAR(?born)/100)*100 AS ?century ) 

                // if date we want a year
                propList = propList.concat(`?prop${index} `)
                if (hierarchical) propList = propList.concat(`?directlink `)
                orderList = orderList.concat(`?prop${index} `)
                if (configZone.entrypoint.aggregate) {
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
    /*console.log(`SELECT DISTINCT ${propList}${graph}
    WHERE {
    ${constraints}
    ${defList}
    } ${groupList} ${orderList}`)*/
    return `SELECT ${propList}${graph}
WHERE {
${constraints}
${defList}
} ${groupList} ${orderList}`
}
export const makeMultipleQuery = (entrypoint, path, index, zone, options) => {
    const { graphs, constraints, resourceGraph } = options
    let graph = resourceGraph ? `FROM <${resourceGraph}> ` : graphs.map(gr => `FROM <${gr}> `).join('')
    
    let defList = FSL2SPARQL(path, {
        propName: `multiple${index}`,
        entrypointName: 'entrypoint',
        resourceGraph,
        graphs
    })
    return `SELECT DISTINCT ?entrypoint ?multiple${index} ${graph}
WHERE {
    ${constraints}
    ?entrypoint rdf:type <${entrypoint}> .
    ${defList}
}`
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

export const makeTransitionQuery = (newConfig, newOptions, config, options, zone, pivot) => {
    // let newConstraints = newOptions.constraints
    // newConstraints = newConstraints.replace('?', '?new')
    const { graphs, resourceGraph, constraints } = options
    //const graph = `FROM <${resourceGraph}> FROM <${newOptions.resourceGraph}>`
    const graph = graphs ? graphs.map(gr => `FROM <${gr}> `).join('') : ``
    
    let propList = (!config.entrypoint.aggregate || !newConfig.entrypoint.aggregate) ? `?entrypoint ` : ``
    let groupList = (!config.entrypoint.aggregate || !newConfig.entrypoint.aggregate) ? `?entrypoint ` : ``
    let defList = ``
    let orderList = ``
    if (!config.allProperties) {
        let selectedConfig = configLib.getSelectedMatch(config, zone)
        selectedConfig.properties.forEach((prop, index) => {
            if (prop.path !== '') {
                index += 1
                propList = propList.concat(`?prop${index} `)
                orderList = orderList.concat(`?prop${index} `)
                if (config.entrypoint.aggregate) {
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
    
    propList.concat((!newConfig.entrypoint.aggregate && config.entrypoint.aggregate) ? `?entrypoint ` : ``)
    groupList.concat((!newConfig.entrypoint.aggregate && config.entrypoint.aggregate) ? `?entrypoint ` : ``)
    if(!newConfig.allProperties) {
        let newSelectedConfig = configLib.getSelectedMatch(newConfig, zone)
        newSelectedConfig.properties.forEach((prop, index) => {
            if (prop.path !== '') {
                index += 1
                propList = propList.concat(`?newprop${index} `)
                orderList = orderList.concat(`?newprop${index} `)
                if (config.entrypoint.aggregate) {
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
    /*console.log(`}}}}SELECT DISTINCT ${propList}${graph}
    WHERE {
        ${constraints}
        ${(constraints !== newOptions.constraints) ? newOptions.constraints : ''}
        ${defList}
        OPTIONAL {
            ${newdefList}
        }
    } 
    GROUP BY ${groupList}`)*/
    return `SELECT DISTINCT ${propList}${graph}
    WHERE {
        ${constraints}
        ${(constraints !== newOptions.constraints) ? newOptions.constraints : ''}
        ${defList}
        OPTIONAL {
            ${newdefList}
        }
    } 
    GROUP BY ${groupList}`
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
                avgcharlength: Math.floor(Number(typeStat.avgcharlength.value)),
                triplesGraphs: Array.from(Array(prop.level).keys()).map(key => typeStat['g'+ (key+1)].value)
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
    let splittedUri = path.split(':')
    if (prefixes[splittedUri[0]]) {
        return prefixes[splittedUri[0]] + splittedUri[1]
    }
    return path
}

export const usePrefix = (uri, prefixes) => {
    if (!uri.substr(0,1) === 'h') return uri
    let newuri = uri.replace(uri, (match, offset, string) => {
        for (let pref in prefixes) {
            let splittedUri = match.split(prefixes[pref])
            if (splittedUri.length > 1) return `${pref}:${splittedUri[1]}`
        }
        return match
    })
    return newuri ? newuri : uri
}

export const usesPrefix = (uri, prefixes) => {
    const parts = uri.split(':')
    return uri.match(/:/g) && !uri.match(/\//g) && prefixes[parts[0]] !== undefined
}
