module.exports = {
  module: {
    rules: [
      {
        test: /\.xml$/i,
        use: 'raw-loader',
      },
    ],
  },
};