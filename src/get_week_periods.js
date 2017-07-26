import React from 'react'
import {
  make_memoized, property_getter, range, hash_with_key, flatten_array, split_array,
  find_optimum_in_sorted_array, make_periods, make_slots,
} from 'common/utilities'
import moment from 'common/moment'
import tolerant_selector from 'common/tolerant_selector'
import Period from './period'

const get_children_periods = tolerant_selector(
  [property_getter('children'), property_getter('render_shift')],
  (children, render_shift) => flatten_array(children.map(
    ({events, ...child}) => make_periods(hash_with_key(events)).map(({start, end}) => ({
      ...child,
      start,
      end,
      render() {
        if (typeof render_shift === 'function') {
          return render_shift(child, {start, end})
        }
        return <Period {...({...child, start, end})} />
      },
    }))
  ))
)

const get_periods = tolerant_selector(
  [get_children_periods],
  (periods) => make_slots(periods)
)

const get_week_periods = make_memoized((week_value) => {
  const week = moment(week_value)
  const days = range(8).map((index) => moment(week_value).add(index, 'day'))
  const day_values = days.map((day) => day.valueOf())
  return tolerant_selector(
    [get_periods],
    (periods) => {
      const object = split_array(
        periods,
        ({start}) => find_optimum_in_sorted_array(day_values, (date) => moment(date).isAfter(start)),
        range(7)
      )
      return range(7).map((index) => object[index])
    }
  )
})

export default (week) => get_week_periods(week.valueOf())
