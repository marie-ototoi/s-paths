import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from '../../src/reducers'
import { mount } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinonChai from 'sinon-chai'
import { default as Debug } from '../../src/components/Debug'

chai.use(chaiEnzyme())
chai.use(sinonChai)

const store = createStore(reducers)

describe('<Debug />', () => {
    it('should render a svg group classed Debug', () => {
        const wrapper = mount(<Provider store = {store}><Debug /></Provider>)
        expect(wrapper.find('g.Debug')).to.have.length(1)
    })
})
