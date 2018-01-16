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
import { default as Legend } from '../../../src/components/elements/Legend'

const store = createStore(reducers)

describe('<Legend />', () => {
    it('should render a svg group classed Legend', () => {
        const wrapper = mount(<Provider store = {store}>
            <Legend
                zone = "main"
                dimensions = { { x: 0, y: 0, width: 10, height: 10 } }
            />
        </Provider>)
        expect(wrapper.find('g.Legend')).to.have.length(1)
    })
})
