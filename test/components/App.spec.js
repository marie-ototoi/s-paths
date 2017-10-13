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
    it('should render a svg', () => {
        const wrapper = shallow(<App  />)
        expect(wrapper.find('svg')).to.have.length(1)
    })
    it('should render a svg full width and height', () => {
        const wrapper = mount(<App  />)
        expect(wrapper.find('svg')).to.have.prop('width', window.innerWidth)
        expect(wrapper.find('svg')).to.have.prop('height', window.innerHeight)
    })
    it('should render a svg with specified viewbox', () => {
        const wrapper1 = shallow(<App />)
        const wrapper2 = shallow(<App display="full" />)
        const wrapper3 = shallow(<App display="main" />)
        const wrapper4 = shallow(<App display="aside" />)

        expect(wrapper1.find('svg')).to.have.prop('viewBox', '0 0 100 100')
        expect(wrapper2.find('svg')).to.have.prop('viewBox', '0 0 100 100')
        expect(wrapper3.find('svg')).to.have.prop('viewBox', '0 0 50 100')
        expect(wrapper4.find('svg')).to.have.prop('viewBox', '50 0 50 100')
    })

})
