import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import data from '../../src/lib/dataLib'
import testSet from '../data/nobel'

const dataSet1 = [
    {
        zone: 'main',
        statements: {
            results: {
                bindings: [
                    { prop1: 'toto' }
                ]
            },
            head: {
                vars: ['prop1']
            }
        }
    },
    {
        zone: 'aside',
        statements: {}
    }
]
const dataSet2 = testSet.load('Timeline').results.bindings

describe('lib/data', () => {

    it('should return true if data is populated for a specific zone', () => {
        expect(data.areLoaded(dataSet1, 'main')).to.equal(true)
        expect(data.areLoaded(dataSet1, 'aside')).to.equal(false)
    })
    it('should return data results for a specific zone', () => {
        expect(data.getResults(dataSet1, 'main')).to.deep.equal([{ prop1: 'toto' }])
        expect(data.getResults(dataSet1, 'aside')).to.deep.equal([])
    })
    it('should return data headings for a specific zone', () => {
        expect(data.getHeadings(dataSet1, 'main')).to.deep.equal(['prop1'])
        expect(data.getHeadings(dataSet1, 'aside')).to.deep.equal([])
    })
    /* it('should return a nested set of data, optimizing grouping by date', () => {
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 150).length).to.deep.equal(113)
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 100).length).to.deep.equal(12)
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 5).length).to.deep.equal(2)
    }) */
    it('should add values of specified props when grouped', () => {
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 150, ['countprop2', 'countprop3'])[0].countprop2).to.equal(6)
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 150, ['countprop2', 'countprop3'])[2].countprop2).to.equal(7)
    })
    it('should transform a FSL path into SPARQL', () => {
        expect(data.FSL2SPARQL('nobel:LaureateAward/nobel:year/*', 'prop1', 'entrypoint')).to.equal('?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label  ?labelprop1 } . ')
        expect(data.FSL2SPARQL('nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*', 'prop2', 'entrypoint')).to.equal('?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label  ?labelprop2 } . ')
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
        expect(data.makeQuery('nobel:LaureateAward', config1))
            .to.equal(`SELECT DISTINCT ?prop1 ?labelprop1 (COUNT(?prop1) as ?countprop1) ?prop2 ?labelprop2 (COUNT(?prop2) as ?countprop2) 
WHERE { ?entrypoint rdf:type nobel:LaureateAward . 
?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label  ?labelprop1 } . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label  ?labelprop2 } . 
} GROUP BY ?prop1 ?labelprop1 ?prop2 ?labelprop2 ORDER BY ?prop1 ?countprop1 ?prop2 ?countprop2 `)
        expect(data.makeQuery('nobel:LaureateAward', config2))
            .to.equal(`SELECT DISTINCT ?entrypoint ?prop1 ?labelprop1 ?prop2 ?labelprop2 
WHERE { ?entrypoint rdf:type nobel:LaureateAward . 
?entrypoint nobel:year ?prop1 . OPTIONAL { ?prop1 rdfs:label  ?labelprop1 } . ?entrypoint nobel:laureate ?prop2inter1 . ?prop2inter1 rdf:type nobel:Laureate . ?prop2inter1 foaf:gender ?prop2 . OPTIONAL { ?prop2 rdfs:label  ?labelprop2 } . 
} GROUP BY ?entrypoint ?prop1 ?labelprop1 ?prop2 ?labelprop2 ORDER BY ?prop1 ?prop2 `)
    })
})
