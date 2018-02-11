import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import data from '../../src/lib/dataLib'

const dataSet1 = {
    present: [
        {
            zone: 'main',
            statements: {
                results: {
                    bindings: [
                        { prop1: 'toto' }
                    ]
                },
                head: {
                    vars: ['prop1']
                }
            },
            status: 'active'
        },
        {
            zone: 'main',
            statements: {},
            status: 'transition'
        },
        {
            zone: 'aside',
            statements: {},
            status: 'active'
        }
    ]
}
//const dataSet2 = testSet.load('Timeline').results.bindings

describe('lib/data', () => {

    it('should return true if data is populated for a specific zone', () => {
        expect(data.areLoaded(dataSet1, 'main', 'active')).to.equal(true)
        expect(data.areLoaded(dataSet1, 'aside', 'active')).to.equal(false)
    })
    it('should return data results for a specific zone', () => {
        expect(data.getResults(dataSet1, 'main', 'active')).to.deep.equal([{ prop1: 'toto' }])
        expect(data.getResults(dataSet1, 'aside', 'active')).to.deep.equal([])
    })
    it('should return data headings for a specific zone', () => {
        expect(data.getHeadings(dataSet1, 'main', 'active')).to.deep.equal(['prop1'])
        expect(data.getHeadings(dataSet1, 'aside', 'active')).to.deep.equal([])
    })
    /* it('should return a nested set of data, optimizing grouping by date', () => {
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 150).length).to.deep.equal(113)
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 100).length).to.deep.equal(12)
        expect(data.groupTimeData(dataSet2, 'prop1', 'Y', 5).length).to.deep.equal(2)
    }) 
    it('should add values of specified props when grouped', () => {
        expect(data.groupTimeData(dataSet1, 'prop1', 'Y', 150, ['countprop2', 'countprop3'])[0].countprop2).to.equal(6)
        expect(data.groupTimeData(dataSet1, 'prop1', 'Y', 150, ['countprop2', 'countprop3'])[2].countprop2).to.equal(7)
    })*/

    it('should return specified number of rounded ranges between two values', () => {
        expect(data.getThresholds(116, 145380, 6)).to.deep.equal([[1, 25000], [25001, 50000], [50001, 75000], [75001, 100000], [100001, 125000], [125001, 150000]])
        expect(data.getThresholds(43500, 145380, 6)).to.deep.equal([[40001, 60000], [60001, 80000], [80001, 100000], [100001, 120000], [120001, 140000], [140001, 160000]])
    })

    it('should split a rectangle in required number of parts', () => {
        let originalRectangle = { x: 10, y: 15, width: 100, height: 200 }
        let parts = [
            { name: 'a', size: 10 },
            { name: 'b', size: 5 },
            { name: 'c', size: 2 }
        ]
        let tree = data.splitRectangle(originalRectangle, parts)
        expect([tree.children[0].x0, tree.children[0].y0, tree.children[0].x1, tree.children[0].y1]).to.deep.equal([0, 0, 100, 117])
        expect([tree.children[1].x0, tree.children[1].y0, tree.children[1].x1, tree.children[1].y1]).to.deep.equal([0, 118, 71, 200])
        expect([tree.children[2].x0, tree.children[2].y0, tree.children[2].x1, tree.children[2].y1]).to.deep.equal([72, 118, 100, 200])        
    })

    it('should identify the origin and target groups of each piece of delta data', () => {
        let originElements = [
            {"zone":{"x1":1,"y1":257,"x2":23,"y2":259,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate571","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/571"},"color":"hsl(230, 100%, 45%)","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":25.36842105263158,"y1":257,"x2":47.368421052631575,"y2":259,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate463","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/463"},"color":"hsl(210, 100%, 40%)","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":25.36842105263158,"y1":255,"x2":47.368421052631575,"y2":257,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate462","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/462"},"color":"hsl(210, 100%, 40%)","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":25.36842105263158,"y1":253,"x2":47.368421052631575,"y2":255,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate475","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/475"},"color":"hsl(210, 100%, 40%)","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":25.36842105263158,"y1":251,"x2":47.368421052631575,"y2":253,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate466","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/466"},"color":"hsl(230, 100%, 45%)","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":257,"x2":71.73684210526315,"y2":259,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate573","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/573"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":255,"x2":71.73684210526315,"y2":257,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate574","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/574"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":253,"x2":71.73684210526315,"y2":255,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate471","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/471"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":251,"x2":71.73684210526315,"y2":253,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate464","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/464"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":249,"x2":71.73684210526315,"y2":251,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate474","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/474"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":247,"x2":71.73684210526315,"y2":249,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate478","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/478"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":245,"x2":71.73684210526315,"y2":247,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate580","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/580"},"color":"hsl(230, 100%, 45%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":243,"x2":71.73684210526315,"y2":245,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate576","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/576"},"color":"hsl(230, 100%, 45%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":241,"x2":71.73684210526315,"y2":243,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate572","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/572"},"color":"hsl(230, 100%, 45%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":239,"x2":71.73684210526315,"y2":241,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate15","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/15"},"color":"hsl(230, 100%, 45%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":237,"x2":71.73684210526315,"y2":239,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate569","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/569"},"color":"hsl(230, 100%, 45%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":49.73684210526316,"y1":235,"x2":71.73684210526315,"y2":237,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate164","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/164"},"color":"hsl(230, 100%, 45%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":74.10526315789474,"y1":257,"x2":96.10526315789474,"y2":259,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate472","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/472"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":74.10526315789474,"y1":255,"x2":96.10526315789474,"y2":257,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate465","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/465"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":74.10526315789474,"y1":253,"x2":96.10526315789474,"y2":255,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate298","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/298"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":74.10526315789474,"y1":251,"x2":96.10526315789474,"y2":253,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate473","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/473"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":74.10526315789474,"y1":249,"x2":96.10526315789474,"y2":251,"width":22,"height":2},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate492","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/492"},"color":"hsl(210, 100%, 40%)","opacity":1,"shape":"rectangle"}
        ]
        let targetElements = [
            {"zone":{"x1":1,"y1":195,"x2":28,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1830_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1830,1830],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":60.900000000000006,"y1":195,"x2":87.9,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1832_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1832,1832],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":90.85,"y1":195,"x2":117.85,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1833_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1833,1833],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":150.75,"y1":195,"x2":177.75,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1835_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1835,1835],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":210.64999999999998,"y1":195,"x2":237.64999999999998,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1837_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1837,1837],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":240.60000000000002,"y1":195,"x2":267.6,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1838_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1838,1838],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":270.55,"y1":195,"x2":297.55,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1839_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1839,1839],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":330.45000000000005,"y1":195,"x2":357.45000000000005,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1841_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1841,1841],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":360.4,"y1":195,"x2":387.4,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1842_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1842,1842],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":390.35,"y1":0,"x2":417.35,"y2":194,"width":27,"height":194},"selector":"heatmap_element_p1_1843_p2_female","query":{"type":"set","value":[{"category":"datetime","value":[1843,1843],"propName":"prop1"},{"category":"text","value":"female","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":390.35,"y1":195,"x2":417.35,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1843_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1843,1843],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":420.29999999999995,"y1":195,"x2":447.29999999999995,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1844_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1844,1844],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":450.25,"y1":195,"x2":477.25,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1845_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1845,1845],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FBC02D","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":480.20000000000005,"y1":195,"x2":507.20000000000005,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1846_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1846,1846],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":510.15,"y1":195,"x2":537.15,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1847_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1847,1847],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"},
            {"zone":{"x1":570.05,"y1":195,"x2":597.05,"y2":389,"width":27,"height":194},"selector":"heatmap_element_p1_1849_p2_male","query":{"type":"set","value":[{"category":"datetime","value":[1849,1849],"propName":"prop1"},{"category":"text","value":"male","propName":"prop2"}]},"color":"#FDD835","opacity":0.5,"shape":"rectangle"}
            /* {"zone":{"x1":1,"y1":216,"x2":22,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate580","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/580"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":1,"y1":173,"x2":22,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate573","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/573"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":47.300000000000004,"y1":216,"x2":68.30000000000001,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate572","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/572"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":47.300000000000004,"y1":173,"x2":68.30000000000001,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate574","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/574"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":70.45,"y1":216,"x2":91.45,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate471","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/471"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":70.45,"y1":173,"x2":91.45,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate464","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/464"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":116.75,"y1":216,"x2":137.75,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate576","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/576"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":116.75,"y1":173,"x2":137.75,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate164","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/164"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":163.04999999999998,"y1":216,"x2":184.04999999999998,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate474","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/474"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":163.04999999999998,"y1":173,"x2":184.04999999999998,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate15","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/15"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":186.20000000000002,"y1":216,"x2":207.20000000000002,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate478","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/478"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":209.35,"y1":216,"x2":230.35,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate569","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/569"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":255.65000000000003,"y1":216,"x2":276.65000000000003,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate303","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/303"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":255.65000000000003,"y1":173,"x2":276.65000000000003,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate492","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/492"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":278.8,"y1":216,"x2":299.8,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate8","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/8"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":301.95,"y1":216,"x2":322.95,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate465","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/465"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":301.95,"y1":173,"x2":322.95,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate472","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/472"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":301.95,"y1":130,"x2":322.95,"y2":173,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate298","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/298"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":301.95,"y1":87,"x2":322.95,"y2":130,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate297","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/297"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":301.95,"y1":44,"x2":322.95,"y2":87,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate468","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/468"},"color":"hsl(340, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":325.09999999999997,"y1":216,"x2":346.09999999999997,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate590","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/590"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":325.09999999999997,"y1":173,"x2":346.09999999999997,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate473","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/473"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":348.25,"y1":216,"x2":369.25,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate480","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/480"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":348.25,"y1":173,"x2":369.25,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate1","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/1"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},{"zone":{"x1":348.25,"y1":130,"x2":369.25,"y2":173,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate588","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/588"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":348.25,"y1":87,"x2":369.25,"y2":130,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate301","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/301"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":348.25,"y1":44,"x2":369.25,"y2":87,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate300","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/300"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":348.25,"y1":1,"x2":369.25,"y2":44,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate12","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/12"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":371.40000000000003,"y1":216,"x2":392.40000000000003,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate578","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/578"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":371.40000000000003,"y1":173,"x2":392.40000000000003,"y2":216,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate575","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/575"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":394.55,"y1":216,"x2":415.55,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate169","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/169"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"},
            {"zone":{"x1":440.84999999999997,"y1":216,"x2":461.84999999999997,"y2":259,"width":21,"height":43},"selector":"timeline_element_httpdatanobelprizeorgresourcelaureate296","query":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/296"},"color":"hsl(280, 100%, 30%)","opacity":1,"shape":"rectangle"} */
        ]
        let deltaData = [
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/571"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1817-11-30"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/463"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1822-05-20"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/466"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1828-03-18"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/462"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1828-05-08"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/475"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1829-07-26"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/580"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1830-03-15"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/573"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1830-09-08"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/574"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1832-04-19"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/572"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1832-12-08"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/464"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1833-02-19"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/471"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1833-09-20"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/576"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1835-07-27"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/164"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1835-10-31"},"prop2":{"type":"literal","value":"male"},"newprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1835-10-31"},"newprop2":{"type":"literal","value":"male"},"newprop3":{"type":"uri","value":"http://data.nobelprize.org/resource/university/Munich_University"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/474"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1837-04-21"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/15"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1837-11-23"},"prop2":{"type":"literal","value":"male"},"newprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1837-11-23"},"newprop2":{"type":"literal","value":"male"},"newprop3":{"type":"uri","value":"http://data.nobelprize.org/resource/university/Amsterdam_University"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/478"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1838-04-28"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/569"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1839-03-16"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/303"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1841-08-25"},"prop2":{"type":"literal","value":"male"},"newprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1841-08-25"},"newprop2":{"type":"literal","value":"male"},"newprop3":{"type":"uri","value":"http://data.nobelprize.org/resource/university/Berne_University"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/492"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1841-12-20"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/8"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1842-11-12"},"prop2":{"type":"literal","value":"male"},"newprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1842-11-12"},"newprop2":{"type":"literal","value":"male"},"newprop3":{"type":"uri","value":"http://data.nobelprize.org/resource/university/Royal_Institution_of_Great_Britain"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/465"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1843-05-21"},"prop2":{"type":"literal","value":"male"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/472"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1843-05-21"},"prop2":{"type":"literal","value":"male"},"newprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1843-05-21"},"newprop2":{"type":"literal","value":"male"},"newprop3":{"type":"uri","value":"http://data.nobelprize.org/resource/university/Sorbonne_University"}}
        ]
        let origin4 = data.getDeltaIndex(deltaData[4], originElements, { entrypoint: true, isTarget: false })
        let target4 = data.getDeltaIndex(deltaData[4], targetElements, { entrypoint: false, isTarget: true })
        let origin10 = data.getDeltaIndex(deltaData[10], originElements, { entrypoint: true, isTarget: false })
        let target10 = data.getDeltaIndex(deltaData[10], targetElements, { entrypoint: false, isTarget: true })
        expect(origin4).to.equal(3)
        expect(target4).to.equal(undefined)
        expect(origin10).to.equal(7)
        expect(target10).to.equal(2)
    })
})
