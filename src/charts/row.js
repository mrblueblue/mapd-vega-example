import mapd from "../services/mapd"
import DataLayer from "../services/data-layer"

const VEGA_SPEC = {
  "$schema": "https://vega.github.io/schema/vega/v3.0.json",
  "width": 400,
  "height": 400,
  "padding": 5,

  "signals": [
    {
      "name": "filter",
      "on": [
        {"events": "*:click", "encode": "bars"},
      ]
    }
  ],

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
      "name": "bars",
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
  let view = null

  const filterStream = DataLayer.createFilterStream("row")
  const dataStream = DataLayer.createDataStream("row")

  dataStream.subscribe((data) => {
    view ? redraw(data) : render(data)
  })

  function render (data) {
    VEGA_SPEC.data = {"name": "table", "values": data}
    var runtime = vega.parse(VEGA_SPEC)
    view = new vega.View(runtime)
      .logLevel(vega.Warn)
      .initialize(document.querySelector('#chart'))
      .renderer('svg')
      .run()

    view.addSignalListener('filter', (signal, b) => {
      filterStream.onNext(`dest_state = '${b.datum.dest_state}'`)
    })
  }

  function redraw (data) {
    view.setState({data: {table: data}})
  }

  function run () {
    DataLayer.pullDataStream("row")
  }

  return {
    run
  }
}
