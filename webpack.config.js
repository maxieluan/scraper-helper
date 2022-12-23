const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const ManifestVersionSyncPlugin = require('webpack-manifest-version-sync-plugin');

module.exports = {
  entry: {
    options: './src/options.js',
    background: './src/background.js',
    panel: './src/panel.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HTMLPlugin({
      chunks: ['options'],
      filename: 'options.html',
      title: 'Options page title',
    }),

    new HTMLPlugin({
      chunks: ['panel'],
      filename: 'panel.html',
    }),

    new CopyPlugin({
      patterns: [
        { from: './src/_locales/', to: './_locales' },
        { from: './src/assets', to: './assets' },
        { from: './src/manifest.json', to: './manifest.json' },
        { from: './src/*.html', to: './'},
        { from: './src/devtools.js', to: './devtools.js' },
      ]
    }),
    new ManifestVersionSyncPlugin(),
  ],
  optimization: {
    minimize: true,
  },
  mode: 'production',
  stats: 'minimal',
};
