import { Chart } from "../utils/chart";

const splomChart = new Chart("#splom", {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["arrdelay", "depdelay", "carrierdelay", "*"],
        ops: ["average", "average", "average", "count"],
        as: ["arrdelay", "depdelay", "carrierdelay", "records"],
        groupby: ["dest_city"]
      },
      {
        type: "sort",
        field: ["records"],
        order: ["descending"]
      },
      {
        type: "limit",
        row: 50
      }
    ]
  },
  repeat: {
    row: ["depdelay", "arrdelay", "carrierdelay"],
    column: ["carrierdelay", "arrdelay", "depdelay"]
  },
  spec: {
    mark: "point",
    config: {
      legend: null

    },
    selection: {
      brush: {
        type: "interval",
        resolve: "union",
        on: "[mousedown[event.shiftKey], window:mouseup] > window:mousemove!",
        translate:
          "[mousedown[event.shiftKey], window:mouseup] > window:mousemove!",
        zoom: "wheel![event.shiftKey]"
      },
      grid: {
        type: "interval",
        resolve: "global",
        bind: "scales",
        translate:
          "[mousedown[!event.shiftKey], window:mouseup] > window:mousemove!",
        zoom: "wheel![!event.shiftKey]"
      }
    },
    encoding: {
      x: { field: { repeat: "column" }, type: "quantitative" },
      y: { field: { repeat: "row" }, type: "quantitative" },
      color: {
        condition: {
          selection: "brush",
          field: "dest_city",
          type: "nominal"
        },
        value: "grey",
      }
    }
  }
});

splomChart.on("postRender", function postRender() {
  vegaTooltip.vega(this.view, {
    showAllFields: true
  });
});

export default splomChart;
