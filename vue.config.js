module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 240000,
      }
    }
  }
}