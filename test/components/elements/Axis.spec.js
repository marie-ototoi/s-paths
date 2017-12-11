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
import { default as Axis } from '../../../src/components/elements/Axis'

const store = createStore(reducers)

describe('<Axis />', () => {
    it('should render a svg group classed Axis', () => {
        const wrapper = mount(<Provider store = {store}><Axis /></Provider>)
        expect(wrapper.find('g.Axis')).to.have.length(1)
    })
})
