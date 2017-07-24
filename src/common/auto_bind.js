import {set_from_array} from './utilities'

const react_properties_set = set_from_array([
  'constructor',
  'componentWillMount',
  'render',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
])

const is_not_react_property = (property) => !react_properties_set[property]

// from react-autobind
function boundMethod(objPrototype, method, descriptor) {
  let fn = descriptor.value

  return {
    configurable: true,
    get() {
      if (this === objPrototype || this.hasOwnProperty(method)) {
        return fn
      }

      let boundFn = fn.bind(this)
      Object.defineProperty(this, method, {
        value: boundFn,
        configurable: true,
        writable: true
      })
      return boundFn
    },
    set(new_fn) {
      fn = new_fn
    },
  }
}

export default function auto_bind(component) {
  let prototype = Object.getPrototypeOf(component)
  Object.getOwnPropertyNames(prototype)
  .filter(is_not_react_property)
  .forEach((property) => {
    let descriptor = Object.getOwnPropertyDescriptor(prototype, property)
    if (descriptor === undefined) {
      return
    }
    if (typeof descriptor.value !== 'function') {
      return
    }
    Object.defineProperty(prototype, property, boundMethod(prototype, property, descriptor))
  })
}
