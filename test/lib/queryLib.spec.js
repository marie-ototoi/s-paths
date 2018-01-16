import chai, {expect} from 'chai'
// import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import queryLib from '../../src/lib/queryLib'

chai.use(sinonChai)

describe('lib/queryLib', () => {
    it('should write query to get stats', () => {
        expect(queryLib.makePropQuery({ path: 'nobel:LaureateAward/nobel:year/*' }, { constraints: '' })).to.equal(`SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(?object) AS ?total) (COUNT(DISTINCT ?entrypoint) AS ?coverage) 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?object . OPTIONAL { ?object rdfs:label ?labelobject } .  

}`)
        expect(queryLib.makePropQuery({ path: 'nobel:LaureateAward/nobel:year/*', category: 'text' }, { constraints: '', defaultGraph: 'http://localhost:8890/nobel' }, true)).to.equal(`SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(?object) AS ?total) (AVG(?charlength) as ?avgcharlength) (COUNT(DISTINCT ?entrypoint) AS ?coverage) FROM <http://localhost:8890/nobel> 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?object . OPTIONAL { ?object rdfs:label ?labelobject } .  
BIND(STRLEN(?object) AS ?charlength)
}`)
    })
    it('should write query to get total number of entities', () => {
        expect(queryLib.makeTotalQuery('nobel:LaureateAward', { constraints: '', prefixes: {} })).to.equal(`SELECT (COUNT(DISTINCT ?entrypoint) AS ?total) 
WHERE {
?entrypoint rdf:type nobel:LaureateAward . 
}`)
    })
    it('should transform a FSL path into SPARQL', () => {
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward/nobel:year/*', 'prop1', 'entrypoint')).to.equal('?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label ?labelprop1 } . ')
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*', 'prop2', 'entrypoint')).to.equal('?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label ?labelprop2 } . ')
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward', 'object', 'entrypoint')).to.equal('?entrypoint rdf:type nobel:LaureateAward . ')
    })
    it('should make a valid SPARQL query with given entrypoint and props', () => {
        const config1 = {
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
        expect(queryLib.makeQuery('nobel:LaureateAward', config1, { defaultGraph: 'http://localhost:8890/nobel', constraints: '' }))
            .to.equal(`SELECT DISTINCT ?prop1 ?labelprop1 (COUNT(?prop1) as ?countprop1) ?prop2 ?labelprop2 (COUNT(?prop2) as ?countprop2) FROM <http://localhost:8890/nobel> 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label ?labelprop1 } . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label ?labelprop2 } . 
} GROUP BY ?prop1 ?labelprop1 ?prop2 ?labelprop2 ORDER BY ?prop1 ?countprop1 ?prop2 ?countprop2 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', { ...config1, entrypoint: {} }, { constraints: '' }))
            .to.equal(`SELECT DISTINCT ?entrypoint ?prop1 ?labelprop1 ?prop2 ?labelprop2 
WHERE {

?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label ?labelprop1 } . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label ?labelprop2 } . 
} GROUP BY ?entrypoint ?prop1 ?labelprop1 ?prop2 ?labelprop2 ORDER BY ?prop1 ?prop2 `)
    })
    it('should make a valid SPARQL to get stats for a prop', () => {
        expect(queryLib.makePropsQuery('nobel:LaureateAward', { constraints: '' }, 1))
            .to.equal(`SELECT DISTINCT ?property ?datatype ?language ?isiri ?isliteral WHERE {
        ?subject rdf:type nobel:LaureateAward . 
        ?subject ?property ?object .
        OPTIONAL { ?property rdfs:label ?propertylabel } .
        BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(ISLITERAL(?object) AS ?isliteral) .
        BIND(LANG(?object) AS ?language) .
    } GROUP BY ?property ?datatype ?language ?isiri ?isliteral`)
        expect(queryLib.makePropsQuery('nobel:LaureateAward/nobel:university/*', { constraints: '', defaultGraph: 'http://localhost:8890/nobel' }, 2))
            .to.equal(`SELECT DISTINCT ?property ?datatype ?language ?isiri ?isliteral FROM <http://localhost:8890/nobel> WHERE {
        ?subject rdf:type nobel:LaureateAward . ?subject nobel:university ?interobject . OPTIONAL { ?interobject rdfs:label ?labelinterobject } . 
        ?interobject ?property ?object .
        OPTIONAL { ?property rdfs:label ?propertylabel } .
        BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(ISLITERAL(?object) AS ?isliteral) .
        BIND(LANG(?object) AS ?language) .
    } GROUP BY ?property ?datatype ?language ?isiri ?isliteral`)
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
        const prevProp = {
            fullPath: '<http://data.nobelprize.org/terms/LaureateAward>',
            entrypoint: 'nobel:LaureateAward'
        }
        const stat = {
            property: { type: 'uri', value: 'http://purl.org/dc/terms/isPartOf' },
            type: { type: 'uri', value: 'http://dbpedia.org/ontology/Award' },
            isiri: {
                type: 'literal',
                datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
                value: 'true'
            }
        }
        expect(queryLib.defineGroup(stat, prevProp, 1, options))
            .to.deep.equal({
                property: stat.property.value,
                category: 'uri',
                endpoint: 'http://localhost:8890/sparql',
                entrypoint: 'nobel:LaureateAward',
                path: 'nobel:LaureateAward/dct:isPartOf/*',
                level: 1,
                fullPath: '<http://data.nobelprize.org/terms/LaureateAward>/<http://purl.org/dc/terms/isPartOf>/*'
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
})
