import mapd from "../services/mapd"
import eventStream from "../services/data-stream"

const VEGA_SPEC = {
  "$schema": "https://vega.github.io/schema/vega/v3.0.json",
  "width": 400,
  "height": 400,
  "padding": 5,
  "autosize": "pad",

  "signals": [
    {
      "name": "filter",
      "on": [
        {"events": "*:click", "encode": "marks"},
      ]
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "x"},
      "range": [0,400]
    },
    {
      "name": "y",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "y"},
      "range": [400,0]
    },
    {
      "name": "size",
      "type": "linear",
      "round": true,
      "nice": false,
      "zero": true,
      "domain": {"data": "source", "field": "size"},
      "range": [4,361]
    },
    {
      "name": "color",
      "type": "ordinal",
      "range": {"scheme": "category10"},
      "domain": {"data": "source", "field": "key0"}
    }
  ],

  "axes": [
    {
      "scale": "x",
      "grid": true,
      "domain": false,
      "orient": "bottom",
      "tickCount": 5,
      "title": "x"
    },
    {
      "scale": "y",
      "grid": true,
      "domain": false,
      "orient": "left",
      "titlePadding": 5,
      "title": "y"
    }
  ],

  "legends": [
    {
      "size": "size",
      "title": "size",
      "format": "s",
      "encode": {
        "symbols": {
          "update": {
            "strokeWidth": {"value": 2},
            "opacity": {"value": 0.5},
            "stroke": {"value": "#4682b4"},
            "shape": {"value": "circle"}
          }
        }
      }
    }
  ],

  "marks": [
    {
      "name": "marks",
      "type": "symbol",
      "from": {"data": "source"},
      "encode": {
        "update": {
          "x": {"scale": "x", "field": "x"},
          "y": {"scale": "y", "field": "y"},
          "size": {"scale": "size", "field": "size"},
          "shape": {"value": "circle"},
          "strokeWidth": {"value": 2},
          "fill": {"scale": "color", "field": "key0"}
        }
      }
    }
  ]
}


const filters = []

export default function createScatter () {
  mapd.query("SELECT carrier_name as key0,AVG(depdelay) AS x,AVG(arrdelay) AS y,COUNT(*) AS size FROM flights_donotmodify WHERE depdelay IS NOT NULL AND arrdelay IS NOT NULL GROUP BY key0 ORDER BY size DESC LIMIT 15")
    .then(data => {

      console.log(data)

      VEGA_SPEC.data = {"name": "source", "values": data}


      var a = vega.parse(VEGA_SPEC);
      var view = new vega.View(a)
        .logLevel(vega.Warn)
        .initialize(document.querySelector('#chart2'))
        .renderer('svg')
        .run()


      view.addSignalListener('filter', (signal ,b) => {
        console.log(b)
        filters.push(`carrier_name = '${b.datum.key0}'`)

        eventStream.onNext(filters)

        mapd.query(`SELECT dest_state, COUNT(*) as records from flights_donotmodify WHERE (${filters.join(' OR ')}) GROUP BY dest_state ORDER BY records DESC LIMIT 20`)
          .then(data => {
            viz.setState({data: {table: data}})
            // viz.update(data)

          })
      })

    })
}
