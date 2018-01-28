import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import data from '../../src/lib/dataLib'

const dataSet1 = {
    present: [
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
            },
            status: 'active'
        },
        {
            zone: 'main',
            statements: {},
            status: 'transition'
        },
        {
            zone: 'aside',
            statements: {},
            status: 'active'
        }
    ]
}
//const dataSet2 = testSet.load('Timeline').results.bindings

describe('lib/data', () => {

    it('should return true if data is populated for a specific zone', () => {
        expect(data.areLoaded(dataSet1, 'main', 'active')).to.equal(true)
        expect(data.areLoaded(dataSet1, 'aside', 'active')).to.equal(false)
    })
    it('should return data results for a specific zone', () => {
        expect(data.getResults(dataSet1, 'main', 'active')).to.deep.equal([{ prop1: 'toto' }])
        expect(data.getResults(dataSet1, 'aside', 'active')).to.deep.equal([])
    })
    it('should return data headings for a specific zone', () => {
        expect(data.getHeadings(dataSet1, 'main', 'active')).to.deep.equal(['prop1'])
        expect(data.getHeadings(dataSet1, 'aside', 'active')).to.deep.equal([])
    })
    /* it('should return a nested set of data, optimizing grouping by date', () => {
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 150).length).to.deep.equal(113)
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 100).length).to.deep.equal(12)
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 5).length).to.deep.equal(2)
    }) 
    it('should add values of specified props when grouped', () => {
        expect(data.groupTimeData(dataSet1, 'prop1', 'Y', 150, ['countprop2', 'countprop3'])[0].countprop2).to.equal(6)
        expect(data.groupTimeData(dataSet1, 'prop1', 'Y', 150, ['countprop2', 'countprop3'])[2].countprop2).to.equal(7)
    })*/

    it('should return specified number of rounded ranges between two values', () => {
        expect(data.getThresholds(116, 145380, 6)).to.deep.equal([[1, 25000], [25001, 50000], [50001, 75000], [75001, 100000], [100001, 125000], [125001, 150000]])
        expect(data.getThresholds(43500, 145380, 6)).to.deep.equal([[40001, 60000], [60001, 80000], [80001, 100000], [100001, 120000], [120001, 140000], [140001, 160000]])
    })
})
