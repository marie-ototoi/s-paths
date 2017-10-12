import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as App } from '../../src/components/App'



describe('<App />', () => {
    it('should render', () => {
        const wrapper = shallow(
            <App  />
        )
        expect(wrapper).to.be.defined
        expect(wrapper.text()).not.to.equal('')
    })
})
