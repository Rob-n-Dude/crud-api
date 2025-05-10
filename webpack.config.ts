import path from 'path'

module.exports = {
  mode: 'production',
  entry: './src/entry.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
