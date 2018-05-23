import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from '../../../src/reducers'
import { mount } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinonChai from 'sinon-chai'
import { default as Axis } from '../../../src/components/elements/Axis'

chai.use(chaiEnzyme())
chai.use(sinonChai)

const store = createStore(reducers)

describe('<Axis />', () => {
    it('should render a svg group classed Axis', () => {
        const wrapper = mount(<Provider store = {store}><Axis /></Provider>)
        expect(wrapper.find('g.Axis')).to.have.length(1)
    })
})
