const vscode = require('vscode');
const generateTreeFunctions = require('./generateTreeFunctions');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension Tree-Meh is now active!');

  // Generates tree with out passing any options to the tree command
  let generateTree = vscode.commands.registerCommand(
    'tree-meh.generateTree',
    generateTreeFunctions.generateTree
  );

  // Generates a tree that listens to the .gitignore file
  let generateTreeWithIgnore = vscode.commands.registerCommand(
    'tree-meh.generateTreeWithIgnore',
    generateTreeFunctions.generateTreeWithIgnore
  );

  context.subscriptions.push(generateTree, generateTreeWithIgnore);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
