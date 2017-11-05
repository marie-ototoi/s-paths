import data from '../../test/data/nobel'

// statistical queries
const getStats = (endpoint, entryPoint) => {

    return new Promise((resolve, reject) => {

        resolve(data.explore())

    })
}

const makeQuery = () => {

}

const getData = (endpoint, entryPoint) => {

    const client = new SparqlClient(endpoint)
    //query
    client
    .query(exploreDirectProperties)
    .execute()
    .then(response => {
        //console.log(response)
        this.setError({ error: null })
        this.setResults(response.results.bindings)
    })
    .catch(error => {
        //console.log(error)
        this.setError({ error })
    })

}

exports.getStats = getStats
exports.getData = getData
