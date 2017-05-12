import mapd from "../services/mapd"

const QUERY = `
  SELECT dest_state, COUNT(*) as records
  from flights_donotmodify GROUP BY dest_state
  ORDER BY records DESC LIMIT 20
`

const VEGA_SPEC = {
  "$schema": "https://vega.github.io/schema/vega/v3.0.json",
  "width": 400,
  "height": 400,
  "padding": 5,

  "scales": [
    {
      "name": "xscale",
      "type": "band",
      "domain": {"data": "table", "field": "dest_state"},
      "range": "width"
    },
    {
      "name": "yscale",
      "domain": {"data": "table", "field": "records"},
      "nice": true,
      "range": "height"
    }
  ],

  "axes": [
    { "orient": "bottom", "scale": "xscale" },
    { "orient": "left", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":"table"},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "dest_state", "offset": 1},
          "width": {"scale": "xscale", "band": 1, "offset": -1},
          "y": {"scale": "yscale", "field": "records"},
          "y2": {"scale": "yscale", "value": 0}
        },
        "update": {
          "fill": {"value": "steelblue"}
        },
        "hover": {
          "fill": {"value": "red"}
        }
      }
    },
    {
      "type": "text",
      "encode": {
        "enter": {
          "align": {"value": "center"},
          "baseline": {"value": "bottom"},
          "fill": {"value": "#333"}
        }
      }
    }
  ]
}

export default function createRow () {


  mapd.query(QUERY).then(data => {

    VEGA_SPEC.data = {"name": "table", "values": data}

    var a = vega.parse(VEGA_SPEC);
    var view = new vega.View(a)
      .logLevel(vega.Warn) // set view logging level
      .initialize(document.querySelector('#chart')) // set parent DOM element
      .renderer('svg') // set render type (defaults to 'canvas')
      .run(); // update and render the view

    window.viz = view

  })




}
