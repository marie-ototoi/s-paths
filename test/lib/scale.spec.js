import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import scale from '../../src/lib/scale'

const displayDef = {
    dev: { x: 0, y: 0, width: 100, height: 100},
    full: { x: 35, y: 35, width: 40, height: 40},
    main: { x: 35, y: 35, width: 30, height: 30},
    aside: { x: 70, y: 35, width: 30, height: 30}
}
const gridDef = {
    xPoints : [0, 30, 35, 65, 70, 85, 100],
    yPoints : [0, 30, 35, 65, 70, 85, 100]
}
const screens = [
    { width: 1400, height : 700 },
    { width: 1500, height : 650 }
]
const stages = [
    { width: 4666, height : 2333 },
    { width: 1400, height : 700 },
    { width: 3500, height : 1750 }
]

describe('svg/scale', () => {
    it('should return the full dimensions of the stage based on the viewbox definition in percentage and the screen dimensions', () => {
        let stage1 = scale.scaleStage(displayDef.dev, screens[0])
        let stage2 = scale.scaleStage(displayDef.full, screens[0])
        let stage3 = scale.scaleStage(displayDef.main, screens[0])
        expect(stage1).to.deep.equal({ width: 1400, height: 700 })
        expect(stage2).to.deep.equal({ width: 3500, height: 1750 })
        expect(stage3).to.deep.equal({ width: 4666, height: 2333 })
    })

    it('should return the actual dimensions of the viewbox based on the viewbox definition in percentage and the stage dimensions', () => {
        
        let vb1 = scale.scaleViewBox(displayDef.dev, stages[0])
        let vb2 = scale.scaleViewBox(displayDef.full, stages[0])
        let vb3 = scale.scaleViewBox(displayDef.main, stages[1])
        let vb4 = scale.scaleViewBox(displayDef.aside, stages[2])
        expect(vb1).to.deep.equal({ width: 4666, height: 2333, x: 0, y: 0 })
        expect(vb2).to.deep.equal({ width: 1866, height: 933, x: 1633, y: 816 })
        expect(vb3).to.deep.equal({ width: 420, height: 210, x: 490, y: 245 })
        expect(vb4).to.deep.equal({ width: 1050, height: 525, x: 2450, y: 612 })
    })

    it('should return actual values of a point based on the point definition in percentage and the stage dimensions', () => {
        let pointX = scale.scaleX(10, stages[1])
        let pointY = scale.scaleY(10, stages[1])
        expect(pointX).to.equal(140)
        expect(pointY).to.equal(70)
    })
    it('should return actual values for lists of xPoints and yPoints defined in percentage', () => {
        let grid = scale.getGrid(gridDef, stages[1])
        expect(grid).to.deep.equal({
            xPoints: [0, 420, 490, 910, 980, 1190, 1400],
            yPoints: [0, 210, 245, 455, 490, 595, 700]
        })
    })
})
