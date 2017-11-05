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
import { default as PropList } from '../../src/components/PropList'

const store = createStore(reducers)

describe('<PropList />', () => {
    it('should render a svg group classed PropList', () => {
        const wrapper = mount(<Provider store = {store}><PropList /></Provider>)
        expect(wrapper.find('g.PropList')).to.have.length(1)
    })
})
