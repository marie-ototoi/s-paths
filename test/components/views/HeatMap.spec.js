import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import reducers from '../../../src/reducers'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as HeatMap } from '../../../src/components/views/HeatMap'

const store = createStore(reducers);

describe('<HeatMap />', () => {
    it('should render a svg group classed HeatMap', () => {
        const wrapper = mount(<Provider store = {store}><HeatMap /></Provider>)
        expect(wrapper.find('g.HeatMap')).to.have.length(1)
    })
})
