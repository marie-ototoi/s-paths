

const getEntities = (endpoint, entityType, propertyList, groupedBy) => {
    
}

// statistical queries
const exploreEntities = (endpoint, entityType, propertyList) => {
    let exploreDirectProperties = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT DISTINCT ?property ?type ?language (count(distinct ?o) as ?unique) 
    WHERE {
      ?s rdf:type ${entityType}. 
      ?s ?property ?o .
      BIND(DATATYPE(?o) as ?type) .
      BIND(LANG(?o) AS ?language).
      FILTER(STRLEN(?o) < 100)
    }
    GROUP BY ?property ?type ?language`
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

exports.getEntities = getEntities
