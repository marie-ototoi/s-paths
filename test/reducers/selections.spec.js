import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import selections from '../../src/reducers/selections'

chai.use(sinonChai)
const savedState = [{
    path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
    value: 'female'
}]
const initialState = []

describe('reducers/selections', () => {
    it('should handle initial state', () => {
        expect(selections(undefined, { })).to.deep.equal(initialState)
        expect(selections(savedState, { })).to.deep.equal(savedState)
    })
    it('should handle ADD_SELECTION', () => {
        let addAction = {
            type: 'ADD_SELECTION',
            selector: '#topic',
            path: 'nobel:LaureateAward/nobel:year/*', 
            value: '1945'
        }
        expect(selections(undefined, addAction))
            .to.deep.equal([
                {
                    selector: '#topic',
                    path: 'nobel:LaureateAward/nobel:year/*',
                    value: '1945'
                }
            ])
        expect(selections(savedState, addAction))
            .to.deep.equal([
                { 
                    path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
                    value: 'female'
                },
                { 
                    selector: '#topic',
                    path: 'nobel:LaureateAward/nobel:year/*',
                    value: '1945'
                }
            ])
    })
    it('should handle REMOVE_SELECTION', () => {
        let removeAction = {
            type: 'REMOVE_SELECTION',
            selector: '#topic'
        }
        let state = [
            {
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
                value: 'female'
            },
            {
                selector: '#topic',
                path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
                value: 'female'
            }
        ]
        expect(selections(undefined, removeAction))
            .to.deep.equal([])
        expect(selections(state, removeAction))
            .to.deep.equal([
                {
                    path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
                    value: 'female'
                }
            ])
    })
})
