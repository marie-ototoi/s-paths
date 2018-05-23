import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from '../../../src/reducers'
import { mount } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinonChai from 'sinon-chai'
import { default as Legend } from '../../../src/components/elements/Legend'

chai.use(chaiEnzyme())
chai.use(sinonChai)

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
