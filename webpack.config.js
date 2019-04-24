const { join } = require('path');
const { DefinePlugin } = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const constants = require('./constants');

module.exports = (env) => {
  const isProd = env === 'production';

  return {
    mode: isProd ? 'production' : 'development',

    devtool: isProd ? undefined : 'inline-source-map',

    entry: {
      app: ['src/index.tsx'],
    },

    output: {
      path: join(__dirname, 'app'),
    },

    watch: !isProd,

    module: {
      rules: [
        {
          test: /\.(png|jpg|gif|jpeg|svg|woff|woff2|ttf|eot|ico)$/,
          use: {
            loader: "file-loader",
            options: {
              name: '[name]-[hash].[ext]',
              outputPath: 'img',
              publicPath: './img',
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        },
        // {
        //   test: /\.css$/,
        //   exclude: /node_modules/,
        //   use: [
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         hashPrefix: 'hash',
        //         sourceMap: isProd,
        //         importLoaders: 1,
        //       },
        //     },
        //   ],
        // },
      ],
    },

    plugins: [
      new DefinePlugin({
        ...((() => {
          const c = { ...constants };
          Object.keys(c).forEach((k) => {
            c[k] = JSON.stringify(c[k]);
          });
          return c;
        })()),
        NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
      }),
      new CopyPlugin([
        { from: 'icons/*', to: '' },
        { from: 'src/img/*', to: 'img', flatten: true },
        { from: 'manifest.json', to: '' },
        { from: 'src/index.html', to: '' },
        { from: 'src/styles.css', to: '' },
      ]),
    ].concat(isProd ? [new CleanWebpackPlugin()] : []),

    target: 'node',
    node: {
      __dirname: false,
      __filename: false
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      plugins: [
        new TsconfigPathsPlugin({ configFile: 'tsconfig.json' }),
      ],
    },

    optimization: {
      minimize: isProd,
      namedModules: !isProd,
    },

    stats: {
      children: false,
    },
  };
};
