const tree = require('tree-node-cli');
const fs = require('fs');
const vscode = require('vscode');

/**
 * Generates a tree representation of the directory structure and copies it to the clipboard.
 *
 * @param {vscode.Uri} resource - The resource representing the selected directory in the Explorer.
 */
function generateTree(resource) {
  // Make sure the resource argument is valid
  if (!resource) {
    vscode.window.showErrorMessage('Missing resource for generating trees.');
    return;
  }

  // Validate the path string
  let path = resource.path;
  if (typeof path !== 'string') {
    vscode.window.showErrorMessage(
      'Invalid path data type for generating trees.'
    );
    return;
  }
  if (path.length === 0) {
    vscode.window.showErrorMessage('Invalid path length for generating trees.');
    return;
  }
  if (!fs.existsSync(path)) {
    vscode.window.showErrorMessage('Invalid path. Path does not exist.');
    return;
  }

  // Now that we know the resource is safe we can grab the path and generate the tree
  try {
    let treeOutput = tree(path);
    vscode.env.clipboard.writeText(treeOutput);
    vscode.window.showInformationMessage('Tree copied to clipboard!');
    return;
  } catch (e) {
    console.log(e);
    vscode.window.showErrorMessage(`Something went wrong: ${e}`);
    return;
  }
}

function generateTreeWithIgnore() {
  vscode.window.showInformationMessage('Generating Tree! BUT WITH IGNORE!');
}

module.exports = {
  generateTree,
  generateTreeWithIgnore,
};
