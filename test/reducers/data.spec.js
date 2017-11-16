import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import data from '../../src/reducers/data'

chai.use(sinonChai)

describe('reducers/data', () => {
    it('should handle initial state', () => {
        expect(data(undefined, { })[0].zone).to.equal('main')
    })
    /*it('should handle SET_DATA', () => {

    })
    it('should handle ADD_DATAZONE', () => {

    })*/
})
