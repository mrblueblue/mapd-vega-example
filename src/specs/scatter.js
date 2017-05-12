module.exports = {
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
