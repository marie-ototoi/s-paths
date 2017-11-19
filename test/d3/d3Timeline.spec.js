import * as d3 from 'd3'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { draw, resize } from '../../src/d3/d3Timeline'
import { load, loadEmpty, loadError } from '../data/nobel'
import statLib from '../../src/lib/statLib'


describe('d3Timeline', function () {
    before(function () {
        document.body.innerHTML = '<g class="Timeline" id="Timeline"></g>'
        let timelineElement = document.getElementById('Timeline')
    })
    after(function () {
        document.body.innerHTML = ''
    })
    it('should draw', function () {
        //test
    })
    it('should resize', function () {
        //test
    })
})
