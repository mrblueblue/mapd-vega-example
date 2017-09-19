import { Thrifty } from "../utils/thrifty";

export const connection = new Thrifty({
  protocol: "https",
  host: "metis.mapd.com",
  port: "443",
  dbName: "mapd",
  user: "mapd",
  password: "HyperInteractive"
});
