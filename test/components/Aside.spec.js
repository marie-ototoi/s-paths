import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as Aside } from '../../src/components/Aside'

describe('<Aside />', () => {
    it('should render a svg group classed aside', () => {
        const wrapper = shallow(<Aside  />)
        expect(wrapper.find('g.aside')).to.have.length(1)
    })
})
