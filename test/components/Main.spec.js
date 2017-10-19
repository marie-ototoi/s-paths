import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as Main } from '../../src/components/Main'

describe('<Main />', () => {
    it('should render a svg group classed main', () => {
        const wrapper = shallow(<Main  />)
        expect(wrapper.find('g.main')).to.have.length(1)
    })
})