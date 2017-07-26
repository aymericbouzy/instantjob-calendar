import React from 'react'

import {shallow, mount, render} from 'enzyme'
import {expect} from 'chai'
import sinon from 'sinon'
import moment from 'common/moment'

import Calendar from '../index'
import {display_period} from '../periods'

const missions = [
  {events: [{
    start: moment().add(1, 'day'),
    end: moment().add(2, 'days'),
  }]}
]

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
        missions={missions}
        get_mission_elements={get_mission_elements}
      />
    )
    expect(get_mission_elements.calledOnce).to.equal(true)
  })

  it('uses render_mission when provided', () => {
    const render_mission = sinon.spy((mission, {start, end}) => {
      return `Hey Ho ! ${display_period(start, end)}`
    })
    const wrapper = mount(
      <Calendar
        missions={missions}
        render_mission={render_mission}
      />
    )
    expect(render_mission.calledOnce).to.equal(true)
  })
})
