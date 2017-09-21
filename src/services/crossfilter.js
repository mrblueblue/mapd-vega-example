import { connection } from "./connection";
import { createDataGraph } from "mapd-data-layer";
import { XFILTER_SIGNAL } from "../constants";

const dataGraph = createDataGraph(connection);

const flightsRoot = dataGraph.data("flights_donotmodify");

export const flightsDataGraph = enhance(flightsRoot.data("xfilter"));

function enhance(node) {
  node.transform(() => [
    {
      type: "crossfilter",
      signal: XFILTER_SIGNAL,
      filter: []
    }
  ]);

  node.xFilter = xFilter.bind(node);
  node.filterAll = filterAll.bind(node);

  return node;
}

function xFilter(id, filter) {
  const { transform } = this.getState();

  if (transform[0].type === "crossfilter") {
    const xfilters = transform[0].filter;
    const index = xfilters.findIndex(f => f.id === id);
    if (index !== -1) {
      xfilters[index] = {
        ...filter,
        id: id
      };
    } else {
      xfilters.push({
        ...filter,
        id: id
      });
    }
  }
}

function filterAll(id) {
  const { transform } = this.getState();
  const xfilters = transform[0].filter;
  const index = xfilters.findIndex(f => f.id === id);
  xfilters.splice(index, 1);
}
