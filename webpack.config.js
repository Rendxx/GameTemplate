var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var extractTextPlugin = new ExtractTextPlugin("./[name].css");
var minimize = process.argv.indexOf('--optimize-minimize') !== -1;

var setting = {
    plugins: [
      //commonsPlugin,
      extractTextPlugin
    ],
    entry: {
        host : './src/host/Index',
        client : './src/client/Index'
    },
    output: {
        path: 'public/Content',
        filename: '[name].js'
    },
    module: {
       loaders: [
            {
              test: /\.js|jsx$/,
              exclude: /node_modules/,
              loader: 'babel'
            },
            {
              test: /\.css$/,
              exclude: /node_modules/,
              loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
              test: /\.less$/,
              exclude: /node_modules/,
              loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
              test: /\.(png|jpg)$/,
              exclude: /node_modules/,
              loader: 'url-loader'
            },
            {
              test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
              exclude: /node_modules/,
              loader : 'file-loader?name=../style/[name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.scss']
    }
};

if (minimize) setting.entry = {
    'host.min' : './src/host/Index',
    'client.min' : './src/client/Index'
}
module.exports = setting;
