// check node version
const semver = require('semver');
const chalk = require('chalk');
const nodeVersion = process.version;
if (semver.lt(nodeVersion, '8.1.0')) {
  console.log(chalk.red(`Please upgrade node to 8.1, your are using ${nodeVersion}.`));
  process.exit(0);
}

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const branch = process.env.branch;

module.exports = {
  mode: 'production',
  entry: 'src/index.tsx',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          'cache-loader',
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 3,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              transpileOnly: true ,
              reportFiles: ["src/**/*.{ts,tsx}"],
              configFile: path.resolve(__dirname, './tsconfig.json')
            },
          }
        ]
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'node_modules/antd/')],
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          'style-loader',
          'css-loader?sourceMap&minimize',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sourceMapContents: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg)$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'file-loader',
            options: {name: '[name].png'}  
          }
        ]
      }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/g,
          chunks: 'initial',
          name: 'vendors',
          enforce: true,
        }
      }
    }
  },

  bail: true,
  stats: {
    assets: true,
    chunks: false,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    modules: false
  },
  externals: {},

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      react: path.resolve('node_modules/react'),
      src: path.join(__dirname, './src'),
      lodash: path.resolve('node_modules/lodash'),
      moment: path.resolve('node_modules/moment'),
    },
    symlinks: false
  },

  performance: {
    hints: false
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: false,
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb|zh-cn/),
  ]
};
