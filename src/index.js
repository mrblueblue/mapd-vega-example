import { connection } from "./services/connection";
import { renderAll } from "./services/renderer";

switch (window.location.pathname) {
  case "/splom.html":
    require("./charts/splom");
  case "/lines.html":
    require("./charts/overview-detail-line");
    require("./charts/bar");
    require("./charts/faceted-line");
  default:
    connection.connect().then(() => renderAll());
}
