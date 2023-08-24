const path = require('path');

module.exports = {
  target: 'webworker',
  entry: './src/extension.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
    },
    mainFields: ['browser', 'module', 'main'],
  },
  externals: {
    child_process: 'require("child_process")',
    fs: 'require("fs")',
    vscode: 'commonjs vscode',
  },
};
