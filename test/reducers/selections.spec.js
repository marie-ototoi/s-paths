import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import selections from '../../src/reducers/selections'

chai.use(sinonChai)
const newState = [{
    selector: '#toto',
    props: [{
        path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
        value: 'female'
    }],
    zone: 'main'
}]
const initialState = []

describe('reducers/selections', () => {
    it('should handle initial state', () => {
        expect(selections(undefined, { })).to.deep.equal(initialState)
        expect(selections(newState, { })).to.deep.equal(newState)
    })
    it('should handle ADD_SELECTION', () => {
        let addAction = {
            type: 'ADD_SELECTION',
            elements: [
                {
                    selector: '#topic',
                    props: [{
                        path: 'nobel:LaureateAward/nobel:year/*', 
                        value: '1945'
                    }],
                    zone: 'main'
                }
            ],
            zone: 'main'
        }
        expect(selections(undefined, addAction))
            .to.deep.equal([
                {
                    selector: '#topic',
                    props: [{
                        path: 'nobel:LaureateAward/nobel:year/*', 
                        value: '1945'
                    }],
                    zone: 'main'
                }
            ])
        expect(selections(newState, addAction))
            .to.deep.equal([
                {
                    selector: '#toto',
                    props: [{
                        path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
                        value: 'female'
                    }],
                    zone: 'main'
                },
                {
                    selector: '#topic',
                    props: [{
                        path: 'nobel:LaureateAward/nobel:year/*', 
                        value: '1945'
                    }],
                    zone: 'main'
                }
            ])
    })
    it('should handle REMOVE_SELECTION', () => {
        let removeAction = {
            type: 'REMOVE_SELECTION',
            elements: [{ selector: '#topic' }, { selector: '#toto' }],
            zone: 'main'
        }
        let state = [
            { 
                selector: '#toto',
                props: [{
                    path: 'nobel:LaureateAward/nobel:laureate/nobel:Laureate/foaf:gender/*',
                    value: 'female'
                }],
                zone: 'main'
            },
            {
                selector: '#topic',
                props: [{
                    path: 'nobel:LaureateAward/nobel:year/*',
                    value: '1945'
                }],
                zone: 'main'
            }
        ]
        expect(selections(undefined, removeAction))
            .to.deep.equal([])
        expect(selections(state, removeAction))
            .to.deep.equal([])
    })
})
