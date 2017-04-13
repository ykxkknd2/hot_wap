var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');
var glob = require('glob');
var isProduction = process.env.NODE_ENV === 'production';

var deleteFolderRecursive = function(path,rmDir) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath,true);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        if(rmDir)  fs.rmdirSync(path);
    }
};

var config = {
  entry: {vendor: ['vue', 'jquery']},
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: isProduction? 'js/[name].[chunkhash].js' : 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
              css: isProduction? ExtractTextPlugin.extract({
                  use: 'css-loader',
                  fallback: 'vue-style-loader'
              }) : ['vue-style-loader','css-loader']
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
          test: /\.css$/,
          loader: isProduction? ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }) : 'style-loader!css-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
            name: 'img/[name].[hash].[ext]'
        }
      }
    ]
  },
  resolve: {
    alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'jquery$' : 'jquery/dist/jquery.min.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins : [
      new AssetsPlugin({
          filename : 'assets.json',
          path : path.join(__dirname,'../server'),
          update : false
      }),
      new webpack.optimize.CommonsChunkPlugin({
          name : 'vendor',
          minChunks: Infinity
      }),
      new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
          chunks: ['vendor']
      })
  ]
}

if (isProduction) {
  console.log('delete dist');
  deleteFolderRecursive(path.resolve(__dirname, './dist'))
  console.log('delete complete');

  config.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('css/[name].[contenthash].css')
  ])
}

var files = glob.sync('./src/main/*.js');

files.forEach(function(f){
    var name = /.*\/src\/main\/(.*)\.js/.exec(f)[1];

    config.entry[name] = f;
});

console.log(config.entry)

module.exports = config;
