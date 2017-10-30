
// statistical queries
const exploreProperties = (endpoint, entity) => {
    let exploreDirectProperties = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?property ?type ?language (count(distinct ?o) as ?unique) (max(?charlength) as ?maxchar) (avg(?charlength) as ?avgchar) (max(ceil(?o)) as ?maxval)  (min(ceil(?o)) as ?minval) ?hasLabel    
    WHERE {
        ?s rdf:type ${entityType} .
        ?s ?property ?o .
        BIND(EXISTS{?o rdfs:label ?label} AS ?hasLabel) .
        BIND(DATATYPE(?o) as ?type) .
        BIND(LANG(?o) AS ?language).
        BIND( STRLEN(?o) AS ?charlength)
    }
    GROUP BY ?property ?type ?language ?hasLabel`
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

exports.exploreProperties = exploreProperties
