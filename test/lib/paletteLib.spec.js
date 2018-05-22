import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import * as palette from '../../src/lib/paletteLib'

const state1 = [{
    properties: [],
    colors: ['#e8bcbd', '#e39d9d']
},{
    properties: [],
    colors: ['#f58ea9', '#e35168']
}]
const state2 = [{
    properties: ['path1'],
    colors: ['#e8bcbd', '#e39d9d']
},{
    properties: [],
    colors: ['#f58ea9', '#e35168']
}]
const state3 = [{
    properties: ['path1', 'path1'],
    colors: ['#e8bcbd', '#e39d9d']
},{
    properties: ['path1'],
    colors: ['#f58ea9', '#e35168']
}]

describe('lib/palette', () => {
    it('should return the index of the next less attributed palette', () => {
        expect(palette.getNextPaletteIndex(state1)).to.equal(0)
        expect(palette.getNextPaletteIndex(state2)).to.equal(1)
        expect(palette.getNextPaletteIndex(state3)).to.equal(1)
    })

})
