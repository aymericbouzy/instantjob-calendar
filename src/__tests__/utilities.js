import {expect} from 'chai'
import sinon from 'sinon'
import moment from 'common/moment'

import {make_slots} from 'common/utilities'
import {get_periods} from '../get_week_periods'

describe('make_slots', () => {
  it('is correct for one event', () => {
    const periods = [{
      start: moment('2017-11-27T11:00:00.000+01:00'),
      end: moment('2017-11-27T13:00:00.000+01:00'),
    }]
    const slots = make_slots(periods)
    expect(slots.length).to.equal(1)
    expect(slots[0].start.isSame(periods[0].start)).to.equal(true)
    expect(slots[0].end.isSame(periods[0].end)).to.equal(true)
  })

  it('is correct for one event over two days', () => {
    const periods = [{
      start: moment('2017-11-27T11:00:00.000+01:00'),
      end: moment('2017-11-28T13:00:00.000+01:00'),
    }]
    const slots = make_slots(periods)
    expect(slots.length).to.equal(2)
    expect(slots[0].start.isSame(periods[0].start)).to.equal(true)
    expect(slots[0].end.isSame(periods[0].end.startOf('day'))).to.equal(true)
    expect(slots[1].start.isSame(periods[0].end.startOf('day'))).to.equal(true)
    expect(slots[1].end.isSame(periods[0].end)).to.equal(true)
  })

  it('is correct for two events', () => {
    const periods = [{
      start: moment('2017-11-27T11:00:00.000+01:00'),
      end: moment('2017-11-27T13:00:00.000+01:00'),
    }, {
      start: moment('2017-11-27T15:00:00.000+01:00'),
      end: moment('2017-11-27T18:00:00.000+01:00'),
    }]
    const slots = make_slots(periods)
    expect(slots.length).to.equal(2)
    expect(slots[0].start.isSame(periods[0].start)).to.equal(true)
    expect(slots[0].end.isSame(periods[0].end)).to.equal(true)
    expect(slots[1].start.isSame(periods[1].start)).to.equal(true)
    expect(slots[1].end.isSame(periods[1].end)).to.equal(true)
  })

  it('preserves other props', () => {
    const periods = [{
      start: moment('2017-11-27T11:00:00.000+01:00'),
      end: moment('2017-11-27T13:00:00.000+01:00'),
      foo: 'bar',
    }]
    const slots = make_slots(periods)
    expect(slots[0].foo).to.equal('bar')
  })
})

describe('get_periods', () => {
  it('should make 4 periods', () => {
    const week = moment('2017-11-27T00:00:00.000+01:00')
    const events = [
      {start: moment(week).add(20, 'hours'), end: moment(week).add(24, 'hours')},
      {start: moment(week).add(24, 'hours'), end: moment(week).add(30, 'hours')},
      {start: moment(week).add(70, 'hours'), end: moment(week).add(80, 'hours')},
    ]
    const periods = get_periods({children: [{events}]})
    expect(periods.length).to.equal(4)
  })
})
