import { Chart } from "../utils/chart";
import { formatTime, getExtent } from "../utils/vega";

const lineChart = new Chart("#vis", {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["*", "arrdelay"],
        ops: ["count", "average"],
        as: ["val", "val2"],
        groupby: [
          {
            type: "project",
            expr: {
              type: "date_trunc",
              unit: "day",
              field: "dep_timestamp"
            },
            as: "key0"
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
    layer: [
      {
        width: 480,
        mark: "line",
        encoding: {
          x: {
            field: "key0",
            type: "temporal",
            axis: { title: "", labelAngle: 0 }
          },
          y: { field: "val", type: "quantitative" }
        },
      },
        {
          width: 480,
          mark: "line",
          encoding: {
            x: {
              field: "key0",
              type: "temporal",
              axis: { title: "", labelAngle: 0 }
            },
            y: { field: "val2", type: "quantitative" }
          }
      }
    ],
    "resolve": {"scale": {"y": "independent"}}

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

export default lineChart;
