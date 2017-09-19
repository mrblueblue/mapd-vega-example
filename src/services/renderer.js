import Registry from "./registry";

let redrawing = false;
let debounced = false;

const renderAsync = chart => chart.data().then(chart.render);
const redrawAsync = chart => chart.data().then(chart.redraw);

export function redrawAll(group) {
  if (redrawing) {
    debounced = true;
    return;
  } else {
    redrawing = true;
    const charts = Registry.list(group);
    return Promise.all(charts.map(redrawAsync)).then(() => {
      redrawing = false;
      if (debounced) {
        debounced = false;
        return Promise.all(charts.map(redrawAsync));
      }
    });
  }
}

export function renderAll(group) {
  const charts = Registry.list(group);
  return Promise.all(charts.map(renderAsync));
}
