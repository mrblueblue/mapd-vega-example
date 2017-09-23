import Registry from "../services/registry";
import { connection } from "../services/connection";
import { flightsDataGraph } from "../services/crossfilter";
import { redrawAll } from "../services/renderer";

let ID = 0;

const toVega = vlSpec => vega.parse(vl.compile(vlSpec).spec);

const mergeSignals = view =>
  view.getState({
    signals: (signal, props) => {
      view._signals = Object.assign(view._signals, { [signal]: props });
    }
  });

export class Chart {
  constructor(node, vlSpec) {
    this.id = ID++;
    this.state = vlSpec;
    this.node = node;

    this.dataNode = flightsDataGraph.data({
      name: this.id,
      transform: vlSpec.data.transform
    });

    this.dispatch = d3.dispatch("filterAll", "redraw", "postRender", "filter");

    Registry.register(this);
  }

  on = (...params) => {
    this.dispatch.on(...params);
  };

  filter = (...params) => {
    this.dispatch.call("filter", flightsDataGraph, ...params);
    redrawAll();
  };

  filterAll = () => {
    this.dispatch.call("filterAll");
  };

  data = () => {
    return this.dataNode.values();
  };

  render = data => {
    this.state.data = { values: data };

    this.view = new vega.View(toVega(this.state))
      .renderer("svg")
      .initialize(this.node)
      .run();

    mergeSignals(this.view);

    this.dispatch.call("postRender", this);
  };

  redraw = data => {
    this.dispatch.call("redraw", this.view, data);
  };
}
