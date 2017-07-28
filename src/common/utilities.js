import 'whatwg-fetch'
import moment from './moment'

export function range(arg1, arg2, step = 1) {
  let start, end
  if (arg2) {
    start = arg1
    end = arg2
  } else {
    start = 0
    end = arg1
  }
  let range = []
  for (let i = start; i < end; i += step) {
    range.push(i)
  }
  return range
}

export function array_from_hash(hash = {}) {
  return Object.keys(hash).map((key) => hash[key])
}

export function human_join(strings = [], ellipsis) {
  const join = (strings) => strings.reduce((human_join, string) => `${string}, ${human_join}`, '')
  if (ellipsis && strings.length > ellipsis) {
    return `${join(strings.slice(0, ellipsis))}...`
  }
  if (strings.length > 1) {
    return `${join(strings.slice(2))}${strings[1]} et ${strings[0]}`
  }
  return strings[0]
}

export function set_from_array(array = []) {
  let hash = {}
  array.forEach((item) => {
    hash[item] = true
  })
  return hash
}

export function hash_with_key(array = [], key = 'id') {
  let hash = {}
  array.forEach((item) => {
    hash[item[key]] = item
  })
  return hash
}

export function array_contains(array, element, strict = false) {
  let compare
  if (strict) {
    compare = (a, b) => a === b
  } else {
    compare = (a, b) => a == b
  }
  return array && array.reduce((contains, e) => contains || compare(e, element), false)
}

export function map_hash(hash, mapping) {
  let mapped_hash = {}
  Object.keys(hash).forEach((key) => mapped_hash[key] = mapping(hash[key]))
  return mapped_hash
}

export function capitalize_first_letter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function make_one_memoized(fun) {
  let results = {}
  return (arg) => {
    let result = results[arg]
    if (typeof result == 'undefined') {
      result = fun(arg)
      results[arg] = result
    }
    return result
  }
}

export function make_curryfied(fun) {
  function make_curryfied_fun_of_arity(fun, arity) {
    if (arity > 1) {
      return (arg) => make_curryfied_fun_of_arity((...args) => fun(arg, ...args), arity - 1)
    } else {
      return fun
    }
  }
  return make_curryfied_fun_of_arity(fun, fun.length)
}

export function make_decurryfied(fun) {
  return (...args) => args.reduce((partial, arg) => partial(arg), fun)
}

export function make_memoized(fun) {
  function make_memoized_fun_of_arity(fun, arity) {
    if (arity > 0) {
      return make_one_memoized((arg) => make_memoized_fun_of_arity(fun(arg), arity - 1))
    } else {
      return fun
    }
  }
  return make_decurryfied(make_memoized_fun_of_arity(make_curryfied(fun), fun.length))
}

export function make_persistent(fun) {
  let previous_result
  let previous_arguments = []
  return (...args) => {
    if (
      args.length == previous_arguments.length &&
      args.reduce((identical, argument, index) => identical && argument === previous_arguments[index], true)
    ) {
      return previous_result
    } else {
      previous_result = fun(...args)
      previous_arguments = args
      return previous_result
    }
  }
}

export function group_consecutive(array, group) {
  if (array.length == 0) {
    return []
  } else {
    let current_group = []
    let groups = []

    const add_to_current_group = (element) => {
      current_group.push(element)
    }

    const flush_current_group = () => {
      groups.push(current_group)
      current_group = []
    }
    add_to_current_group(array[0])
    for (let index = 1; index < array.length; index++) {
      if (!group(current_group[current_group.length - 1], array[index])) {
        flush_current_group()
      }
      add_to_current_group(array[index])
    }
    if (current_group.length > 0) {
      flush_current_group()
    }
    return groups
  }
}

export function find_duplicates(array) {
  let found = {}
  let duplicates = {}
  array.forEach((element) => {
    if (found[element]) {
      duplicates[element] = true
    } else {
      found[element] = true
    }
  })
  return Object.keys(duplicates)
}

export function filter_hash(hash, filter) {
  let result = {}
  Object.keys(hash).forEach((key) => {
    let value = hash[key]
    if (filter(value)) {
      result[key] = value
    }
  })
  return result
}

export function array_from_set(set = {}) {
  let array = []
  Object.keys(set).forEach((key) => {
    if (set[key]) {
      array.push(key)
    }
  })
  return array
}

export function human_plural(quantity, singular, plural) {
  if (quantity > 1) {
    return plural.replace('%%', quantity)
  } else {
    return singular.replace('%%', quantity)
  }
}

