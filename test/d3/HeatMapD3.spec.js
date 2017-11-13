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

var el = d3.select('body').append('g').attr('class', 'HeatMap').attr('id', 'heatMap')._groups[0][0]
var state = {zone: 'main', display: { zones: { main: { width: 500, height: 300} } }, data: [ {zone: 'main', statements: load() } ] }
var stateEmpty = {zone: 'main', display: { zones: { main: { width: 500, height: 300} } }, data: [ {zone: 'main', statements: loadEmpty() } ] }
var stateError = {zone: 'main', display: { zones: { main: { width: 500, height: 300} } }, data: [ {zone: 'main', statements: loadError() } ] }

describe('d3HeatMap', function () {
    before(function () {
        create(el, state)
    })
    after(function () {})
    it('A heatMap group should exist', function () {
        expect(d3.select('#heatMap'))
    })
})
