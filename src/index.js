import { connection } from "./services/connection";
import { renderAll } from "./services/renderer";
import lineChart from "./charts/overview-detail-line";
// import barChart from "./charts/bar"
import multiMeasureLine from "./charts/multi-measure-line"
// import vconcatScatterplot from "./charts/vconcat-scatterplot"

connection.connect().then(renderAll);
