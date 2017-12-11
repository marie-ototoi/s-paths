import * as d3 from 'd3'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { dragSelection } from '../../src/d3/d3DragSelector'
import { load, loadEmpty, loadError } from '../data/nobel'

var rewire = require('rewire')
var app = rewire('../../src/d3/d3DragSelector')
let dragEnd = app.__get__('dragEnd')
let el = d3.select('body').append('g').attr('id', 'dragdiv')

describe('d3DragSelector', function () {
    before(function () {
        el.call(dragSelection(el._groups[0][0], () => {}, () => {}))
    })
    // test for group
    it('A drag behavior should exist on the group', function () {
        expect(d3.select('#dragdiv')._groups[0][0].__on.length).to.be.equals(1)
    })
    it('CallbackDrag must be call when drag event are fired', function () {
        el.attr('mode', 'drag')
        var cb = sinon.spy()
        dragEnd(el._groups[0][0], cb, () => {})
        expect(cb).to.have.been.calledOnce
    })
    it('CallbackClick must be call when click event are fired', function () {
        el.attr('mode', 'click')
        var cb = sinon.spy()
        dragEnd(el._groups[0][0], () => {}, cb)
        expect(cb).to.have.been.calledOnce
    })
})
