import chai, {expect} from 'chai'
import sinonChai from 'sinon-chai'
import views from '../../src/reducers/views'

chai.use(sinonChai)

describe('reducers/views', () => {
    let initialState
    beforeEach(() => {
        initialState = [
            { id: 'Barchart_A' },
            { id: 'StackedChart' },
            { id: 'Chord' },
            { id: 'Heatmap' }
        ]
    })
    it('should handle initial state', () => {
        expect(views(undefined, { })[0].id).to.equal('StackedChart')
    })
    /* lit('should handle SELECT_VIEWS', () => {
        et action =  {
            type: 'SELECT_VIEWS',
            stats: []
        }
        expect(views(initialState, action))
            .to.deep.equal([
                { id: 'Barchart_A', selected: false },
                { id: 'StackedChart', selected: true },
                { id: 'Chord', selected: true},
                { id: 'Heatmap', selected: false}
            ])
    })
    it('should handle DISPLAY_VIEWS', () => {
        let action = {
            type: 'DISPLAY_VIEWS',
            ids: ['StackedChart']
        }
        expect(views(initialState, action))
            .to.deep.equal([
                { id: 'Barchart_A', displayed: false },
                { id: 'StackedChart', displayed: true },
                { id: 'Chord', displayed: false },
                { id: 'Heatmap', displayed: false }
            ])
    }) */
})
