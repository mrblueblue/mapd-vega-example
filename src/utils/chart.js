import Registry from "../services/registry";
import { connection } from "../services/connection";

let ID = 0;
const toVega = vlSpec => vega.parse(vl.compile(vlSpec).spec);

export class Chart {
  constructor(node, vlSpec) {
    this.id = ID++;
    this.dispatch = d3.dispatch("filterAll", "redraw");
    this.state = vlSpec;
    this.node = node;
    Registry.register(this);
  }

  on = (...params) => {
    this.dispatch.on(...params);
  };

  filterAll = () => {
    this.dispatch.call("filterAll");
  };

  data = () => {
    return connection.query(
      "SELECT date_trunc(day, dep_timestamp) as key0,COUNT(*) AS val FROM flights_donotmodify WHERE (dep_timestamp >= TIMESTAMP(0) '2008-01-01 00:01:00' AND dep_timestamp <= TIMESTAMP(0) '2008-12-31 23:59:00') GROUP BY key0 ORDER BY key0"
    );
  };

  render = data => {
    this.state.data = { values: data };
    this.view = new vega.View(toVega(this.state))
      .renderer("svg")
      .initialize(this.node)
      .run();
  };

  redraw = () => {
    this.dispatch.call("redraw");
  };
}
