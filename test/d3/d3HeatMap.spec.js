import * as d3 from 'd3'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { create, destroy, update } from '../../src/d3/d3HeatMap'
import { load, loadEmpty, loadError } from '../data/nobel'
import statLib from '../../src/lib/statLib'

var el = d3.select('body').append('g').attr('class', 'HeatMap').attr('id', 'heatMap')._groups[0][0]
var props = { zone: 'main',
    display: { viz: { useful_width: 500, useful_height: 300, horizontal_margin: 50, vertical_margin: 50 } },
    data: [ { zone: 'main', statements: load() }, {zone: 'aside', statements: []} ],
    setLegend: function functionName (arg) { }
}

describe('d3HeatMap', function () {
    before(function () {
        create(el, props)
    })
    // test for group
    it('The center panel group should be init', function () {
        expect(d3.select('#heatMapCenterPanel').empty()).to.be.false
    })
    it('The pattern library group should be init', function () {
        expect(d3.select('#centerPatternLib').empty()).to.be.false
    })
    it('The abscisse group should be init', function () {
        expect(d3.select('#abscisse').empty()).to.be.false
    })
    it('The abscisse shadow group should be init', function () {
        expect(d3.select('#abscShadow').empty()).to.be.false
    })
    it('The abscisse button group should be init', function () {
        expect(d3.select('#abscButton').empty()).to.be.false
    })
    it('The ordonne group should be init', function () {
        expect(d3.select('#ordonne').empty()).to.be.false
    })
    it('The ordonne shadow group should be init', function () {
        expect(d3.select('#ordoShadow').empty()).to.be.false
    })
    it('The ordonne button group should be init', function () {
        expect(d3.select('#ordoButton').empty()).to.be.false
    })
    it('The center matrix group should be init', function () {
        expect(d3.select('#center').empty()).to.be.false
    })
    // test for center group
    it('Center matrix group: the number of rect should be 23', function () {
        expect(d3.select('#center').selectAll('rect').size()).to.be.equals(23)
    })
    // test for abscisse
    it('Abscisse group: the number of text should be 12', function () {
        expect(d3.select('#abscisse').selectAll('text').size()).to.be.equals(12)
    })
    it('Abscisse group: the number of rect should be 12', function () {
        expect(d3.select('#abscButton').selectAll('rect').size()).to.be.equals(12)
    })
    it('Abscisse group: the number of tick should be 12', function () {
        expect(d3.select('#abscisse').selectAll('.tick').size()).to.be.equals(12)
    })
    it('Abscisse group: the number of path should be 1', function () {
        expect(d3.select('#abscisse').selectAll('path').size()).to.be.equals(1)
    })
    // test for ordonne
    it('Ordonne group: the number of text should be 2', function () {
        expect(d3.select('#ordonne').selectAll('text').size()).to.be.equals(2)
    })
    it('Ordonne group: the number of rect should be 2', function () {
        expect(d3.select('#ordoButton').selectAll('rect').size()).to.be.equals(2)
    })
    it('Ordonne group: the number of tick should be 2', function () {
        expect(d3.select('#ordonne').selectAll('.tick').size()).to.be.equals(2)
    })
    it('Ordonne group: the number of path should be 1', function () {
        expect(d3.select('#ordonne').selectAll('path').size()).to.be.equals(1)
    })
    // test selection
    it('Center selection: the number of rect should be 23', function () {
        d3.select('#center').selectAll('rect').click()
        expect(d3.select('#center').selectAll('rect').size()).to.be.equals(23)
    })
})