export function deep_merge(hash1, hash2) {
  if (typeof hash1 === 'object' && typeof hash2 === 'object') {
    if (hash1 === null) {
      hash1 = {}
    }
    if (hash2 === null) {
      hash2 = {}
    }
    return Object.keys(hash2).reduce((result, key) => ({
      ...result,
      [key]: deep_merge(hash1[key], hash2[key])
    }), hash1)
  } else {
    return hash2
  }
}

export function for_all(array, condition) {
  let i = 0
  while (i < array.length) {
    if (!condition(array[i])) {
      return false
    }
    i++
  }
  return true
}

export function create_hash(array, fun) {
  let hash = {}, i = 0
  while (i < array.length) {
    let key = array[i]
    hash[key] = fun(key, i)
    i++
  }
  return hash
}

export function hash_key_with_value(hash, value) {
  let result
  Object.keys(hash).forEach((key) => {
    if (hash[key] == value) {
      result = key
    }
  })
  return result
}

export function set_difference(array, set) {
  let result = {}
  array.forEach((key) => {
    if (!set[key]) {
      result[key] = true
    }
  })
  return result
}

export function empty_hash(hash) {
  return Object.keys(hash).length == 0
}

export function empty_set(set) {
  return for_all(Object.keys(set), (key) => !set[key])
}

export function empty_array(array) {
  return array.length == 0
}

export function preview(string, length) {
  if (string) {
    if (string.length < length) {
      return string
    } else {
      return string.slice(0, length - 3) + '...'
    }
  } else {
    return string
  }
}

export function split_array(array, which_category, categories = []) {
  let result = create_hash(categories, () => [])
  array.forEach((element) => {
    let category = which_category(element)
    if (result[category]) {
      result[category].push(element)
    } else {
      result[category] = [element]
    }
  })
  return result
}

export function array_minimum(array, is_smaller) {
  let minimum = array[0]
  array.slice(1).forEach((element) => {
    if (is_smaller(element, minimum)) {
      minimum = element
    }
  })
  return minimum
}

export function array_maximum(array, is_smaller) {
  return array_minimum(array, (a, b) => is_smaller(b, a))
}

export function split_hash(hash, which_category, categories = []) {
  let result = create_hash(categories, () => ({}))
  Object.keys(hash).forEach((key) => {
    const element = hash[key]
    let category = which_category(element)
    if (result[category]) {
      result[category][key] = element
    } else {
      result[category] = {[key]: element}
    }
  })
  return result
}

export function flatten_array(arrays) {
  let result = []
  arrays.forEach((array) => {
    result.push(...array)
  })
  return result
}

export function find_in_array(array, condition) {
  for (let i = 0; i < array.length; i++) {
    if (condition(array[i])) {
      return array[i]
    }
  }
  return null
}

export function find_optimum_in_sorted_array(array, is_too_big) {
  let n = array.length
  if (n == 0) {
    return -1
  } else if (n == 1) {
    if (is_too_big(array[0])) {
      return -1
    } else {
      return 0
    }
  } else {
    let half = Math.floor(n / 2)
    if (is_too_big(array[half])) {
      return find_optimum_in_sorted_array(array.slice(0, half), is_too_big)
    } else {
      return half + 1 + find_optimum_in_sorted_array(array.slice(half + 1), is_too_big)
    }
  }
}

export function group_by_batch(array, batch_count) {
  if (batch_count > array.length) {
    return [array]
  } else {
    return [array.slice(0, batch_count), ...group_by_batch(array.slice(batch_count), batch_count)]
  }
}

export function group_hash_by_value(hash, categories = []) {
  let result = create_hash(categories, () => [])
  Object.keys(hash).forEach((key) => {
    let value = hash[key]
    if (value) {
      if (!result[value]) {
        result[value] = []
      }
      result[value].push(key)
    }
  })
  return result
}

export function set_union(set = {}, array = []) {
  let result = {...set}
  array.forEach((element) => {
    result[element] = true
  })
  return result
}

export function exist(array, condition) {
  return !for_all(array, (element) => !condition(element))
}

export function empty_object(object) {
  return Object.keys(object).length === 0 && object.constructor === Object
}

export function hash_size(hash) {
  return Object.keys(hash).length
}

export function array_sum(array) {
  let sum = 0
  array.forEach((value) => sum += value)
  return sum
}

export function array_mean(array) {
  return array_sum(array) / array.length
}

