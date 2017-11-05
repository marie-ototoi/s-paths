import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import dataset from '../../src/reducers/dataset'

chai.use(sinonChai)

describe('reducers/dataset', () => {
    it('should handle initial state', () => {
        expect(dataset(undefined, { })).to.have.props
    })
    it('should handle SET_QUERY', () => {

    })
    it('should handle SET_PROPS', () => {

    })
    it('should handle SET_DATA', () => {

    })
})
