import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from '../../src/reducers'
import { mount } from 'enzyme'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinonChai from 'sinon-chai'
import { default as App } from '../../src/components/App'

chai.use(chaiEnzyme())
chai.use(sinonChai)

const store = createStore(reducers)

describe('<App />', () => {
    it('should render a svg', () => {
        const wrapper = mount(<Provider store = {store}><App /></Provider>)
        expect(wrapper.find('svg')).to.have.length(1)
    })
    it('should render a svg full width and height', () => {
        const wrapper = mount(<Provider store = {store}><App /></Provider>)
        expect(wrapper.find('svg')).to.have.prop('width', window.innerWidth - 5)
        expect(wrapper.find('svg')).to.have.prop('height', window.innerHeight - 5)
    })
    it('should render a svg with the right viewbox', () => {
        let height = window.innerHeight - 5
        let width = window.innerWidth - 5
        let vb = `0, 0, 100, 100`
        const wrapper = mount(<Provider store = {store}><App display = "full" mode = "dev" /></Provider>)
        expect(wrapper.find('svg')).to.have.prop('viewBox', `0, 0, ${width}, ${height}`)
    })

})
