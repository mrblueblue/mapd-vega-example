var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: [
    "script-loader!d3/build/d3.min.js",
    "script-loader!vega/build/vega.min.js",
    "script-loader!vega-lite/build/vega-lite.min.js",
    "script-loader!vega-tooltip/build/vega-tooltip.min.js",
    "script-loader!@mapd/connector/dist/browser-connector",
    "vega-tooltip/build/vega-tooltip.min.css",
    "./src/index.js"
  ],
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "assets"),
    publicPath: "/assets/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader" ]
      }
    ]
  }
}
