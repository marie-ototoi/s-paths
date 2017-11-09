import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import selections from '../../src/reducers/selections'

chai.use(sinonChai)
const savedState = [{ query: 'bibo:Book' }]
const initialState = []

describe('reducers/selections', () => {
    it('should handle initial state', () => {
        expect(selections(undefined, { })).to.deep.equal(initialState)
        expect(selections(savedState, { })).to.deep.equal(savedState)
    })
    it('should handle ADD_SELECTION', () => {
        let addAction =  { 
            type: 'ADD_SELECTION', 
            selector: '#topic', 
            query: 'WHERE ?resource dct:subject ?any' 
        }
        expect(selections(undefined, addAction))
            .to.deep.equal([
                { selector: '#topic', query: 'WHERE ?resource dct:subject ?any' }
            ])
        expect(selections(savedState, addAction))
            .to.deep.equal([
                { query: 'bibo:Book' },
                { selector: '#topic', query: 'WHERE ?resource dct:subject ?any' }
            ])
    })
    it('should handle REMOVE_SELECTION', () => {
        let removeAction =  { 
            type: 'REMOVE_SELECTION',
            selector: '#topic'
        }
        let state = [
            { query: 'bibo:Book' },
            { selector: '#topic', query: 'WHERE ?resource dct:subject ?any' }
        ]
        expect(selections(undefined, removeAction))
            .to.deep.equal([])
        expect(selections(state, removeAction))
            .to.deep.equal([
                { query: 'bibo:Book' }
            ])
    })
})
