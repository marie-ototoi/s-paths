import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import reducers from '../../src/reducers'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as Debug } from '../../src/components/Debug'

const store = createStore(reducers);

describe('<Debug />', () => {
    it('should render a svg group classed debug', () => {
        const wrapper = mount(<Provider store = {store}><Debug  /></Provider>)
        expect(wrapper.find('g.debug')).to.have.length(1)
    })
})
