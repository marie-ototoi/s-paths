import data from '../../test/data/nobel'
import {SparqlClient, SPARQL} from 'sparql-client-2'

// statistical queries
const getStats = (endpoint, entrypoint) => {
    return new Promise((resolve, reject) => {
        resolve(data.explore())
    })
}

const makeQuery = (entrypoint, constraint) => {
    let query = `SELECT DISTINCT ?entrypoint 
    WHERE { ?entrypoint type> ${entrypoint} . ${constraint}}`
    //console.log(query)
    return query
}

const getData = (endpoint, query) => {
    return new Promise((resolve, reject) => {
        resolve(data.load())
    })
    /*const client = new SparqlClient(endpoint)
        .register({
            rdf: '<http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        })
    return client
        .query(query + '&output=json')
        .execute()
    */
}


exports.getData = getData
exports.getStats = getStats
exports.makeQuery = makeQuery
