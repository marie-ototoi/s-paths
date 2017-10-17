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
        expect(wrapper.find('svg')).to.have.prop('width', window.innerWidth - 5 )
        expect(wrapper.find('svg')).to.have.prop('height', window.innerHeight - 5 )
    })
    it('should render a svg with the right viewbox', () => {
        let height = window.innerHeight - 5
        let width = window.innerWidth - 5 
        let displayRatio = Math.floor (width / height * 100) / 100
        let debugViewBox = `0, 0, ${Math.floor(100 * displayRatio)}, 100`
        let mainViewBox = `${Math.floor(35 * displayRatio)}, 35, ${Math.floor(30 * displayRatio)}, 30`
        let asideViewBox = `${Math.floor(70 * displayRatio)}, 35, ${Math.floor(30 * displayRatio)}, 30`
        let fullViewBox = `${Math.floor(35 * displayRatio)}, 35, ${Math.floor(70 * displayRatio)}, 30`
        const wrapper1 = mount(<App />)
        const wrapper2 = mount(<App display = "full" />)
        const wrapper3 = mount(<App display = "main" />)
        const wrapper4 = mount(<App display = "aside" />)
        const wrapper5 = mount(<App display = "full" mode = "dev" />)
        const wrapper6 = mount(<App display = "main" mode = "dev" />)
        const wrapper7 = mount(<App display = "aside" mode = "dev" />)
        expect(wrapper1.find('svg')).to.have.prop('viewBox', mainViewBox)
        expect(wrapper2.find('svg')).to.have.prop('viewBox', fullViewBox)
        expect(wrapper3.find('svg')).to.have.prop('viewBox', mainViewBox)
        expect(wrapper4.find('svg')).to.have.prop('viewBox', asideViewBox)
        expect(wrapper5.find('svg')).to.have.prop('viewBox', debugViewBox)
        expect(wrapper6.find('svg')).to.have.prop('viewBox', debugViewBox)
        expect(wrapper7.find('svg')).to.have.prop('viewBox', debugViewBox)
    })

})
