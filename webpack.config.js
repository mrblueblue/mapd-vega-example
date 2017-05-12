var path = require("path");
module.exports = {
  entry: {
    app: [
      "script-loader!@mapd/connector/thrift/browser/thrift",
      "script-loader!@mapd/connector/thrift/browser/mapd.thrift",
      "script-loader!@mapd/connector/thrift/browser/mapd_types",
      "script-loader!@mapd/connector/dist/mapd-connector",
      "script-loader!vega/build/vega-core",
      "./src/index"
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/assets/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: path.resolve(__dirname, "src")
      }
    ]
  }

};
