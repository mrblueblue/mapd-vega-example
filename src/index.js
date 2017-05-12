import mapd from "./services/mapd"
import createRow from "./charts/row"

mapd.connect().then(init)

const filters = []

function init (error, con){
  createRow()

  mapd.query("SELECT carrier_name as key0,AVG(depdelay) AS x,AVG(arrdelay) AS y,COUNT(*) AS size FROM flights_donotmodify WHERE depdelay IS NOT NULL AND arrdelay IS NOT NULL GROUP BY key0 ORDER BY size DESC LIMIT 15")
    .then(data => {

      console.log(data)

      const spec = require("./specs/scatter")
      spec.data = {"name": "source", "values": data}


      var a = vega.parse(spec);
      var view = new vega.View(a)
        .logLevel(vega.Warn) // set view logging level
        .initialize(document.querySelector('#chart2')) // set parent DOM element
        .renderer('svg') // set render type (defaults to 'canvas')
        .run(); // update and render the view


      view.addSignalListener('filter', (a,b) => {
        console.log(a, b)
        filters.push(`carrier_name = '${b.datum.key0}'`)
        query(`SELECT dest_state, COUNT(*) as records from flights_donotmodify WHERE (${filters.join(' OR ')}) GROUP BY dest_state ORDER BY records DESC LIMIT 20`)
          .then(data => {
            viz.setState({data: {table: data}})
            // viz.update(data)

          })
      })

    })
}
