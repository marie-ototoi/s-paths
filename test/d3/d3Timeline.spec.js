import React from 'react'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinonChai from 'sinon-chai'
import * as d3Timeline from '../../src/d3/d3Timeline'

chai.use(chaiEnzyme())
chai.use(sinonChai)

describe('d3Timeline', function () {
    it('should trigger select method on click', function () {
        // assignBehavior
    })
    it('should class an element selected when it is in the selections', function () {
        // draw
    })
    it('should add selection and color info to each element data', function () {
        // draw
    })
    it('should draw a group with a line inside for each element', function () {
        // draw
        // draw(document.body.innerHTML = '<g class="Timeline" id="Timeline"></g>')
    })
    it('should color the element from the corresponding color in the palette', function () {
        // draw
    })
    it('should calculate the width of the time unit depending on the number of units and the available width', function () {
        // resize
    })
    it('should calculate the height of the time unit depending on the number of units and the available height', function () {
        // resize
    })
    it('should trigger the setLegend function once the legend is calculated', function () {
        // makeLegend
    })
})
