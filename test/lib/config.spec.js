import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import config from '../../src/lib/config'

describe('lib/config', () => {
    it('should return a combined list of matches', () => {
        let inputList = [
            [{ path: 'a' }, { path: 'a2' }], 
            [{ path: 'b' }, { path: 'b2' }], 
            [{ path: 'c' }]
        ]
        let addList = [{ path: 'd' }, { path: 'e' }]
        let expectedList = [
            [{ path: 'a' }, { path: 'a2' }, { path: 'd' }],
            [{ path: 'a' }, { path: 'a2' }, { path: 'e' }],
            [{ path: 'b' }, { path: 'b2' }, { path: 'd' }],
            [{ path: 'b' }, { path: 'b2' }, { path: 'e' }],
            [{ path: 'c' }, { path: 'd' }],
            [{ path: 'c' }, { path: 'e' }]
        ]
        expect(config.findAllMatches(inputList, addList)).to.deep.equal(expectedList)
    })
    it('should true if value is in range, else false', () => {
        let range = [5,8]
        expect(config.inRange(2, range)).to.be.false
        expect(config.inRange(6, range)).to.be.true
        expect(config.inRange(10, range)).to.be.false
    })
    it('should true if value is under range, else false', () => {
        let range = [5,8]
        expect(config.underRange(2, range)).to.be.true
        expect(config.underRange(6, range)).to.be.false
        expect(config.underRange(10, range)).to.be.false
    })
    it('should true if value is over range, else false', () => {
        let range = [5,8]
        expect(config.overRange(2, range)).to.be.false
        expect(config.overRange(6, range)).to.be.false
        expect(config.overRange(10, range)).to.be.true
    })
    it('should true if value is over range, else false', () => {
        let unique = {
            optimal: [5,10],
            min: 3,
            max: 16
        }
        expect(config.getDeviationCost(unique, 10)).to.equal(10/6)
    })

})
