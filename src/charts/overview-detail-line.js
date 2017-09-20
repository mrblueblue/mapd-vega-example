import { Chart } from "../utils/chart";
import { formatTime, getExtent } from "../utils/vega";

const lineChart = new Chart("#vis", {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["val"],
        groupby: [
          {
            type: "project",
            expr: {
              type: "date_trunc",
              unit: "day",
              field: "dep_timestamp"
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
        field: ["key0"]
      },
      {
        type: "filter",
        id: "test",
        expr: {
          type: "between",
          field: "dep_timestamp",
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
  vconcat: [
    {
      width: 480,
      mark: "line",
      selection: {
        filter: { type: "interval", encodings: ["x"] }
      },
      encoding: {
        x: {
          field: "key0",
          type: "temporal",
          scale: { domain: { selection: "brush" } },
          axis: { title: "", labelAngle: 0 , "format": "%-m/%-d/%Y", grid: false}
        },
        y: { field: "val", type: "quantitative", scale: {zero: false} },
        color: {
          field: "key1",
          type: "nominal"
        }
      }
    },
    {
      width: 480,
      height: 100,
      mark: "line",
      selection: {
        brush: { type: "interval", encodings: ["x"] }
      },
      encoding: {
        x: {
          field: "key0",
          type: "temporal",
          axis: { labelAngle: 0, grid: false }
        },
        y: {
          field: "val",
          type: "quantitative",
          axis: { tickCount: 3, grid: false},
          scale: {zero: false}
        },
        color: {
          field: "key1",
          type: "nominal"
        }
      }
    }
  ]
});

lineChart.on("filter", function filter(extent) {
  this.transform(() => [
    {
      type: "filter",
      expr: {
        type: "between",
        field: "dep_timestamp",
        left: `TIMESTAMP(0) '${formatTime(extent[0])}'`,
        right: `TIMESTAMP(0) '${formatTime(extent[1])}'`
      }
    }
  ]);
});

lineChart.on("postRender", function postRender() {
  this.view.addSignalListener("filter_x", () => {
    this.view.getState({
      data: (data, values) => {
        if (data === "filter_store") {
          const extent = getExtent(values);
          if (extent) {
            this.filter(extent);
          }
        }
      }
    });
  });
});

// lineChart.on("redraw", function redraw(data) {
//   this.setState({ data: { source_0: data } });
// });

export default lineChart;
