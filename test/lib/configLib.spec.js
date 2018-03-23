import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import config from '../../src/lib/configLib'

describe('lib/config', () => {
    it('should return a combined list of matches', () => {
        let inputList = [
            [{ path: 'a' }, { path: 'a2' }],
            [{ path: 'b' }, { path: 'b2' }],
            [{ path: 'c' }]
        ]
        let addList = [{ path: 'd' }, { path: 'e' }]
        let expectedList = [
            [{ path: 'a' }, { path: 'a2' }, { path: 'd' }],
            [{ path: 'a' }, { path: 'a2' }, { path: 'e' }],
            [{ path: 'b' }, { path: 'b2' }, { path: 'd' }],
            [{ path: 'b' }, { path: 'b2' }, { path: 'e' }],
            [{ path: 'c' }, { path: 'd' }],
            [{ path: 'c' }, { path: 'e' }]
        ]
        expect(config.findAllMatches(inputList, addList)).to.deep.equal(expectedList)
    })
    it('should true if value is in range, else false', () => {
        let range = [5, 8]
        expect(config.inRange(2, range)).to.be.false
        expect(config.inRange(6, range)).to.be.true
        expect(config.inRange(10, range)).to.be.false
    })
    it('should true if value is under range, else false', () => {
        let range = [5, 8]
        expect(config.underRange(2, range)).to.be.true
        expect(config.underRange(6, range)).to.be.false
        expect(config.underRange(10, range)).to.be.false
    })
    it('should true if value is over range, else false', () => {
        let range = [5, 8]
        expect(config.overRange(2, range)).to.be.false
        expect(config.overRange(6, range)).to.be.false
        expect(config.overRange(10, range)).to.be.true
    })
    it('should calculate deviation cost for a unit according to max gap', () => {
        let unique1 = {
            optimal: [5, 10],
            min: 3,
            max: 160
        }
        let unique2 = {
            ...unique1,
            max: 20
        }
        expect(config.getDeviationCost(3, 160, [5, 10], 0.5)).to.equal(0.5 / (160 - 10))
        expect(config.getDeviationCost(3, 20, [5, 10], 0.5)).to.equal(0.5 / (20 - 10))
    })
    it('should change selected config for a given zone', () => {
        let formerConfig = {
            matches: [
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:category/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfBirth/*' },
                        { path: 'nobel:LaureateAward/nobel:share/*' }
                    ],
                    selected: false
                },
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfBirth/*' },
                        { path: 'nobel:LaureateAward/nobel:category/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfDeath/*' }
                    ],
                    selected: true
                },
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:category/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfBirth/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfDeath/*' }
                    ],
                    selected: false
                },
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:category/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfDeath/*' },
                        { path: 'nobel:LaureateAward/nobel:share/*' }
                    ],
                    selected: false
                }
            ]
        }
        let newConfig = config.selectProperty(formerConfig, 'main', 1, 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfBirth/*')
        expect(newConfig.matches[0].selected).to.be.false
        expect(newConfig.matches[1].selected).to.be.false
        expect(newConfig.matches[2].selected).to.be.true
        expect(newConfig.matches[3].selected).to.be.false
    })

    it('should return lists of props available for each propIndex in a config', () => {
        let configEx = {
            matches: [
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:category/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfBirth/*' },
                        { path: 'nobel:LaureateAward/nobel:share/*' }
                    ],
                    selected: false
                },
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfBirth/*' },
                        { path: 'nobel:LaureateAward/nobel:category/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfDeath/*' }
                    ],
                    selected: true
                },
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:category/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfBirth/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfDeath/*' }
                    ],
                    selected: false
                },
                {
                    properties: [
                        { path: 'nobel:LaureateAward/nobel:category/*' },
                        { path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfDeath/*' },
                        { path: 'nobel:LaureateAward/nobel:share/*' }
                    ],
                    selected: false
                }
            ]
        }
        let prop1 = {
            path: 'nobel:LaureateAward/nobel:category/*',
            readablePath: [ { comment: undefined, label: 'nobel:category' } ]
        }
        let prop2 = {
            path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfBirth/*',
            readablePath: [ { 'comment': undefined, label: 'nobel:laureate' }, { comment: undefined, label: 'dbpprop:dateOfBirth' } ]
        }
        let prop3 = {
            path: 'nobel:LaureateAward/nobel:laureate/*/dbpprop:dateOfDeath/*',
            readablePath: [ { 'comment': undefined, label: 'nobel:laureate' }, { comment: undefined, label: 'dbpprop:dateOfDeath' } ]
        }
        let prop4 = {
            path: 'nobel:LaureateAward/nobel:share/*',
            readablePath: [ { 'comment': undefined, label: 'nobel:share' } ]
        }
        let propsLists = config.getPropsLists(configEx, 'main', [])
        expect(propsLists).to.deep.equal([
            [
                { ...prop1, selected: false },
                { ...prop2, selected: true }
            ],
            [
                { ...prop2, selected: false },
                { ...prop1, selected: true },
                { ...prop3, selected: false }
            ],
            [
                { ...prop4, selected: false },
                { ...prop3, selected: true }
            ]
        ])
    })
})
