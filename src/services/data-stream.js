import mapd from './mapd'
import Rx from "rx"

const filters = {}

function addFilter (id, filter) {
  for (let key in filters) {
    if (key !== id) {
      filters[key].push(filter)
    }
  }
}

export function filterStream (id) {
  filters[id] = []

  const eventStream = new Rx.Subject();

  eventStream.subscribe(
    function (x) {
      addFilter(id, x)
    },
    function (err) {
      console.log('Error: ' + err);
    },
    function () {
      console.log('Completed');
    }
  )

  return eventStream
}
