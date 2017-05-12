import mapd from './mapd'
import Rx from "rx"

const filters = {}

function addFilter (id, filter) {


}

export function filterStream (id) {
  const eventStream = new Rx.Subject();

  eventStream.subscribe(
    function (x) {
      console.log('Next: ' + x);
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
