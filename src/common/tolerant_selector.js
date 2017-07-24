import {createSelectorCreator, defaultMemoize} from 'reselect'

export const tolerant_equal = (current, previous) => {
  if (current === previous) {
    return true
  } else if (current && current.constructor === Array && previous) {
    return current.length === previous.length && current.reduce((equal, value, index) => equal && tolerant_equal(value, previous[index]), true)
  } else {
    return false
  }
}

export default createSelectorCreator(
  defaultMemoize,
  tolerant_equal
)
