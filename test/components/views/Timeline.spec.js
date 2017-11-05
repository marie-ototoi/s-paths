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
import { default as Timeline } from '../../../src/components/views/Timeline'

const store = createStore(reducers);

describe('<Timeline />', () => {
    it('should render a svg group classed Timeline', () => {
        const wrapper = mount(<Provider store = {store}><Timeline /></Provider>)
        expect(wrapper.find('g.Timeline')).to.have.length(1)
    })
})
