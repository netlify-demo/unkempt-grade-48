
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');


// Define all paths in your website here
const paths = [
  '/',
  '/landing-page-a',
  '/landing-page-b',
]


// Compile each paths into a separate HtmlWebpackPlugin instance
const hwpPlugins = paths.map(path => {
  const slugs = path.split('/').filter(p => p.length > 1)

  let srcPath = '';
  if (slugs.length === 0) {
    srcPath = `./src/pages/index.html`;
  } else {
    srcPath = `./src/pages/${slugs.join('/')}/index.html`;
  }

  let destPath = '';
  if (slugs.length === 0) {
    destPath = `index.html`;
  } else {
    destPath = `${slugs.join('/')}/index.html`;
  }

  return new HtmlWebpackPlugin({
      template: srcPath,
      filename: destPath,
    })
})



// Export webpack config
module.exports = {
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      // CSS
      {
        test: /\.css$/,
        use:  [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          }]
      },
      // Handlebars (partials)
      {
        test: /\.(handlebars)$/,
        use: [
          { loader: 'handlebars-loader',
            options: {
              partialDirs: [path.resolve('./src/components')],
            }
          }, 
          { loader: 'extract-loader'},
          { loader: 'html-loader'},
        ]
      },
      // HTML Pages
      {
        test: /\.(html)$/,
        use: [
          { loader: 'handlebars-loader',
            options: {
              partialDirs: [path.resolve('./src/components')],
            }
          },
          { loader: 'extract-loader'},
          { loader: 'html-loader'},
        ]
      },
      // Assets
      {
        test: /\.(svg|png|jpg|jpeg|gif|webp)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash:8].[ext]',
            outputPath: 'img',
            publicPath: '/img',
          }
        }
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),

    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css"
    }),

  ].concat(hwpPlugins), // Add the generated HtmlWebpackPlugins
};

