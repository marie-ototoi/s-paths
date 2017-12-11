import * as d3 from 'd3'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { create, destroy, update } from '../../../src/d3/d3Axis/d3Axis'

var pos = 0
var el = d3.select('body').append('g').attr('id', 'AxisContainer')._groups[0][0]
var type = ['left', 'bottom', 'top', 'right']
var props = {
    type: 'none',
    display: { viz: { useful_width: 500, useful_height: 300, horizontal_margin: 50, vertical_margin: 50 } },
    keys: [ 'key1', 'key2' ],
    titles: [ 'key1', 'key2' ],
    behaviors: {}
}

describe('d3Axis', function () {
    beforeEach(function () {
        d3.selectAll('line').remove()
        props.type = type[pos]
        pos++
        create(el, props)
    })
    // test for group
    it('AxisLeft should be created', function () {
        expect(props.type).to.be.equals('left')
        expect(d3.select('line').empty()).to.be.false
    })
    it('AxisBottom should be created', function () {
        expect(props.type).to.be.equals('bottom')
        expect(d3.select('line').empty()).to.be.false
    })
    it('AxisTop should not be created', function () {
        expect(props.type).to.be.equals('top')
        expect(d3.select('line').empty()).to.be.true
    })
    it('AxisRigth should not be created', function () {
        expect(props.type).to.be.equals('right')
        expect(d3.select('line').empty()).to.be.true
    })
})
