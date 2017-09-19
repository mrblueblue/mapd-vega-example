import { Chart } from "../utils/chart";

const barChart = new Chart("#bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["depdelay"],
        ops: ["average"],
        as: ["records"],
        groupby: "dest_state"
      },
      {
        type: "sort",
        field: ["records"],
        order: ["descending"]
      },
      {
        type: "limit",
        row: 25
      }
    ]
  },
  mark: "bar",
  encoding: {
    y: {
      field: "dest_state",
      type: "ordinal",
      scale: { rangeStep: 17 }
    },
    x: {
      field: "records",
      type: "quantitative",
      axis: { title: "# Records" }
    }
  }
});

barChart.on("redraw", function redraw(data) {
  this.setState({ data: { source_0: data } });
});

export default barChart;
