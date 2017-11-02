import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import jsonld from '../../src/model/jsonld'
import data from '../data/nobel'


describe('model/jsonld', () => {
    /*it('should flatten json-ld', () => {
        let fullData = data.explore().results.bindings
        let flatData = jsonld.flatten(fullData)
        expect(flatData[0]).to.deep.equal({ 
            property: 'http://purl.org/dc/terms/subject', 
            unique: '42' 
        })
        expect(flatData[1]).to.deep.equal({ language: 'sv', 
            maxchar: '280', 
            minchar: '0', 
            property: 'http://data.nobelprize.org/terms/motivation',
            type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
            unique: '451' 
        })
    })*/
})
