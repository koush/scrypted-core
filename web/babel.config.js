module.exports = {
  plugins: [
    "@babel/plugin-transform-typescript",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-modules-commonjs"
  ],
  presets: [
    '@vue/app',
    '@babel/preset-typescript'
  ]
}
