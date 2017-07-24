import React from 'react'

import {shallow, mount, render} from 'enzyme'
import {expect} from 'chai'
import sinon from 'sinon'

import Calendar from '../index'

describe('Calendar', () => {

  it('mounts', () => {
    const wrapper = mount(<Calendar />)
  })

})
