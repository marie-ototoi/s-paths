import fetch from 'rdf-fetch'
import rdflib from 'rdflib'
import propertyModel from '../../models/property'
import queryLib, { ignorePromise } from './queryLib'

const getPropsLabels = async (prefixes, props) => {
    // find all classes and props used in paths
    let urisToLabel = props.reduce((acc, curr) => {
        let pathParts = curr.path.split('/')
        // deduplicate
        pathParts.forEach(part => {
            if (part !== '*' && !acc.includes(part)) acc.push(part)
        })
        return acc
    }, []).map(prop => {
        return {
            uri: queryLib.useFullUri(prop, prefixes)
        }
    })
    return getLabels(urisToLabel, prefixes)
}

const getLabels = async (urisToLabel, prefixes) => {
    let missingUris
    // create a local graph
    let graph = new rdflib.IndexedFormula()
    // to add
    // try to get props labels and comments in database
    // if already defined, do not keep in queried prefixes
    // propertyModel.find({ uri: uri }).exec()
    let propsInDatabase = await Promise.all(urisToLabel.map(prop => {
        return propertyModel.findOne({ uri: prop.uri }).exec()
    }).map(ignorePromise))
    propsInDatabase.forEach((prop, index) => {
        if (prop) {
            urisToLabel[index].label = prop.label
            urisToLabel[index].comment = prop.comment
        }
    })
    missingUris = urisToLabel.filter(prop => !prop.label)
    // load
    await Promise.all(missingUris.map(prop => loadUri(prop.uri, graph)).map(ignorePromise))
    missingUris = await Promise.all(getLabelsFromGraph(missingUris, graph))
    propertyModel.createOrUpdate(missingUris)
    //
    return urisToLabel.map(prop => {
        if (prop.label) {
            return prop
        } else {
            const missing = missingUris.filter(missingprop => missingprop.uri === prop.uri && missingprop.label)
            if (missing.length > 0) {
                return missing[0]
            } else {
                return prop
            }
        }
    })
}

const getLabelsFromGraph = (uris, graph) => {
    let labels = uris.map(prop => graph.any(rdflib.sym(prop.uri), rdflib.sym('http://www.w3.org/2000/01/rdf-schema#label')))
    labels.forEach((label, index) => {
        if (label) uris[index].label = label.value
    })
    let comments = uris.map(prop => graph.any(rdflib.sym(prop.uri), rdflib.sym('http://www.w3.org/2000/01/rdf-schema#comment')))
    comments.forEach((comment, index) => {
        if (comment) uris[index].comment = comment.value
    })
    return uris
}

const loadUri = (uri, graph) => {
    // console.log('load ontology', url)
    return fetch(uri, { redirect: 'follow', headers: { 'Accept': 'Accept: text/turtle, application/rdf+xml, text/ntriples, application/ld+json' } }).then(response => {
        if (response.ok) {
            // if succesful, parse it and add it to the graph
            let mediaType = response.headers.get('Content-type')
            // little hack to be removed -> warn hosts that the mime type is wrong
            if (mediaType === 'text/xml') mediaType = 'application/rdf+xml'
            // check for parsable ontologies type (to avoid app crash)
            if (mediaType &&
            (mediaType.indexOf('application/ld+json') >= 0 ||
            mediaType.indexOf('application/rdf+xml') >= 0 ||
            mediaType.indexOf('text/turtle') >= 0 ||
            mediaType.indexOf('text/n3') >= 0)) {
                return response.text().then(text => {
                    return rdflib.parse(text, graph, uri, mediaType, (cberr, cbres) => { })
                })
            }
        } else {
            // nothing
            return response
        }
    })
}

exports.getLabels = getLabels
exports.getLabelsFromGraph = getLabelsFromGraph
exports.getPropsLabels = getPropsLabels
exports.loadUri = loadUri
