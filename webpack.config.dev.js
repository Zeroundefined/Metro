const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const semver = require('semver');
const chalk = require('chalk');
const nodeVersion = process.version;

if (semver.lt(nodeVersion, '8.1.0')) {
  console.log(chalk.red(`Please upgrade node to 8.1, your are using ${nodeVersion}.`));
  process.exit(0);
}

module.exports = {
  mode: 'development',
  entry: 'src/index.tsx',
  output: {
    path: __dirname + './built',
    publicPath: '/built',
    filename: '[name].js',
    chunkFilename: '[name].js',
  },

  devtool: 'cheap-eval-module-source-map',
  watchOptions: {
    aggregateTimeout: 300,
    ignored: /node_modules/
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
        loader: 'file-loader',
      }
    ]
  },

  devServer: {
    // https: true,
    contentBase: path.join(__dirname, './'),
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: {
      disableDotRule: true,
      index: 'src/index.html'
    },
    stats: {
      assets: true,
      chunks: false,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: false,
      timing: true
    },
    host: '0.0.0.0',
    port: 8000,
    inline: true,
    compress: true,
    hot: true,
    hotOnly: true,
    disableHostCheck: true
  },

  externals: {},

  resolve: {
    alias: {
      'src': path.join(__dirname, 'src')
    },
    extensions: ['.ts', '.tsx', '.js', '.json', '.scss', '.css'],
    symlinks: false
  },

  performance: {
    hints: false
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendors",
          enforce: true,
        }
      }
    }
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb|zh-cn/),
    new webpack.WatchIgnorePlugin([/\.js$/]),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      cwd: process.cwd()
    })
  ]
};
