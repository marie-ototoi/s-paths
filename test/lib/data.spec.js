import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import data from '../../src/lib/data'
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
    it('should return a nested set of data, optimizing grouping by date', () => {
        expect(data.groupTimeData(dataSet2, 'prop1', 'YYYY', 150).length).to.deep.equal(113)
        expect(data.groupTimeData(dataSet2, 'prop1', 'YYYY', 100).length).to.deep.equal(12)
        expect(data.groupTimeData(dataSet2, 'prop1', 'YYYY', 5).length).to.deep.equal(2)
    })
})
