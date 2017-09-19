import { connection } from "./connection";
import { createDataGraph } from "mapd-data-layer";

const dataGraph = createDataGraph(connection);

const flightsRoot = dataGraph.data("flights_donotmodify");
export const flightsDataGraph = flightsRoot.data("xfilter");
