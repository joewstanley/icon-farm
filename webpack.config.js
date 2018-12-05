const htmlPlugin = require('html-webpack-plugin')
const path = require('path')
const config = require('./config.json')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: [ '@babel/polyfill', './src/index.js' ],
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'js/index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: [
          'file-loader?name=css/[name].css',
          'extract-loader',
          'css-loader?url=false',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new htmlPlugin({
      template: '!!ejs-loader!templates/index.ejs',
      title: config.title,
      author: config.author,
      description: config.description,
      svg: config.svg,
      png: config.png,
      icons: config.icons
    })
  ]
}
