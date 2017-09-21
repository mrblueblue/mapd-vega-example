import { Chart } from "../utils/chart";
import { formatTime, getExtent } from "../utils/vega";

const vconcatScatterplot = new Chart("#scatterplot", {
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["arrdelay", "depdelay", "carrierdelay", "securitydelay"],
        ops: ["average", "average", "average", "average"],
        as: ["x1", "y1", "x2", "y2"],
        groupby: ["dest_state"]
      }
    ]
  },
  vconcat: [
    {
      selection: {
        filter: { type: "interval" }
      },
      mark: "point",
      encoding: {
        x: { field: "x1", type: "quantitative" },
        y: { field: "y1", type: "quantitative" },
        color: {
          condition: {
            selection: "filter",
            field: "dest_state",
            type: "nominal"
          },
          value: "grey"
        }
      }
    },
    {
      transform: [
        {
          filter: { selection: "filter" }
        }
      ],
      mark: "point",
      encoding: {
        x: {
          field: "x2",
          type: "quantitative"
        },
        y: {
          field: "y2",
          type: "quantitative"
        },
        color: { field: "dest_state", type: "nominal" }
      }
    }
  ]
});

vconcatScatterplot.on("filter", function filter([x, y]) {
  this.transform(() => [
    {
      type: "filter",
      expr: {
        type: "between",
        field: "arrdelay",
        left: x[0],
        right: x[1]
      }
    },
    {
      type: "filter",
      expr: {
        type: "between",
        field: "depdelay",
        left: y[0],
        right: y[1]
      }
    }
  ]);
});

vconcatScatterplot.on("postRender", function postRender() {
  this.view.addSignalListener("filter_x", () => {
    this.view.getState({
      data: (data, values) => {
        if (data === "filter_store") {
          const extent = getExtent(values, 1);
          const extent2 = getExtent(values, 0);

          if (extent) {
            this.filter([extent2, [extent[1], extent[0]]]);
          }
        }
      }
    });
  });
});

// vconcatScatterplot.on("redraw", function redraw(data) {
//   this.setState({ data: { source_0: data } });
// });
//

export default vconcatScatterplot;
