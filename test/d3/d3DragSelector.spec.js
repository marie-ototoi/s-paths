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

import statisticalOperator from '../../src/lib/statLib'
import dataLib from '../../src/lib/dataLib'

describe('d3DragSelector', function () {
    before(function () {
        let el = d3.select('body').append('g').attr('id', 'dragdiv')
        let callBackDrag = function () {
            return true
        }
        let callBackClick = function () {
            return true
        }
        el.call(dragSelection(el._groups[0][0], callBackDrag, callBackClick))
        var event = document.createEvent('Event')
        event.initEvent('mousedown', true, true)
        el._groups[0][0].dispatchEvent(event)
        //        console.log(d3.select('#dragArea'))
        //        console.log(el.attr('dragX1'))
    })
    // test for group
    it('A drag behavior should exist on the group', function () {
        expect(d3.select('#dragdiv')._groups[0][0].__on.length).to.be.equals(1)
    })
    it('CallbackDrag must be call when drag event are fired', function () {
    })
    it('CallbackClick must be call when click event are fired', function () {

    })
})
