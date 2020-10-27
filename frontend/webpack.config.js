const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  let port;

  if (!isProduction) {
    const frontendURL = process.env.FRONTEND_URL;

    if (!frontendURL) {
      throw new Error(`'FRONTEND_URL' environment variable is missing`);
    }

    port = Number(new URL(frontendURL).port);

    if (!port) {
      throw new Error(`'FRONTEND_PORT' environment variable should include a port`);
    }
  }

  return {
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, 'build'),
      filename: isProduction ? '[name].[contenthash].immutable.js' : 'bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.join(__dirname, 'src'),
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      alias: {
        'react': path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom')
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        favicon: './src/assets/layr-favicon-20201027.immutable.png',
        inject: false
      }),
      new webpack.EnvironmentPlugin(['BACKEND_URL'])
    ],
    ...(isProduction
      ? {
          optimization: {
            minimizer: [new TerserPlugin({terserOptions: {keep_classnames: true}})]
          }
        }
      : {
          devtool: 'eval-cheap-module-source-map',
          devServer: {
            contentBase: './build/dev',
            port,
            historyApiFallback: true
          }
        })
  };
};
