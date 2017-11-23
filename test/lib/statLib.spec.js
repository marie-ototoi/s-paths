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

describe('statLib', function () {
    before(function () {
    })
    after(function () {})
    it('A heatMap group should exist', function () {

    })
})
