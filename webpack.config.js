const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js',
  },
  devServer: {
    static: path.resolve(__dirname,"src"),
    open: true,
    port: 3000,
    hot: true
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false, // Можно отключить минификацию в режиме разработки
            }
          },
          {
            loader: 'posthtml-loader',
            options: {
              plugins: [
                require("posthtml-include")({
                  root: path.resolve(__dirname, "src")
                })
              ]
            }
          }
        ]
      },{
        test: /\.hbs$/,
        use: [
          {
            loader: 'handlebars-loader', // ✅ Исправлено название
            options: {
              partialDirs: path.resolve(__dirname, "src/templates") // ✅ Исправлено "partialDirs"
            }
          }
        ]
      }
    ]}
  }


