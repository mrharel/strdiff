module.exports = {
  entry: './src/expose',
  output: {
    filename: "strdiff.js",
    chunkFilename: "[id].bundle.js",
    path: "bin/"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}