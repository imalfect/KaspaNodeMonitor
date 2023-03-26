/* eslint-disable no-undef,max-len */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const pkg = require('./package.json');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const port = process.env.PORT || 2989;
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
  },
  devtool: 'inline-source-map',
  devServer: {
    // I had to change this, otherwise the backend + this doesn't work as expected
    // If you feel like this has to be 0.0.0.0 feel free to fix it :).
    host: '127.0.0.1',
    port: port,
    historyApiFallback: true,
    open: true,
  },
  plugins: [
    new WebpackBundleAnalyzer(),
    new HtmlWebpackPlugin({
      title: 'Kaspa Node Monitor',
      // Load a custom template (lodash by default)
      favicon: './assets/Kaspa-Icon-Green.svg',
      template: './public/index.html',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      AppVersion: JSON.stringify(pkg.version),
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    fallback: {
      'path': require.resolve('path-browserify'),
      'fs': false,
      'crypto': require.resolve('crypto-browserify'),
      'buffer': require.resolve('buffer/'),
      'stream': require.resolve('stream-browserify'),
      'os': require.resolve('os-browserify/browser'),
      'process': require.resolve('process/browser'),
    },
  },

  module: {
    rules: [
      // JS, JSX
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // CSS
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      // png/jpeg/gif
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      // woff2,ttf,eot
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      // svg
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
};
