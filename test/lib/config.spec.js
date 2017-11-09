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

})
