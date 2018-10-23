import chai, {expect} from 'chai'
// import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import * as queryLib from '../../src/lib/queryLib'

chai.use(sinonChai)

describe('lib/queryLib', () => {
    it('should write query to get stats', () => {
        expect(queryLib.makePropQuery({ path: 'nobel:LaureateAward/nobel:year/*' }, { constraints: '', graphs: [] }, 'count')).to.equal(`SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(?object) AS ?total) (COUNT(DISTINCT ?entrypoint) AS ?coverage) 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?object . FILTER (?object != ?entrypoint) . 


}`)
        expect(queryLib.makePropQuery({ path: 'nobel:LaureateAward/nobel:year/*', category: 'text', level: 1 }, { constraints: '', graphs:['http://localhost:8890/nobel', 'http://localhost:8890/geonames'], resources: [{type: 'urn:geonames.test.fr'}, {type: 'urn:nobel.test.fr'}] }, 'type')).to.equal(`SELECT DISTINCT ?datatype ?language ?isiri ?isliteral ((?charlength) as ?avgcharlength) ?g1 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . GRAPH ?g1 { ?entrypoint nobel:year ?object . } FILTER (?object != ?entrypoint) . 
BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(ISLITERAL(?object) AS ?isliteral) .
        BIND(LANG(?object) AS ?language) .
        BIND(STRLEN(xsd:string(?object)) AS ?charlength) .

} LIMIT 1`)
    })
    it('should write query to get total number of entities', () => {
        expect(queryLib.makeTotalQuery('nobel:LaureateAward', { constraints: '', prefixes: {}, graphs:['http://localhost:8890/nobel', 'http://localhost:8890/geonames'] })).to.equal(`SELECT (COUNT(DISTINCT ?entrypoint) AS ?total) FROM <http://localhost:8890/nobel> FROM <http://localhost:8890/geonames> 
WHERE {
?entrypoint rdf:type nobel:LaureateAward . 
}`)
    })
    it('should transform a FSL path into SPARQL', () => {
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward/nobel:year/*', {
            propName: 'prop1',
            entrypointName: 'entrypoint',
            entrypointType: true,
            graphs: []
        })).to.equal('?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . FILTER (?prop1 != ?entrypoint) . ')
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*', {
            propName: 'prop2',
            entrypointName: 'entrypoint',
            entrypointType: true,
            graphs: []
        })).to.equal('?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . FILTER (?prop2inter1 != ?entrypoint) . ?prop2inter1 foaf:gender ?prop2 . FILTER (?prop2 != ?prop2inter1 && ?prop2 != ?entrypoint) . ')
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward', {
            propName: 'object',
            entrypointName: 'entrypoint',
            entrypointType: true,
            graphs: []
        })).to.equal('?entrypoint rdf:type nobel:LaureateAward . ')    
    })
    it('should generate keyword search constraint', () => {
        expect(queryLib.makeKeywordConstraints('einstein', { maxLevel: 3 }))
            .to.equal(`?entrypoint ?level1 ?value1 . 
    OPTIONAL {
        ?value1 ?level2 ?value2 . 
        ?value2 ?level3 ?value3 . 
    }
    FILTER ((isLiteral(?value1) && regex(?value1, 'einstein', 'i')) || (isLiteral(?value2) && regex(?value2, 'einstein', 'i')) || (isLiteral(?value3) && regex(?value3, 'einstein', 'i'))) . `)
    })
    it('should make a valid SPARQL query to retrieve data for a specific config', () => {
        const config1 = {
            constraints: [
                [{}],
                [{}]
            ],
            selectedMatch: {
                properties: [
                    { path: 'nobel:LaureateAward/nobel:year/*', category: 'text' },
                    { path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*' }
                ],
                selected: true
            }
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
            selectedMatch: {
                properties: [
                    { path: 'nobel:Laureate/dbpedia-owl:affiliation/*/dbpedia-owl:country/*', category: 'geo', subcategory: 'name' }
                ],
                selected: true
            }
        }
        expect(queryLib.makeQuery('nobel:LaureateAward', config1, 'main', { graphs:['http://localhost:8890/nobel', 'http://localhost:8890/geonames'], constraints: '' }))
            .to.equal(`SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1) ?prop2 (COUNT(?prop2) as ?countprop2) FROM <http://localhost:8890/nobel> FROM <http://localhost:8890/geonames> 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . FILTER (?prop1 != ?entrypoint) . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . FILTER (?prop2inter1 != ?entrypoint) . ?prop2inter1 foaf:gender ?prop2 . FILTER (?prop2 != ?prop2inter1 && ?prop2 != ?entrypoint) . 
} GROUP BY ?prop1 ?prop2  ORDER BY ?prop1 ?countprop1 ?prop2 ?countprop2 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', { ...config1, entrypoint: {} }, 'main', { constraints: '', graphs: [] }))
            .to.equal(`SELECT DISTINCT ?entrypoint ?prop1 ?prop2 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . FILTER (?prop1 != ?entrypoint) . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . FILTER (?prop2inter1 != ?entrypoint) . ?prop2inter1 foaf:gender ?prop2 . FILTER (?prop2 != ?prop2inter1 && ?prop2 != ?entrypoint) . 
} GROUP BY ?entrypoint ?prop1 ?prop2  ORDER BY ?prop1 ?prop2 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', config1, 'main', { graphs:['http://localhost:8890/nobel', 'http://localhost:8890/geonames'], constraints: '', prop1only: true }))
            .to.equal(`SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1) FROM <http://localhost:8890/nobel> FROM <http://localhost:8890/geonames> 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . FILTER (?prop1 != ?entrypoint) . 
} GROUP BY ?prop1  ORDER BY ?prop1 ?countprop1 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', config2, 'main', { graphs:['http://localhost:8890/nobel', 'http://localhost:8890/geonames'], constraints: '', prop1only: true }))
            .to.equal(`SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1) FROM <http://localhost:8890/nobel> FROM <http://localhost:8890/geonames> 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . FILTER (?prop1 != ?entrypoint) . 
} GROUP BY ?prop1  ORDER BY ?prop1 ?countprop1 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', config3, 'main', { constraints: '', graphs: [] }))
            .to.equal(`SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1) 
WHERE {

?entrypoint rdf:type nobel:Laureate . ?entrypoint dbpedia-owl:affiliation ?prop1inter1 . FILTER (?prop1inter1 != ?entrypoint) . ?prop1inter1 dbpedia-owl:country ?prop1 . FILTER (?prop1 != ?prop1inter1 && ?prop1 != ?entrypoint) . 
} GROUP BY ?prop1  ORDER BY ?prop1 ?countprop1 `)
    })
    it('should make a valid SPARQL query to retrieve additional multiple property', () => {

        expect(queryLib.makeMultipleQuery('nobel:LaureateAward', 'nobel:LaureateAward/nobel:year/*', 2, 'main', { graphs:['http://localhost:8890/nobel', 'http://localhost:8890/geonames'], constraints: '' }))
            .to.equal(`SELECT DISTINCT ?entrypoint ?multiple2 FROM <http://localhost:8890/nobel> FROM <http://localhost:8890/geonames> 
WHERE {
    
    ?entrypoint rdf:type <nobel:LaureateAward> .
    ?entrypoint nobel:year ?multiple2 . FILTER (?multiple2 != ?entrypoint) . 
}`)
    })
    it('should make a valid SPARQL to get stats for a prop', () => {
        let prefixes = {
            nobel: 'http://data.nobelprize.org/terms/',
            dct: 'http://purl.org/dc/terms/'
        }
        expect(queryLib.makePropsQuery('nobel:LaureateAward', { constraints: '',    graphs: [] }, 1, prefixes))
            .to.equal(`SELECT DISTINCT ?property WHERE {
        ?subject rdf:type nobel:LaureateAward . 
        ?subject ?property ?object .
        FILTER (?subject != ?object) . 
    } GROUP BY ?property`)
        expect(queryLib.makePropsQuery('nobel:LaureateAward/nobel:university/*', { constraints: '', graphs:['http://localhost:8890/nobel'] }, 2, prefixes))
            .to.equal(`SELECT DISTINCT ?property FROM <http://localhost:8890/nobel> WHERE {
        ?subject rdf:type nobel:LaureateAward . ?subject nobel:university ?interobject . FILTER (?interobject != ?subject) . 
        ?interobject ?property ?object .
        FILTER (?interobject != ?object) . FILTER (?interobject != ?object && ?property != <http://data.nobelprize.org/terms/university>) . 
    } GROUP BY ?property`)
        expect(queryLib.makePropsQuery('nobel:LaureateAward/nobel:university/*', { constraints: '', graphs:['http://localhost:8890/nobel'] }, 3, prefixes))
            .to.equal(`SELECT DISTINCT ?property FROM <http://localhost:8890/nobel> WHERE {
        ?subject rdf:type nobel:LaureateAward . ?subject nobel:university ?interobject . FILTER (?interobject != ?subject) . 
        ?interobject ?property ?object .
        FILTER (?interobject != ?object) . FILTER (?interobject != ?object && ?property != <http://data.nobelprize.org/terms/university>) . 
    } GROUP BY ?property`)
        expect(queryLib.makePropsQuery('dbpedia-owl:Award/nobel:laureate/*/nobel:university/*/rdfs:label/*', { constraints: '', graphs:['a'] }, 3, prefixes))
            .to.equal(`SELECT DISTINCT ?property FROM <a> WHERE {
        ?subject rdf:type dbpedia-owl:Award . ?subject nobel:laureate ?interobjectinter1 . FILTER (?interobjectinter1 != ?subject) . ?interobjectinter1 nobel:university ?interobjectinter2 . FILTER (?interobjectinter2 != ?interobjectinter1 && ?interobjectinter2 != ?subject) . ?interobjectinter2 rdfs:label ?interobject . FILTER (?interobject != ?interobjectinter2 && ?interobject != ?interobjectinter1 && ?interobject != ?subject) . 
        ?interobject ?property ?object .
        FILTER (?interobject != ?object) . FILTER (?interobjectinter1 != ?object && ?property != <http://data.nobelprize.org/terms/laureate>) . FILTER (?interobjectinter2 != ?object && ?property != <http://data.nobelprize.org/terms/university>) . 
    } GROUP BY ?property`)
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

    it('should build a query corresponding to a transition between two configs', () => {
        const config = {
            constraints: [
                [{}],
                [{}]
            ],
            selectedMatch: {
                properties: [
                    { path: 'nobel:LaureateAward/nobel:year/*' },
                    { path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*' }
                ],
                selected: true
            }
            
        }
        const options = {
            constraints: 'FILTER (?prop1 >= xsd:date("1930-01-01") && ?prop1 < xsd:date("1939-12-31")) . ',
            graphs: [],
            resourceGraph: 'a'
        }
        const newConfig = {
            constraints: [
                [{}],
                [{}]
            ],
            selectedMatch: {
                properties: [
                    { path: 'nobel:LaureateAward/nobel:university/*' },
                    { path: 'nobel:LaureateAward/dct:isPartOf/*' }
                ],
                selected: true
            }
        }
        const newOptions = {
            constraints: 'FILTER (?prop1 >= xsd:date("1930-01-01") && ?prop1 < xsd:date("1939-12-31")) . ',
            graphs: [],
            resourceGraph: 'b'
        }
        expect(queryLib.makeTransitionQuery(newConfig, newOptions, config, options, 'main'))
            .to.equal(`SELECT DISTINCT ?prop1 (COUNT(?prop1) as ?countprop1) ?prop2 (COUNT(?prop2) as ?countprop2) ?newprop1 (COUNT(?newprop1) as ?newcountprop1) ?newprop2 (COUNT(?newprop2) as ?newcountprop2) 
    WHERE {
        FILTER (?prop1 >= xsd:date("1930-01-01") && ?prop1 < xsd:date("1939-12-31")) . 
        
        ?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . FILTER (?prop1 != ?entrypoint) . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . FILTER (?prop2inter1 != ?entrypoint) . ?prop2inter1 foaf:gender ?prop2 . FILTER (?prop2 != ?prop2inter1 && ?prop2 != ?entrypoint) . 
        OPTIONAL {
            ?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:university ?newprop1 . FILTER (?newprop1 != ?entrypoint) . ?entrypoint dct:isPartOf ?newprop2 . FILTER (?newprop2 != ?entrypoint) . 
        }
    } 
    GROUP BY ?prop1 ?prop2 ?newprop1 ?newprop2 `)
    })
    it('should build a query to generate a subgraph', () => {
        expect(queryLib.makeSubGraphQuery({ constraints:``, resourceGraph: 'http://resource1.ilda.fr', graphs: ['http://nobel.ilda.fr', 'http://nobeladdon.ilda.fr'], entrypoint: 'http://data.nobelprize.org/terms/AwardFile', maxLevel: 5 }, 2))
            .to.equal(`INSERT { 
        GRAPH <http://resource1.ilda.fr> {
            ?value1 ?prop2 ?value2 . 
        }
      }
      FROM <http://nobel.ilda.fr> FROM <http://nobeladdon.ilda.fr> 
      WHERE { 
        ?entrypoint ?prop1 ?value1 .
        ?entrypoint rdf:type <http://data.nobelprize.org/terms/AwardFile> .
        
        ?value1 ?prop2 ?value2 . 
    }`)
    })
    it('should return true if there s already a + specific path in the list', () => {
        let pathsList1 = [
            { path: 'nobel:LaureateAward/nobel:university/*/nobel:LaureateAward/dct:isPartOf/*', level: 2 },
            { path: 'nobel:LaureateAward/nobel:LaureateAward/dct:isPartOf/*/nobel:university/*', level: 2 }

        ]
        expect(queryLib.hasMoreSpecificPath('nobel:LaureateAward/nobel:university/*', 1, pathsList1))
            .to.be.true
        expect(queryLib.hasMoreSpecificPath('nobel:Award/nobel:university/*', 1, pathsList1))
            .to.be.false
        expect(queryLib.hasMoreSpecificPath('nobel:LaureateAward/nobel:university/*/nobel:LaureateAward/dct:isPartOf/*/more/*', 3, pathsList1))
            .to.be.false
        expect(queryLib.hasMoreSpecificPath('nobel:LaureateAward/nobel:university/*/nobel:LaureateAward/dct:isPartOf/*', 2, pathsList1))
            .to.be.false
    })
    it('should make a valid SPARQL query to retrieve instances for a specific set of paths', () => {
        const config1 = {
            constraints: [
                [{}],
                [{}]
            ],
            selectedMatch: {
                properties: [
                    { path: 'nobel:LaureateAward/nobel:year/*', category: 'text' },
                    { path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*' }
                ],
                selected: true
            }
        }
        expect(queryLib.makeDetailQuery('nobel:LaureateAward', config1, 'main', { graphs:['http://localhost:8890/nobel', 'http://localhost:8890/geonames'], constraints: `FILTER regex(?entrypoint, '^http://data.nobelprize.org/resource/laureateaward/306$|http://data.nobelprize.org/resource/laureateaward/578$|http://data.nobelprize.org/resource/laureateaward/575$|http://data.nobelprize.org/resource/laureateaward/472$|http://data.nobelprize.org/resource/laureateaward/174$|http://data.nobelprize.org/resource/laureateaward/579$|http://data.nobelprize.org/resource/laureateaward/21$|http://data.nobelprize.org/resource/laureateaward/302$|http://data.nobelprize.org/resource/laureateaward/477$|http://data.nobelprize.org/resource/laureateaward/169$|http://data.nobelprize.org/resource/laureateaward/22$|http://data.nobelprize.org/resource/laureateaward/175$|http://data.nobelprize.org/resource/laureateaward/307$|http://data.nobelprize.org/resource/laureateaward/23$|http://data.nobelprize.org/resource/laureateaward/478$|http://data.nobelprize.org/resource/laureateaward/582$$', 'i') .` }))
            .to.equal(`SELECT DISTINCT ?entrypoint ?prop2inter1 ?prop1 ?prop2 FROM <http://localhost:8890/nobel> FROM <http://localhost:8890/geonames> 
WHERE {
FILTER regex(?entrypoint, '^http://data.nobelprize.org/resource/laureateaward/306$|http://data.nobelprize.org/resource/laureateaward/578$|http://data.nobelprize.org/resource/laureateaward/575$|http://data.nobelprize.org/resource/laureateaward/472$|http://data.nobelprize.org/resource/laureateaward/174$|http://data.nobelprize.org/resource/laureateaward/579$|http://data.nobelprize.org/resource/laureateaward/21$|http://data.nobelprize.org/resource/laureateaward/302$|http://data.nobelprize.org/resource/laureateaward/477$|http://data.nobelprize.org/resource/laureateaward/169$|http://data.nobelprize.org/resource/laureateaward/22$|http://data.nobelprize.org/resource/laureateaward/175$|http://data.nobelprize.org/resource/laureateaward/307$|http://data.nobelprize.org/resource/laureateaward/23$|http://data.nobelprize.org/resource/laureateaward/478$|http://data.nobelprize.org/resource/laureateaward/582$$', 'i') .
?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . FILTER (?prop1 != ?entrypoint) . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . FILTER (?prop2inter1 != ?entrypoint) . ?prop2inter1 foaf:gender ?prop2 . FILTER (?prop2 != ?prop2inter1 && ?prop2 != ?entrypoint) . 
} GROUP BY ?prop1 ?prop2  ORDER BY ?prop1 ?prop2 LIMIT 10`)
    })
})
