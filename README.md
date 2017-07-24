# Calendar for displaying shifts

This is the calendar used by [InstantJob](https://instantjob.fr) for displaying information about shifts.

## Installation

`npm install --save instantjob-calendar`

## Example

```
import React from 'react'
import Calendar from 'instantjob-calendar'

export default ({missions}) => (
  <Calendar
    missions={missions}
    get_mission_elements={({title, color, icon, informations, onClick}) => {
      return {title, color, icon, informations, onClick}
    }}
  />
)
```

## Props API

### `missions`

`missions` is a list of objects with an `events` key, itself a list of objects with
a `start` and `end` keys (datetime values that `moment` understands)

```
missions = [{
  events: [{
    start: "2017-11-27T11:00:00.000+01:00",
    end: "2017-11-27T15:00:00.000+01:00",
  }],
}]
```

### `get_mission_elements`

`get_mission_elements` is a function that takes as parameter the `mission` object
from the `missions` props and returns an object describing how the mission card
should look. It has 5 possible keys:
1. `title` is a string
2. `color` is a string for the round icon
3. `icon` is a react element supposed to show an icon (for instance `<MdDone />`,
   see `react-icons/lib/md`, can also be a string, such as `'?'`)
4. `information` allows to display additional informations next to the time
5. `onClick` is a function called on clicking the mission card.

## License

MIT
