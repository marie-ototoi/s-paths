import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import palettes from '../../src/reducers/palettes'

chai.use(sinonChai)

const savedState = [
    { 
        properties: [],
        colors: ['#e8bcbd', '#e39d9d', '#e17d7f', '#c65454']
    },{
        properties: [],
        colors: ['#f58ea9', '#e35168']
    }
]

describe('reducers/palettes', () => {
    it('should handle initial state', () => {
        expect(palettes(undefined, { })[0].colors[0]).to.equal('#00441b')
        expect(palettes(savedState, { })).to.deep.equal(savedState)
    })
    it('should handle SET_PROP_PALETTE', () => {
        let addAction = {
            type: 'SET_PROP_PALETTE',
            property: 'nobel:LaureateAward/nobel:year/*',
            index: 1
        }
        expect(palettes(savedState, addAction))
            .to.deep.equal([
                {
                    properties: [],
                    colors: ['#e8bcbd', '#e39d9d', '#e17d7f', '#c65454']
                },
                {
                    properties: ['nobel:LaureateAward/nobel:year/*'],
                    colors: ['#f58ea9', '#e35168']
                }
            ])
    })
})
