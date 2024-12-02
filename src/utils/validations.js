const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

/**
 * Validates the resource and returns the normalized path if valid.
 *
 * @param {vscode.Uri} resource - The resource representing the selected directory in the Explorer.
 * @returns {string|null} - The normalized path if valid, otherwise null.
 */
function validateResource(resource) {
    console.log('Validating resource...');
    if (!resource) {
        console.log('Resource is null');
        vscode.window.showErrorMessage('Missing resource for generating trees.');
        return null;
    }

    if (typeof resource.fsPath !== 'string') {
        console.log(`Invalid path data type: ${typeof resource.fsPath}`);
        vscode.window.showErrorMessage(`Invalid path data type for generating trees: ${typeof resource.fsPath}`);
        return null;
    }

    const normalizedPath = path.normalize(resource.fsPath);

    // While writing tests it looks like this conditional check is also covered by
    // the if !resource check before the string is even normalized. Leaving this comment here 
    // in case this condition comes up and as a reminder that I am no longer explicitly testing
    // the path length.
    //
    // if (normalizedPath.length === 0) {
    //     console.log(`Invalid path length: ${normalizedPath.length}`);
    //     vscode.window.showErrorMessage(`Invalid path length for generating trees: ${normalizedPath.length}`);
    //     return null;
    // }

    if (!fs.existsSync(normalizedPath)) {
        console.log(`Path does not exist: ${normalizedPath}`);
        vscode.window.showErrorMessage(`Invalid path. Path does not exist: ${normalizedPath}`);
        return null;
    }

    return normalizedPath;
}

module.exports = { validateResource };