const unit_counts = [1000, 60, 60, 24, 1e120]
const unit_labels = ['ms', 's', 'm', 'h', ' j']
export function format_duration(duration) {
  let last_unit_value = duration, before_last_unit_value = 0, unit = 0
  function step_one_unit() {
    let count = unit_counts[unit]
    let next_unit_value = last_unit_value / count
    if (unit == unit_counts.length - 1 || next_unit_value < 1) {
      return `${Math.floor(last_unit_value)}${unit_labels[unit]}${before_last_unit_value > 0 ? ` ${before_last_unit_value}${unit_labels[unit - 1]}` : ''}`
    } else {
      before_last_unit_value = last_unit_value % count
      last_unit_value = Math.floor(next_unit_value)
      unit++
      return step_one_unit()
    }
  }
  return isNaN(duration) ? ' - ' : step_one_unit()
}

export function property_getter(property, default_value) {
  return (object) => object[property] || default_value
}

export function property_toggler(property) {
  return (object = {}) => ({...object, [property]: !object[property]})
}

export function set_count(set) {
  return array_from_set(set).length
}

export function property_is(property, value) {
  return (object) => object[property] == value
}

export function get_url_parameter(parameter) {
  let results = new RegExp('[\?&]' + parameter + '=([^&#]*)').exec(window.location.href)
  return results ? decodeURIComponent(results[1]) : null
}

export function debounce(fun, wait_for = 100) {
  let running = false, next
  return (...args) => {
    if (running) {
      next = args
    } else {
      running = true
      setTimeout(() => {
        running = false
        if (next) {
          fun(...next)
          next = null
        }
      }, wait_for)
      fun(...args)
    }
  }
}

export function set_intersection(set, array) {
  let result = {}
  if (Array.isArray(set)) {
    set = set_from_array(set)
  }
  if (!Array.isArray(array)) {
    array = array_from_set(array)
  }
  array.forEach((key) => {
    if (set[key]) {
      result[key] = true
    }
  })
  return result
}

export function set_from_hash(hash) {
  return set_from_array(array_from_hash(hash))
}

const opposite_function = (fun) => (...args) => -fun(...args)

export function compare(getter, ascending = true) {
  const compare = (a, b) => {
    const c = getter(a), d = getter(b)
    if (c < d) {
      return -1
    } else if (c > d) {
      return 1
    } else {
      return 0
    }
  }
  if (ascending) {
    return compare
  } else {
    return opposite_function(compare)
  }
}

export function scope(scope_name) {
  return (fun) => (object = {}) => {
    return {
      ...object,
      [scope_name]: fun(object[scope_name])
    }
  }
}

export function filter_set(set, keep) {
  const result = {}
  Object.keys(set).forEach((element) => {
    if (set[element] && keep(element)) {
      result[element] = true
    }
  })
  return result
}

export function hash_each(hash, each) {
  Object.keys(hash || {}).forEach((key) => each(key, hash[key]))
}

const make_period_from_event = (e) => ({is_period: true, start: moment(e.start), end: moment(e.end), events: [e], full_days: e.full_days})

export function intersecting_periods_interval(periods, start, end) {
  let lower = find_optimum_in_sorted_array(periods, (period) => period.end.isAfter(start)) + 1
  let upper = periods.length - 1 - find_optimum_in_sorted_array(periods.reverse(), (period) => period.start.isBefore(end))
  periods.reverse()
  return {lower, upper}
}

export const make_periods = (events) => {
  let events_array = array_from_hash(events)
  if (events_array.length == 0) {
    return []
  } else {
    return events_array.slice(1).reduce((periods, e) => {
      let extended_start = moment(e.start).subtract(1, 'minute')
      let extended_end = moment(e.end).add(1, 'minute')
      let {lower, upper} = intersecting_periods_interval(periods, extended_start, extended_end)
      let merging_periods = periods.slice(lower, upper)
      return [
        ...periods.slice(0, lower),
        {
          is_period: true,
          start: merging_periods.length == 0 || merging_periods[0].start.isAfter(e.start) ? moment(e.start) : merging_periods[0].start,
          end: merging_periods.length == 0 || merging_periods.slice(-1)[0].end.isBefore(e.end) ? moment(e.end) : merging_periods.slice(-1)[0].end,
          full_days: e.full_days && for_all(merging_periods, (period) => period.full_days),
          events: [...flatten_array(merging_periods.map((period) => period.events)), e],
        },
        ...periods.slice(upper)
      ]
    }, [make_period_from_event(events_array[0])])
  }
}

export const make_slots = (periods) => flatten_array(
  periods.map(({start, end, ...period}) => {
    let current = moment(start).add(1, 'day').startOf('day'), previous = start
    const periods = []
    while (current.isBefore(end)) {
      periods.push({...period, start: previous, end: current})
      previous = moment(current)
      current = moment(current).add(1, 'day')
    }
    periods.push({...period, start: previous, end})
    return periods
  })
)
