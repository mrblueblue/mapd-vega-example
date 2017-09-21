import { connection } from "./services/connection";
import { renderAll } from "./services/renderer";

const pathname = window.location.pathname.split("/")
const route = pathname[pathname.length - 1]

switch (route) {
  case "splom.html":
    require("./charts/splom");
  case "lines.html":
    require("./charts/overview-detail-line");
    require("./charts/bar");
    require("./charts/faceted-line");
  default:
    connection.connect().then(() => renderAll());
}
