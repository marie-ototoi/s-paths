import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import selectionLib from '../../src/lib/selectionLib'
chai.use(sinonChai)

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
    it('should return the position of a point after applying given rotation (around 0,0)', () => {
        expect(selectionLib.getRotatedPoint({ x: 0, y: 0 }, 90)).to.deep.equal({ x: -0, y: 0 })
        expect(selectionLib.getRotatedPoint({ x: 10, y: 0 }, 90)).to.deep.equal({ x: 0, y: 10 })
    })
    it('should return true if one of the points in a path collides with rectangle', () => {
        expect(selectionLib.detectPathCollision(
            [
                { x: 0, y: 0 },
                { x: 2.3, y: 8.83 },
                { x: -5.46, y: 12.3 }
            ],
            { x1: 10, x2: 12, y1: 0, y2: 3 }
        )).to.equal(false)
        expect(selectionLib.detectPathCollision(
            [
                { x: 0, y: 0 },
                { x: 2.3, y: 8.83 },
                { x: -5.46, y: 12.3 }
            ],
            { x1: 20, x2: 22, y1: 30, y2: 34 }
        )).to.equal(false)
    })
    it('should interpolate points on a path', () => {
        expect(selectionLib.getInterpolatedPoints(
            [
                { x: 0, y: 0 },
                { x: 2.3, y: 8.83 },
                { x: -5.46, y: 12.3 }
            ], 
            4
        )).to.deep.equal([
            { x: 0, y: 0 },
            { x: 0.42, y: 5.29 },
            { x:-1.4, y: 9.39 },
            { x: -5.46, y: 12.3 }
        ])
    })
    it('should convert a path to a series of points', () => {
        expect(selectionLib.pathToPoints('M0,0q36,-168,202,-42q70,50,83,127')).to.deep.equal([
            { x: 0, y: 0 },
            { x: 26.13, y: -65.62 },
            { x: 68.5, y: -94.5 },
            { x: 127.13, y: -86.62 },
            { x: 202, y: -42 },
            { x: 233.44, y: -15.31 },
            { x: 257.75, y: 14.75 },
            { x: 274.94, y: 48.19 },
            { x: 285, y: 85 }          
        ])
    })
})
