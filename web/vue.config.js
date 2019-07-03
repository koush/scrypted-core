const scryptedServer = 'https://192.168.2.27:9443';

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
    resolve: {
      extensions: ['.js', '.ts', '.vue']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          enforce: "pre"
        },
        {
          test: /\.(ts|js)x?$/,
          // unsure if this is correct... need to transpile node modules at times.
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              "plugins": [
                "@babel/plugin-transform-typescript",
              ],
              "presets": [
                '@vue/app',
                "@babel/typescript",
              ]
            }
          }
        }
      ]
    },
  },
  chainWebpack: config => config.resolve.symlinks(false),
  runtimeCompiler: true,
  devServer: {
    https: true,
    proxy: {
      '^/(login|static|endpoint|whitelist|web)': proxyOpts,
    }
  }
}