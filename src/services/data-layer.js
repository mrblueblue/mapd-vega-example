import mapd from './mapd'
import Rx from "rx"

function writeSQL (type, filters) {
  switch (type) {
    case "scatter":
      const whereClauseScatter = `WHERE depdelay IS NOT NULL AND arrdelay IS NOT NULL ${filters.length ? "AND (" + filters.join(" OR ") + ")" : ""}`
      return `
        SELECT carrier_name as key0,AVG(depdelay) AS x,AVG(arrdelay) AS y,COUNT(*) AS size
        FROM flights_donotmodify ${whereClauseScatter}
        GROUP BY key0 ORDER BY size DESC LIMIT 15
      `
    case "row":
      const whereClause = filters.length ? `WHERE ${filters.join(" OR ")}` : ""
      return `
        SELECT dest_state, COUNT(*) as records
        from flights_donotmodify ${whereClause} GROUP BY dest_state
        ORDER BY records DESC LIMIT 20
      `
    default:
      return ""
  }
}

function dataLayer () {
  const filters = {}
  const filterStreams = {}
  const dataStreams = {}

  function pushFilters (type, filter) {
    for (let key in filters) {
      if (key !== type) {
        filters[key].push(filter)
      }
    }
    console.log('filters', filters)
  }

  function pullDataStream (type) {
    const stmt = writeSQL(type, filters[type])
    console.log(stmt)
    mapd.query(stmt).then(data => {
      dataStreams[type].onNext(data)
    })
  }

  function pullDataStreams (type) {
    for (let key in dataStreams) {
      if (key !== type) {
        pullDataStream(key)
      }
    }
  }

  function createFilterStream (type) {
    const stream = new Rx.Subject()

    stream.subscribe((filter) => {
      console.log(type, filter)
      pushFilters(type, filter)
      pullDataStreams(type)
    })

    filters[type] = []
    filterStreams[type] = stream

    return stream
  }


  function createDataStream (type) {
    const stream = new Rx.Subject()
    dataStreams[type] = stream

    return stream
  }

  return {
    createFilterStream,
    createDataStream,
    pullDataStream
  }
}


export default dataLayer()
