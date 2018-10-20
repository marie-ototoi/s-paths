import chai, {expect} from 'chai'
import sinonChai from 'sinon-chai'
import * as data from '../../src/lib/dataLib'

chai.use(sinonChai)

const dataSet1 = {
    present: {
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
    past: {}
}
const dataSet2 = [
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb11885977m#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"-106"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb11940325v#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"742"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb11908143b#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1304"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb119042727#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1331"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb11896834h#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1363"},"prop2":{"type":"literal","value":"female"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb120074247#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1401"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb13482403j#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1466"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb11987560f#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1469"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb12517771n#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1501"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb12170907z#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1503"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb134909745#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1518"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb11891892g#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1519"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb125151647#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1519"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb12175956c#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1533"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb12368701d#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1541"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb118957747#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1547"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb144367352#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1551"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb12168909c#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1555"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb13957453j#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1561"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb14827633t#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1561"},"prop2":{"type":"literal","value":"male"}},
    {"entrypoint":{"type":"uri","value":"http://data.bnf.fr/ark:/12148/cb119246079#foaf:Person"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1564"},"prop2":{"type":"literal","value":"male"}}
]
const dataSet3 = [
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/ara"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/ben"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/bul"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/cat"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/cze"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"3"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/dan"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/dut"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"6"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/eng"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"42"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/fin"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/fre"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"160"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/frm"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/fro"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/ger"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"39"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/grc"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/gre"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/heb"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/hin"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"4"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/hrv"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/hun"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"6"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/ita"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"20"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/lat"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"11"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/ota"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/per"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/pol"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/por"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"4"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/rum"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/rus"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"12"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/spa"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"14"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/srp"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1"}},
    {"prop1":{"type":"uri","value":"http://id.loc.gov/vocabulary/iso639-2/yid"},"countprop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"2"}}
]


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
    })
    it('should return a nested set of data', () => {
        let groupA = data.nestData(dataSet2, [{ propName: 'prop1', category: 'datetime', max: 50 }, { propName: 'prop2', category: 'text' }])
        let groupB = data.nestData(dataSet2, [{ propName: 'prop1', category: 'datetime', forceGroup: 'decade' }])
        let groupC = data.nestData(dataSet2, [{ propName: 'prop1', category: 'datetime', forceGroup: 'year' }])
        expect(groupA.map(group => group.key)).to.deep.equal(['100', '700', '1300', '1400', '1500', 1600])
        expect(groupB.map(group => group.key)).to.deep.equal(['100', '740', '1300', '1330', '1360', '1400', '1460', '1500', '1510', '1530', '1540', '1550', '1560', 1570])
        expect(groupC.map(group => group.key)).to.deep.equal(['106', '742', '1304', '1331', '1363', '1401', '1466', '1469', '1501', '1503', '1518', '1519', '1533', '1541', '1547', '1551', '1555', '1561', '1564', 1565])
        expect(groupA[0].values[0].key).to.equal('male')
        expect(groupA[2].values[0].key).to.equal('female')
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

    it('should return a string that can be used as id', () => {
        expect(data.makeId('http://data.nobelprize.org/resource/laureate/571')).to.equal('httpdatanobelprizeorgresourcelaureate571')
        expect(data.makeId('http://data.nobelprize.org/resource/laureate/210')).to.equal('httpdatanobelprizeorgresourcelaureate210')
    })

    it('should deduplicate data based on specified prop()', () => {
        let input = [
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/571"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1817-11-30"},"prop2":{"type":"literal","value":"2"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/463"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1822-05-20"},"prop2":{"type":"literal","value":"2"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/466"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1828-03-18"},"prop2":{"type":"literal","value":"1"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/571"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1828-05-08"},"prop2":{"type":"literal","value":"2"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/580"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1830-03-15"},"prop2":{"type":"literal","value":"1"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/580"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1829-07-26"},"prop2":{"type":"literal","value":"2"}}
        ]
        let output1 = [
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/571"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1817-11-30"},"prop2":{"type":"literal","value":"2"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/463"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1822-05-20"},"prop2":{"type":"literal","value":"2"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/466"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1828-03-18"},"prop2":{"type":"literal","value":"1"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/580"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1830-03-15"},"prop2":{"type":"literal","value":"1"}}
        ]
        let output2 = [
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/571"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1817-11-30"},"prop2":{"type":"literal","value":"2"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/463"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1822-05-20"},"prop2":{"type":"literal","value":"2"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/466"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1828-03-18"},"prop2":{"type":"literal","value":"1"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/580"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1830-03-15"},"prop2":{"type":"literal","value":"1"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/580"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#date","value":"1829-07-26"},"prop2":{"type":"literal","value":"2"}}
        ]
        expect(data.deduplicate(input, ['entrypoint'])).to.deep.equal(output1)
        expect(data.deduplicate(input, ['entrypoint', 'prop2'])).to.deep.equal(output2)
    })

    it('should split a rectangle in required number of parts', () => {
        let originalRectangle = { x1: 10, y1: 15, width: 100, height: 200 }
        let parts = [
            { name: 'a', size: 10 },
            { name: 'b', size: 5 },
            { name: 'c', size: 2 }
        ]
        let tree = data.splitRectangle(originalRectangle, parts)
        // console.log(tree)
        expect([tree[0].zone.x1, tree[0].zone.y1, tree[0].zone.x2, tree[0].zone.y2]).to.deep.equal([10, 15, 110, 132])
        expect([tree[1].zone.x1, tree[1].zone.y1, tree[1].zone.x2, tree[1].zone.y2]).to.deep.equal([10, 133, 81, 215])
        expect([tree[2].zone.x1, tree[2].zone.y1, tree[2].zone.x2, tree[2].zone.y2]).to.deep.equal([82, 133, 110, 215])
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
        // let target10 = data.getDeltaIndex(deltaData[10], targetElements, { entrypoint: false, isTarget: true })
        expect(origin4).to.equal(3)
        expect(target4).to.equal(undefined)
        expect(origin10).to.equal(7)
        // expect(target10).to.equal(2)
    })

    it('should prepare data for Radial Tree', () => {
        let originalData = [
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/nobelprize/Physics/1910"},"path1":{"type":"uri","value":"http://data.nobelprize.org/terms/year"},"prop1":{"type":"typed-literal","datatype":"http://www.w3.org/2001/XMLSchema#integer","value":"1910"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/nobelprize/Physics/1910"},"path1":{"type":"uri","value":"http://data.nobelprize.org/terms/category"},"prop1":{"type":"uri","value":"http://data.nobelprize.org/resource/category/Physics"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/nobelprize/Physics/1910"},"path1":{"type":"uri","value":"http://data.nobelprize.org/terms/prizeFile"},"prop1":{"type":"uri","value":"http://data.nobelprize.org/resource/prizefile/10"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/nobelprize/Physics/1910"},"path1":{"type":"uri","value":"http://data.nobelprize.org/terms/laureate"},"prop1":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/15"},"path2":{"type":"uri","value":"http://data.nobelprize.org/terms/laureateAward"},"prop2":{"type":"uri","value":"http://data.nobelprize.org/resource/laureateaward/14"},"path3":{"type":"uri","value":"http://data.nobelprize.org/terms/university"},"prop3":{"type":"uri","value":"http://data.nobelprize.org/resource/university/Amsterdam_University"},"path4":{"type":"uri","value":"http://dbpedia.org/ontology/city"},"prop4":{"type":"uri","value":"http://data.nobelprize.org/resource/city/Amsterdam"},"path5":{"type":"uri","value":"http://www.w3.org/2002/07/owl#sameAs"},"prop5":{"type":"uri","value":"http://dbpedia.org/resource/Amsterdam"},"path6":{"type":"uri","value":"http://dbpedia.org/property/latd"},"prop6":{"type":"literal","value":"52"}},
            {"entrypoint":{"type":"uri","value":"http://data.nobelprize.org/resource/nobelprize/Physics/1910"},"path1":{"type":"uri","value":"http://data.nobelprize.org/terms/laureate"},"prop1":{"type":"uri","value":"http://data.nobelprize.org/resource/laureate/15"},"path2":{"type":"uri","value":"http://data.nobelprize.org/terms/laureateAward"},"prop2":{"type":"uri","value":"http://data.nobelprize.org/resource/laureateaward/14"},"path3":{"type":"uri","value":"http://data.nobelprize.org/terms/university"},"prop3":{"type":"uri","value":"http://data.nobelprize.org/resource/university/Amsterdam_University"},"path4":{"type":"uri","value":"http://dbpedia.org/ontology/city"},"prop4":{"type":"uri","value":"http://data.nobelprize.org/resource/city/Amsterdam"},"path5":{"type":"uri","value":"http://www.w3.org/2002/07/owl#sameAs"},"prop5":{"type":"uri","value":"http://dbpedia.org/resource/Amsterdam"},"path6":{"type":"uri","value":"http://dbpedia.org/property/longd"},"prop6":{"type":"literal","value":"4"}},
        ]
        expect(data.prepareSingleData(originalData, {})).deep.equal([
            {
                id: 1,
                name: 'http://data.nobelprize.org/resource/nobelprize/Physics/1910',
            },
            {
                id: 2,
                name: '1910',
                parent: 1,
                path: 'http://data.nobelprize.org/terms/year'
            },
            {
                id: 3,
                name: 'http://data.nobelprize.org/resource/category/Physics',
                parent: 1,
                path: 'http://data.nobelprize.org/terms/category'
            },
            {
                id: 4,
                name: 'http://data.nobelprize.org/resource/prizefile/10',
                parent: 1,
                path: 'http://data.nobelprize.org/terms/prizeFile'
            },
            {
                id: 5,
                name: 'http://data.nobelprize.org/resource/laureate/15',
                parent: 1,
                path: 'http://data.nobelprize.org/terms/laureate'
            }
        ])
    })
})
