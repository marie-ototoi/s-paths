import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import queryLib from '../../src/lib/queryLib'

describe('lib/queryLib', () => {
    it('should write query to get stats', () => {
        expect(queryLib.getStatsProp('nobel:LaureateAward/nobel:year/*')).to.equal(`SELECT (COUNT(DISTINCT ?object) AS ?unique) (COUNT(DISTINCT ?entrypoint) AS ?coverage) 
WHERE {
?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?object . OPTIONAL { ?object rdfs:label  ?labelobject } .  
}`)
    })
    it('should transform a FSL path into SPARQL', () => {
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward/nobel:year/*', 'prop1', 'entrypoint')).to.equal('?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label  ?labelprop1 } . ')
        expect(queryLib.FSL2SPARQL('nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*', 'prop2', 'entrypoint')).to.equal('?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label  ?labelprop2 } . ')
    })
    it('should make a valid SPARQL query with given entrypoint and props', () => {
        const config1 = {
            selectedMatch:{
                properties: [
                    { path: "nobel:LaureateAward/nobel:year/*" },
                    { path: "nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*" }
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
?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label  ?labelprop1 } . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label  ?labelprop2 } . 
} GROUP BY ?prop1 ?labelprop1 ?prop2 ?labelprop2 ORDER BY ?prop1 ?countprop1 ?prop2 ?countprop2 `)
        expect(queryLib.makeQuery('nobel:LaureateAward', config2))
            .to.equal(`SELECT DISTINCT ?entrypoint ?prop1 ?labelprop1 ?prop2 ?labelprop2 
WHERE {
?entrypoint rdf:type nobel:LaureateAward . ?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label  ?labelprop1 } . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label  ?labelprop2 } . 
} GROUP BY ?entrypoint ?prop1 ?labelprop1 ?prop2 ?labelprop2 ORDER BY ?prop1 ?prop2 `)
    })
})
