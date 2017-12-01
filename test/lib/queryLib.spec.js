import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import queryLib from '../../src/lib/queryLib'

describe('lib/queryLib', () => {
    it('should write query to get stats', () => {
        expect(queryLib.makePropQuery('nobel:LaureateAward/nobel:year/*')).to.equal(`SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(DISTINCT ?entrypoint) AS ?coverage) 
WHERE {
?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?object . OPTIONAL { ?object rdfs:label ?labelobject } .  
}`)
    })
    it('should write query to get total number of entities', () => {
        expect(queryLib.makeTotalQuery('nobel:LaureateAward', '')).to.equal(`SELECT (COUNT(DISTINCT ?entrypoint) AS ?total) 
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
            selectedMatch: {
                properties: [
                    { path: 'nobel:LaureateAward/nobel:year/*' },
                    { path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*' }
                ]
            }
        }
        const config2 = {
            ...config1,
            entrypoint: {}
        }
        expect(queryLib.makeQuery('nobel:LaureateAward', config1))
            .to.equal(`SELECT DISTINCT ?prop1 ?labelprop1 (COUNT(?prop1) as ?countprop1) ?prop2 ?labelprop2 (COUNT(?prop2) as ?countprop2) 
WHERE {
?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label ?labelprop1 } . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label ?labelprop2 } . 
} GROUP BY ?prop1 ?labelprop1 ?prop2 ?labelprop2 ORDER BY ?prop1 ?countprop1 ?prop2 ?countprop2 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', config2))
            .to.equal(`SELECT DISTINCT ?entrypoint ?prop1 ?labelprop1 ?prop2 ?labelprop2 
WHERE {
?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label ?labelprop1 } . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label ?labelprop2 } . 
} GROUP BY ?entrypoint ?prop1 ?labelprop1 ?prop2 ?labelprop2 ORDER BY ?prop1 ?prop2 `)
    })
    it('should make a valid SPARQL to get stats for a prop', () => {
        expect(queryLib.makePropsQuery('nobel:LaureateAward', '', 1))
            .to.equal(`SELECT DISTINCT ?property ?datatype ?language ?type ?isiri WHERE {
        ?subject rdf:type nobel:LaureateAward . 
        ?subject ?property ?object .
        OPTIONAL { ?object rdf:type ?type } .
        OPTIONAL { ?property rdfs:label ?propertylabel } .
        BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(LANG(?object) AS ?language) .
    } GROUP BY ?property ?datatype ?language ?type ?isiri`)
        expect(queryLib.makePropsQuery('nobel:LaureateAward/nobel:university/*', '', 2))
            .to.equal(`SELECT DISTINCT ?property ?datatype ?language ?type ?isiri WHERE {
        ?subject rdf:type nobel:LaureateAward . ?subject nobel:university ?interobject . OPTIONAL { ?interobject rdfs:label ?labelinterobject } . 
        ?interobject ?property ?object .
        OPTIONAL { ?object rdf:type ?type } .
        OPTIONAL { ?property rdfs:label ?propertylabel } .
        BIND(DATATYPE(?object) AS ?datatype) .
        BIND(ISIRI(?object) AS ?isiri) .
        BIND(LANG(?object) AS ?language) .
    } GROUP BY ?property ?datatype ?language ?type ?isiri`)
    })
    it('should affect a prop to the right group', () => {
        const prefixes = {
            dct: 'http://purl.org/dc/terms/'
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
        expect(queryLib.defineGroup(stat, 'nobel:LaureateAward', 1, prefixes))
            .to.deep.equal({
                property: stat.property.value,
                category: 'uri',
                path: 'nobel:LaureateAward/dct:isPartOf/*'
            })
    })
    it('should replace the beginning of a url with a prefix', () => {
        const prefixes = {
            dct: 'http://purl.org/dc/terms/'
        }
        expect(queryLib.usePrefix('http://purl.org/dc/terms/isPartOf', prefixes))
            .to.equal('dct:isPartOf')
    })
})
