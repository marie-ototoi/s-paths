import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import display from '../../src/reducers/display'

chai.use(sinonChai)

describe('reducers/display', () => {
    it('should handle initial state', () => {
        expect(display(undefined, { }).screen.width).to.equal(10)
    })
    it('should handle SET_DISPLAY', () => {
        let addAction =  {
            type: 'SET_DISPLAY',
            screen: { width: 100, height: 100 }
        }
        // console.log(display(undefined, addAction))
        expect(display(undefined, addAction).screen.width)
            .to.equal(100)
        expect(display(undefined, addAction).viewBox.width)
            .to.equal(10)
    })
})
