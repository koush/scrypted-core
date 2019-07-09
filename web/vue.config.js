const scryptedServer = 'https://192.168.2.27:9443';
const path = require('path');

const proxyOpts = {
  changeOrigin: true,
  ws: true,
  target: scryptedServer,
  onProxyReq: (proxyReq) => {
    // required by scrypted which does referer host check when something POSTs to it.
    // cross origin posts not allowed. is this automatically done by the browser?
    proxyReq.removeHeader('Referer');
  },
};

module.exports = {
  configureWebpack: {
    // devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.ts', '.vue'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)?$/,
          use: ["source-map-loader"],
          enforce: "pre"
        },
        {
          test: /\.(ts|js)x?$/,
          // unsure if this is correct... need to transpile node modules at times.
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          }
        }
      ]
    },
  },
  chainWebpack: config => config.resolve.symlinks(false),
  runtimeCompiler: false,
  devServer: {
    // port: 3000,
    // disableHostCheck: true,
    // public: 'home.koushikdutta.com',
    https: true,
    proxy: {
      '^/(login|static|endpoint|whitelist|web)': proxyOpts,
    }
  }
}
