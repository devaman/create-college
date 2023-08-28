const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const CompressionPlugin  = require('compression-webpack-plugin')
const nextConfig = {
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 50 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  }
}
module.exports = {
  ...withCSS(withSass({
  target: 'serverless',
  webpack (config) {
    config.module.rules.push({
      test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
          publicPath: '/_next/static/',
          outputPath: 'static/',
          name: '[name].[ext]'
        }
      }
    })
    config.plugins.push(
      new CompressionPlugin({
        test: /\.js$|\.css$|\.html$/,
      }),
    );
    config.plugins.push(new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
    })
    )
    return config;
  }
})
),
...nextConfig
}