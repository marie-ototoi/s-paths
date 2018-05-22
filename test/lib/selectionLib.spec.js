import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import * as selectionLib from '../../src/lib/selectionLib'

const selections = [
    { selector: 'book_137', zone: 'main' },
    { selector: 'book_143', zone: 'main' },
    { selector: 'book_233', zone: 'main' },
    { selector: 'book_324', zone: 'main' }
]

describe('lib/scale', () => {
    it('should return true if the element is in the selection, else false', () => {
        expect(selectionLib.isSelected({ selector: 'book_137' }, 'main', selections)).to.equal(true)
        expect(selectionLib.isSelected({ selector: 'book_900' }, 'main', selections)).to.equal(false)
    })
    it('should return true if all the elements are in the selection, else false', () => {
        expect(selectionLib.areSelected([{ selector: 'book_137' }], 'main', selections)).to.equal(true)
        expect(selectionLib.areSelected([{ selector: 'book_137' }, { selector: 'book_324' }], 'main', selections)).to.equal(true)
        expect(selectionLib.areSelected([{ selector: 'book_900' }, { selector: 'book_324' }], 'main', selections)).to.equal(false)
        // expect selectionLib.isSelected(selector, zone, selections)
    })
})
