import { connection } from "./services/connection";
import { renderAll } from "./services/renderer";
import lineChart from "./charts/line";

connection.connect().then(renderAll);

// view.addSignalListener("brush_x", (a, b) => view.getState({data: (c, d) => c === "brush_store" && console.log(d.values.value[0].intervals[0].extent)}))
// view.getState({signals: (a, b) => view._signals = Object.assign(view._signals, {[a]: b})})
