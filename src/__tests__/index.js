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
    const wrapper = mount(
      <Calendar
        missions={[
          {events: [{
            start: moment().add(1, 'day'),
            end: moment().add(2, 'days'),
          }]}
        ]}
        get_mission_elements={(mission) => {
          return {title: 'Hey Ho', color: 'black', icon: '@'}
        }}
      />
    )
  })

})
