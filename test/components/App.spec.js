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
import { default as App } from '../../src/components/App'

const store = createStore(reducers);

describe('<App />', () => {
    it('should render a svg', () => {
        const wrapper = mount(<Provider store = {store}><App  /></Provider>)
        expect(wrapper.find('svg')).to.have.length(1)
    })
    it('should render a svg full width and height', () => {
        const wrapper = mount(<Provider store = {store}><App  /></Provider>)
        expect(wrapper.find('svg')).to.have.prop('width', window.innerWidth - 5 )
        expect(wrapper.find('svg')).to.have.prop('height', window.innerHeight - 5 )
    })
    it('should render a svg with the right viewbox', () => {
        let height = window.innerHeight - 5
        let width = window.innerWidth - 5 
        let vb = `0, 0, 100, 100`
        const wrapper = mount(<Provider store = {store}><App display = "full" mode = "dev" /></Provider>)
        expect(wrapper.find('svg')).to.have.prop('viewBox', `0, 0, ${ width }, ${ height }`)
    })

})
