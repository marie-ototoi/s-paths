import chai, {expect} from 'chai'
// import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import queryLib from '../../src/lib/queryLib'

chai.use(sinonChai)

describe('lib/queryLib', () => {
    it('should write query to get stats', () => {
        expect(queryLib.makePropQuery({ path: 'nobel:LaureateAward/nobel:year/*' }, { constraints: '' }, 'count')).to.equal(`SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(?object) AS ?total) (COUNT(DISTINCT ?entrypoint) AS ?coverage) 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?object . 

}`)
        expect(queryLib.makePropQuery({ path: 'nobel:LaureateAward/nobel:year/*', category: 'text' }, { constraints: '', defaultGraph: 'http://localhost:8890/nobel' }, 'type')).to.equal(`SELECT DISTINCT ?datatype ?language ?isiri ?isliteral (AVG(?charlength) as ?avgcharlength) FROM <http://localhost:8890/nobel> 
WHERE {

{ SELECT ?entrypoint FROM <http://localhost:8890/nobel> WHERE { ?entrypoint rdf:type nobel:LaureateAward . } LIMIT 100 } . ?entrypoint nobel:year ?object . 
BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(ISLITERAL(?object) AS ?isliteral) .
        BIND(LANG(?object) AS ?language) .
        BIND(STRLEN(xsd:string(?object)) AS ?charlength) .
}`)
    })
    it('should write query to get total number of entities', () => {
        expect(queryLib.makeTotalQuery('nobel:LaureateAward', { constraints: '', prefixes: {} })).to.equal(`SELECT (COUNT(DISTINCT ?entrypoint) AS ?total) 
WHERE {
?entrypoint rdf:type nobel:LaureateAward . 
}`)
    })
    it('should transform a FSL path into SPARQL', () => {
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward/nobel:year/*', {
            propName: 'prop1',
            entrypointName: 'entrypoint',
            entrypointType: true
        })).to.equal('?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . ')
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*', {
            propName: 'prop2',
            entrypointName: 'entrypoint',
            entrypointType: true
        })).to.equal('?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . ')
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward', {
            propName: 'object',
            entrypointName: 'entrypoint',
            entrypointType: true
        })).to.equal('?entrypoint rdf:type nobel:LaureateAward . ')
    })
    it('should make a valid SPARQL query to retrieve data for a specific config', () => {
        const config1 = {
            constraints: [
                [{}],
                [{}]
            ],
            matches: [
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:year/*', category: 'text' },
                        { path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*' }
                    ],
                    selected: true
                }
            ]
        }
        const config2 = {
            ...config1,
            constraints: [
                [{ hierarchical: true }],
                [{}]
            ]
        }
        const config3 = {
            constraints: [
                [{}]
            ],
            matches: [
                {
                    properties: [
                        { path: 'nobel:Laureate/dbpedia-owl:affiliation/*/dbpedia-owl:country/*', category: 'geo', subcategory: 'name' }
                    ],
                    selected: true
                }
            ]
        }
        expect(queryLib.makeQuery('nobel:LaureateAward', config1, 'main', { defaultGraph: 'http://localhost:8890/nobel', constraints: '' }))
            .to.equal(`SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1) ?prop2 (COUNT(?prop2) as ?countprop2) FROM <http://localhost:8890/nobel> 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . 
} GROUP BY ?prop1 ?prop2 ORDER BY ?prop1 ?countprop1 ?prop2 ?countprop2 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', { ...config1, entrypoint: {} }, 'main', { constraints: '' }))
            .to.equal(`SELECT DISTINCT ?entrypoint ?prop1 ?prop2 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . 
} GROUP BY ?entrypoint ?prop1 ?prop2 ORDER BY ?prop1 ?prop2 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', config1, 'main', { defaultGraph: 'http://localhost:8890/nobel', constraints: '', prop1only: true }))
.to.equal(`SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1) FROM <http://localhost:8890/nobel> 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . 
} GROUP BY ?prop1 ORDER BY ?prop1 ?countprop1 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', config2, 'main', { defaultGraph: 'http://localhost:8890/nobel', constraints: '', prop1only: true }))
.to.equal(`SELECT DISTINCT ?prop1 ?directlink (COUNT(?prop1) as ?countprop1) FROM <http://localhost:8890/nobel> 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 ?directlink ?prop1bis . ?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1bis .  }
} GROUP BY ?prop1 ?directlink ORDER BY ?prop1 ?countprop1 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', config3, 'main', { constraints: '' }))
.to.equal(`SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1) 
WHERE {

?entrypoint rdf:type nobel:Laureate . ?entrypoint dbpedia-owl:affiliation ?prop1inter1 . ?prop1inter1 dbpedia-owl:country ?prop1 . 
} GROUP BY ?prop1 ORDER BY ?prop1 ?countprop1 `)
    })
    it('should make a valid SPARQL to get stats for a prop', () => {
        expect(queryLib.makePropsQuery('nobel:LaureateAward', { constraints: '' }, 1))
            .to.equal(`SELECT DISTINCT ?property WHERE {
        { SELECT ?subject WHERE { ?subject rdf:type nobel:LaureateAward . } LIMIT 100 } . 
        ?subject ?property ?object .
    } GROUP BY ?property ?object`)
        expect(queryLib.makePropsQuery('nobel:LaureateAward/nobel:university/*', { constraints: '', defaultGraph: 'http://localhost:8890/nobel' }, 2))
            .to.equal(`SELECT DISTINCT ?property FROM <http://localhost:8890/nobel> WHERE {
        { SELECT ?subject FROM <http://localhost:8890/nobel> WHERE { ?subject rdf:type nobel:LaureateAward . } LIMIT 100 } . ?subject nobel:university ?interobject . 
        ?interobject ?property ?object .
    } GROUP BY ?property ?object`)
    })
    it('should affect a prop to the right group', () => {
        const options = {
            prefixes: {
                nobel: 'http://data.nobelprize.org/terms/',
                dct: 'http://purl.org/dc/terms/'
            },
            ignoreList: [],
            endpoint: 'http://localhost:8890/sparql'
        }
        const stat = {
            property: 'http://purl.org/dc/terms/isPartOf',
            type: 'http://dbpedia.org/ontology/Award',
            isiri: 'true'
        }
        expect(queryLib.defineGroup(stat, options))
            .to.deep.equal({
                property: stat.property,
                category: 'uri',
                subcategory: undefined,
                type: 'uri',
                isiri: 'true',
                language: undefined
            })
    })
    it('should replace the beginning of a url with a prefix', () => {
        const prefixes = {
            dct: 'http://purl.org/dc/terms/'
        }
        expect(queryLib.usePrefix('http://purl.org/dc/terms/isPartOf', prefixes))
            .to.equal('dct:isPartOf')
        expect(queryLib.usePrefix('http://unknown.url/toto', prefixes))
            .to.equal('http://unknown.url/toto')
    })
    it('should generate a prefix root', () => {
        expect(queryLib.createPrefix('http://purl.org/dc/terms/isPartOf', 3))
            .to.equal('dctermsispartof')
        expect(queryLib.createPrefix('http://purl.org/NET/c4dm/event.owl#', 4))
            .to.equal('netc4dmeventowl')
    })
    it('should return the root of an url', () => {
        expect(queryLib.getRoot('http://purl.org/dc/terms/isPartOf'))
            .to.equal('http://purl.org/dc/terms/')
        expect(queryLib.getRoot('http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing'))
            .to.equal('http://www.w3.org/2003/01/geo/wgs84_pos#')
    })
    it('should return true if the url is already reduced with a prefix, else false', () => {
        const pref = { nobel: 'http://data.nobelprize.org/terms/' }
        expect(queryLib.usesPrefix('nobel:LaureateAward', pref))
            .to.equal(true)
        expect(queryLib.usesPrefix('http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing', pref))
            .to.equal(false)
    })

    it('should transform a full path in a prefixed path', () => {
        let prefixes = {
            nobel: 'http://data.nobelprize.org/terms/',
            nobel2: 'http://data.nobelprize.org/terms#',
            foaf: 'http://xmlns.com/foaf/0.1/'
        }
        expect(queryLib.convertPath('<http://data.nobelprize.org/terms/LaureateAward>/<http://data.nobelprize.org/terms/laureate>/<http://data.nobelprize.org/terms/Laureate>/<http://xmlns.com/foaf/0.1/gender>/*', prefixes))
            .to.equal('nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*')
        expect(queryLib.convertPath('<http://data.nobelprize.org/terms#LaureateAward>/<http://data.nobelprize.org/terms#laureate>/<http://data.nobelprize.org/terms#Laureate>/<http://xmlns.com/foaf/0.1/gender>/*', prefixes))
            .to.equal('nobel2:LaureateAward/nobel2:laureate/nobel2:Laureate/foaf:gender/*')
    })

    it('should add the shortest prefix available prefix to the list', () => {
        let prefixes = {
            nobel: 'http://data.nobelprize.org/terms/'
        }
        expect(queryLib.addSmallestPrefix('http://xmlns.com/foaf/0.1/gender', prefixes))
            .to.deep.equal({
                ...prefixes,
                xmlns: 'http://xmlns.com/foaf/0.1/'
            })
        expect(queryLib.addSmallestPrefix('http://data.nobelprize.org/te', prefixes))
            .to.deep.equal({
                ...prefixes,
                nobelp: 'http://data.nobelprize.org/'
            })
    })

    it('should check if prefix already defined ', () => {
        let prefixes = {
            nobel: 'http://data.nobelprize.org/terms/'
        }
        expect(queryLib.prefixDefined('http://data.nobelprize.org/terms/LaureateAward', prefixes))
            .to.equal(true)
        expect(queryLib.prefixDefined('http://xmlns.com/foaf/0.1/gender', prefixes))
            .to.equal(false)
    })

    it('should build a query corresponding to selected spec', () => {
        expect(queryLib.makeQueryFromConstraint({
            value: '1930',
            category: 'datetime',
            group: 'decade',
            propName: 'prop1'
        })).to.equal('FILTER (?prop1 >= xsd:date("1930-01-01") && ?prop1 < xsd:date("1939-12-31")) . ')
        expect(queryLib.makeQueryFromConstraint({
            value: '1948',
            category: 'datetime',
            group: 'year',
            propName: 'prop2'
        })).to.equal('FILTER (?prop2 >= xsd:date("1948-01-01") && ?prop2 < xsd:date("1948-12-31")) . ')
        expect(queryLib.makeQueryFromConstraint({
            value: 'Chemistry',
            category: 'text',
            propName: 'prop2'
        })).to.equal('FILTER regex(?prop2, "^Chemistry$") . ')
        expect(queryLib.makeQueryFromConstraint({
            value: [15, 30],
            category: 'aggregate',
            propName: 'prop1'
        })).to.equal('FILTER (?prop1 >= 15 && ?prop1 < 30) . ')
    })
    it('should build a query corresponding to a transition between two configs', () => {
        const config = {
            constraints: [
                [{}],
                [{}]
            ],
            matches: [
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:year/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*' }
                    ],
                    selected: true
                }
            ]
        }
        const options = {
            constraints: 'FILTER (?prop1 >= xsd:date("1930-01-01") && ?prop1 < xsd:date("1939-12-31")) . '
        }
        const newConfig = {
            constraints: [
                [{}],
                [{}]
            ],
            matches: [
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:university/*' },
                        { path: 'nobel:LaureateAward/dct:isPartOf/*' }
                    ],
                    selected: true
                }
            ]
        }
        const newOptions = {
            constraints: 'FILTER (?prop1 >= xsd:date("1930-01-01") && ?prop1 < xsd:date("1939-12-31")) . '
        }
        expect(queryLib.makeTransitionQuery(newConfig, newOptions, config, options, 'main'))
            .to.equal(`SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1) ?prop2 (COUNT(?prop2) as ?countprop2) ?newprop1 (COUNT(?newprop1) as ?newcountprop1) ?newprop2 (COUNT(?newprop2) as ?newcountprop2) 
    WHERE {
        FILTER (?prop1 >= xsd:date("1930-01-01") && ?prop1 < xsd:date("1939-12-31")) . 
        ?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . 
        OPTIONAL {
            ?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:university ?newprop1 . ?entrypoint dct:isPartOf ?newprop2 . 
        }
    } 
    GROUP BY ?prop1 ?prop2 ?newprop1 ?newprop2 
    ORDER BY ?prop1 ?countprop1 ?prop2 ?countprop2 ?newprop1 ?newcountprop1 ?newprop2 ?newcountprop2 `)
    })
})
