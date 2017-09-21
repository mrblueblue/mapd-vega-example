import { Chart } from "../utils/chart";
import { XFILTER_SIGNAL } from "../constants";

const ID = "BAR";

const barChart = new Chart("#bar", {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {
    transform: [
      {
        type: "aggregate",
        fields: ["*"],
        ops: ["count"],
        as: ["records"],
        groupby: "dest"
      },
      {
        type: "sort",
        field: ["records"],
        order: ["descending"]
      },
      {
        type: "filter",
        expr: {
          type: "in",
          expr: "dest",
          set: ["SFO", "JFK", "IAD", "DCA", "OAK"]
        }
      },
      {
        type: "limit",
        row: 25
      },
      {
        type: "resolvefilter",
        filter: { signal: XFILTER_SIGNAL },
        ignore: ID
      }
    ]
  },
  selection: {
    paintbrush: {
      type: "multi",
      encodings: ["color"]
    }
  },
  height: 300,
  mark: "bar",
  encoding: {
    y: {
      field: "dest",
      type: "ordinal",
      scale: { rangeStep: 17 }
    },
    x: {
      field: "records",
      type: "quantitative",
      axis: { title: "# Records" }
    },
    color: {
      condition: {
        selection: "paintbrush",
        field: "dest",
        type: "nominal"
      },
      value: "grey"
    }
  }
});

barChart.on("redraw", function redraw(data) {
  this.setState({ data: { source_0: data } });
});

barChart.on("filter", function filter(values) {
  if (values.length) {
    this.xFilter(ID, {
      type: "filter",
      expr: {
        type: "in",
        expr: "dest",
        set: values
      }
    });
  } else {
    this.filterAll(ID);
  }
});

barChart.on("postRender", function postRender() {
  this.view.addEventListener("click", () => {
    this.view.getState({
      data: (data, values) => {
        if (data === "paintbrush_store") {
          const selected = values.values.value;
          if (selected.length) {
            this.filter(selected.map(v => v.values[0]));
          } else {
            this.filter(selected);
          }
        }
      }
    });
  });
});

export default barChart;
