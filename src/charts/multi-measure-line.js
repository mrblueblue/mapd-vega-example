import { Chart } from "../utils/chart";
import { formatTime, getExtent } from "../utils/vega";

const multiMeasureLine = new Chart("#multi-measure-line", {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["depdelay", "arrdelay"],
        ops: ["average", "average"],
        as: ["val", "val2"],
        groupby: [
          {
            type: "project",
            expr: {
              type: "date_trunc",
              unit: "day",
              field: "arr_timestamp"
            },
            as: "key0"
          },
          {
            type: "project",
            expr: {
              type: "case",
              cond: [
                [
                  {
                    type: "in",
                    expr: "dest",
                    set: [
                      "SFO",
                      "JFK",
                      "LAX",
                      "DCA"
                    ]
                  },
                  "dest"
                ]
              ],
              else: "other"
            },
            as: "key1"
          }
        ]
      },
      {
        type: "sort",
        field: ["key0", "key1"]
      },
      {
        type: "filter",
        id: "test",
        expr: {
          type: "between",
          field: "arr_timestamp",
          left: "TIMESTAMP(0) '1987-10-01 00:03:00'",
          right: "TIMESTAMP(0) '2008-12-31 23:59:00'"
        }
      }
    ]
  },
  transform: [
    {
      filter: "datum.key1 != 'other'"
    }
  ],
    layer: [
      {
        width: 480,
        mark: "line",
        "selection": {
          "grid_left": {
            "type": "interval", "bind": "scales"
          }
        },
        encoding: {
          x: {
            field: "key0",
            type: "temporal",
            axis: { title: "Arrival Time by Day", labelAngle: 0, "format": "%-m/%-d/%Y" }
          },
          y: { field: "val", type: "quantitative", axis: {title: "avg(depdelay)" }},
          color: {
            field: "key1",
            type: "nominal"
          }
        },
      },
        {
          width: 480,
          mark: "line",
          "selection": {
            "grid_right": {
              "type": "interval", "bind": "scales"
            }
          },
          encoding: {
            x: {
              field: "key0",
              type: "temporal",
            },
            y: { field: "val2", type: "quantitative", axis: {title: "avg(arrdelay)"} },
            color: {
              field: "key1",
              type: "nominal"
            },
            "opacity": {"value": 0.2}
          }
      },
      {
  "selection": {
    "index": {
      "type": "single", "on": "mousemove",
      "encodings": ["x"],
      "nearest": true
    },
      "grid_left_middle": {
        "type": "interval", "bind": "scales"
      }
  },
  "mark": "point",
  "encoding": {
    "x": {"field": "key0", "type": "temporal", "axis": null},
    "y": {"field": "val", "type": "quantitative", "axis": null},
    "opacity": {"value": 0}
  }
}
    ],
    "resolve": {"scale": {"y": "independent"}}

});

multiMeasureLine.on("filter", function filter(extent) {
  this.transform(() => [
    {
      type: "filter",
      expr: {
        type: "between",
        field: "arr_timestamp",
        left: `TIMESTAMP(0) '${formatTime(extent[0])}'`,
        right: `TIMESTAMP(0) '${formatTime(extent[1])}'`
      }
    }
  ]);
});

multiMeasureLine.on("postRender", function postRender() {

  // this.view.addSignalListener("brush1_x", () => {
  //   this.view.getState({
  //     data: (data, values) => {
  //       if (data === "brush1_store") {
  //         const extent = getExtent(values);
  //         if (extent) {
  //           console.log(extent)
  //         }
  //       }
  //     }
  //   });
  // });

  vegaTooltip.vega(this.view, {
    showAllFields: false,
    onAppear: (a, b) => console.log(a, b),
    fields: [
      {
        field: "datum.key0",
        formatType: "time",
        format: "%-m/%-d/%Y",
        title: "arr_timestamp"
      },
      {
        field: "datum.key1",
        title: "Airport"
      },
      {
        field: "datum.val",
        title: "avg(dedpdelay)"
      },
      {
        field: "datum.val2",
        title: "avg(arrdelay)"
      }
    ]
  })
});

multiMeasureLine.on("redraw", function redraw(data) {
  this.setState({ data: { source_0: data } });
});


export default multiMeasureLine;
