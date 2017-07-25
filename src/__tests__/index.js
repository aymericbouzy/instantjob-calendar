import React from 'react'

import {shallow, mount, render} from 'enzyme'
import {expect} from 'chai'
import sinon from 'sinon'
import moment from 'common/moment'

import Calendar from '../index'

describe('Calendar', () => {

  it('mounts', () => {
    const wrapper = mount(<Calendar />)
  })

  it('consumes props', () => {
    const get_mission_elements = sinon.spy((mission) => {
      return {title: 'Hey Ho', color: 'black', icon: '@'}
    })
    const wrapper = mount(
      <Calendar
        missions={[
          {events: [{
            start: moment().add(1, 'day'),
            end: moment().add(2, 'days'),
          }]}
        ]}
        get_mission_elements={get_mission_elements}
      />
    )
    expect(get_mission_elements.calledOnce).to.equal(true)
  })

})
