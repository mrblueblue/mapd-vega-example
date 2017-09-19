import { Chart } from "../utils/chart";

const lineChart = new Chart("#vis", {
  $schema: "https://vega.github.io/schema/vega-lite/v2.json",
  data: {},
  vconcat: [
    {
      width: 480,
      mark: "area",
      selection: {
        filter: { type: "interval", encodings: ["x"] }
      },
      encoding: {
        x: {
          field: "key0",
          type: "temporal",
          scale: { domain: { selection: "brush" } },
          axis: { title: "", labelAngle: 0 }
        },
        y: { field: "val", type: "quantitative" }
      }
    },
    {
      width: 480,
      height: 60,
      mark: "area",
      selection: {
        brush: { type: "interval", encodings: ["x"] }
      },
      encoding: {
        x: {
          field: "key0",
          type: "temporal",
          axis: { format: "%Y", labelAngle: 0 }
        },
        y: {
          field: "val",
          type: "quantitative",
          axis: { tickCount: 3, grid: false }
        }
      }
    }
  ]
});

export default lineChart;
