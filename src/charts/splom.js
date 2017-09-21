import { Chart } from "../utils/chart";
import { XFILTER_SIGNAL } from "../constants";

const ID = "BAR";

const barChart = new Chart("#bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["arrdelay", "depdelay", "carrierdelay"],
        ops: ["average", "average", "average"],
        as: ["x1", "y1", "x2"],
        groupby: ["dest_city"]
      }
    ]
  },
  "repeat": {
    "row": ["y1", "x1", "x2"],
    "column": ["x2", "x1", "y1"]
  },
  "spec": {
    "mark": "point",
    "selection": {
      "brush": {
        "type": "interval",
        "resolve": "union",
        "on": "[mousedown[event.shiftKey], window:mouseup] > window:mousemove!",
        "translate": "[mousedown[event.shiftKey], window:mouseup] > window:mousemove!",
        "zoom": "wheel![event.shiftKey]"
      },
      "grid": {
        "type": "interval",
        "resolve": "global",
        "bind": "scales",
        "translate": "[mousedown[!event.shiftKey], window:mouseup] > window:mousemove!",
        "zoom": "wheel![!event.shiftKey]"
      }
    },
    "encoding": {
      "x": {"field": {"repeat": "column"},"type": "quantitative"},
      "y": {"field": {"repeat": "row"},"type": "quantitative"},
      "color": {
        "condition": {
          "selection": "brush",
          "field": "dest_city",
          "type": "nominal"
        },
        "value": "grey"
      }
    }
  }
});
//
// barChart.on("redraw", function redraw(data) {
//   this.setState({ data: { source_0: data } });
// });
//
// barChart.on("filter", function filter(values) {
//   if (values.length) {
//     this.xFilter(ID, {
//       type: "filter",
//       expr: {
//         type: "in",
//         expr: "dest",
//         set: values
//       }
//     });
//   } else {
//     this.filterAll(ID);
//   }
// });
//
// barChart.on("postRender", function postRender() {
//   this.view.addEventListener("click", () => {
//     this.view.getState({
//       data: (data, values) => {
//         if (data === "paintbrush_store") {
//           const selected = values.values.value;
//           if (selected.length) {
//             this.filter(selected.map(v => v.values[0]));
//           } else {
//             this.filter(selected);
//           }
//         }
//       }
//     });
//   });
// });

export default barChart;
