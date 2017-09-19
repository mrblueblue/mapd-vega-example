import { connection } from "./services/connection";
import { renderAll } from "./services/renderer";
import lineChart from "./charts/line";
import barChart from "./charts/bar"

connection.connect().then(renderAll);
