import { connection } from "./services/connection";
import { renderAll } from "./services/renderer";

const pathname = window.location.pathname.split("/")
const route = pathname[pathname.length - 1]

if (route === "splom.html") {
  require("./charts/splom");
} else if (route === "lines.html") {
  require("./charts/overview-detail-line");
  require("./charts/bar");
  require("./charts/faceted-line");
}

connection.connect().then(() => renderAll());
