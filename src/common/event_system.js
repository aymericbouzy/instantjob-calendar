import {array_from_set} from './utilities'

let hooks = {}
let boxes = {}
let box_callbacks = {}
let idGenerator = 0

const event_system = {
  register(hook_name, callback) {
    if (!hooks[hook_name]) {
      hooks[hook_name] = {}
    }
    let id = idGenerator++
    hooks[hook_name][id] = callback
    return () => {
      hooks[hook_name][id] = false
    }
  },
  trigger(hook_name) {
    let triggered_hooks = hooks[hook_name]
    if (triggered_hooks) {
      array_from_set(triggered_hooks).forEach((id) => triggered_hooks[id]())
    }
  },
  cancel_all(hook_name) {
    hooks[hook_name] = {}
  },
  post(hook_name, content) {
    boxes[hook_name] = content
    let triggered_hooks = box_callbacks[hook_name]
    if (triggered_hooks) {
      array_from_set(triggered_hooks).forEach((id) => triggered_hooks[id](content))
    }
  },
  retrieve(hook_name, callback) {
    if (!box_callbacks[hook_name]) {
      box_callbacks[hook_name] = {}
    }
    let id = idGenerator++
    box_callbacks[hook_name][id] = callback
    if (boxes[hook_name] !== null) {
      callback(boxes[hook_name])
    }
    return () => {
      box_callbacks[hook_name][id] = false
    }
  },
}

export default event_system
