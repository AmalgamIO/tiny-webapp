const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const OUTPUT_DIR = 'build';
const HTML_TEMPLATE = path.resolve(__dirname, './public/index.xhtml');

module.exports = {
  entry: './src/index.tsx', // Entry point
  output: {
    path: path.resolve(__dirname, OUTPUT_DIR),
    filename: 'bundle.js',
    publicPath: '/', // For devServer and deployment
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src/App'),
    },
  },
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   use: [
      //     {
      //       loader: 'string-replace-loader',
      //       options: {
      //         search: '<!--.*?-->',
      //         replace: '', // Remove comments
      //         flags: 'g',
      //       },
      //     },
      //     {
      //       loader: 'ts-loader',
      //     },
      //   ],
      // },
      {
        test: /\.[tj]sx?$/, // TypeScript and JavaScript
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s{0,1}css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // plugins: ['tailwindcss', 'autoprefixer'],
                plugins: ['@tailwindcss/postcss', 'autoprefixer'],
              },
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, // Font files
        type: 'asset',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Images
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // Inline images smaller than 8KB
              name: 'images/[name].[hash].[ext]', // Output larger images
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: HTML_TEMPLATE, // Source HTML
      filename: 'index.html',  // Output HTML
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css', // Output CSS file
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/cfg'), // Copy config files
          to: path.resolve(__dirname, 'build/cfg'),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
    historyApiFallback: true,
    static: [
      {
        directory: path.join(__dirname, 'build'), // Serve generated files
      },
      {
        directory: path.join(__dirname, 'public'), // Serve static assets
      },
    ],
  },
};
