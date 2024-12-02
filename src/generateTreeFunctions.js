const tree = require('tree-node-cli');
const fs = require('fs');
const vscode = require('vscode');
const path = require('path');

const { validateResource } = require('./utils/validations');
const { convertToRegex } = require('./utils/conversions');

function generateTreeEverything(resource) {
    console.info('Generating everything tree...');
    try {
        const normalizedPath = validateResource(resource);
        if (!normalizedPath) {
            const error = new Error('Invalid resource');
            console.error(`Validation failed: ${resource}`);
            throw error;
        }

        let treeOutput = tree(
            normalizedPath,
            {
                allFiles: true,
                dirsFirst: false,
                dirsOnly: false,
                sizes: false,
                exclude: [/.git\//], // perf issues, ignoring git/
                maxDepth: Number.POSITIVE_INFINITY,
                reverse: false,
                trailingSlash: false,
                ascii: false,
            }
        );

        vscode.env.clipboard.writeText(treeOutput);
        vscode.window.showInformationMessage('Entire project tree copied to clipboard!');
        console.info('Tree generatred successfully!');
        return;
    } catch (e) {
        vscode.window.showErrorMessage(`Something went wrong: ${e.message}`);
        console.error('Error generating tree:', e);
    }
}

function generateTree(resource) {
    console.info('Generating tree...');
    try {
        const normalizedPath = validateResource(resource);
        if (!normalizedPath) {
            const error = new Error('Invalid resource');
            console.error(`Validation failed: ${resource}`);
            throw error;
        }

        // Process options to match tree-node-cli options contract.
        const config = vscode.workspace.getConfiguration("treematic");
        const treeOptions = {
            allFiles: config.get("allFiles", true),
            dirsFirst: config.get("dirsFirst", false),
            dirsOnly: config.get("dirsOnly", false),
            sizes: config.get("sizes", false),
            exclude: convertToRegex(config.get("exclude", [/node_modules\//, /venv\//, /.git\//])),
            maxDepth: config.get("maxDepth", -1) === -1 ? Number.POSITIVE_INFINITY : config.get("maxDepth"),
            reverse: config.get("reverse", false),
            trailingSlash: config.get("trailingSlash", false),
            ascii: config.get("ascii", true),
        };
        console.info(`Tree options loaded: ${JSON.stringify(treeOptions)}`);

        let treeOutput = tree(normalizedPath, treeOptions);
        
        vscode.env.clipboard.writeText(treeOutput);
        vscode.window.showInformationMessage('Project tree copied to clipboard!');
        console.info('Tree generatred successfully!');
        return;
    } catch (e) {
        vscode.window.showErrorMessage(`Something went wrong: ${e.message}`);
        console.error('Error generating tree:', e);
        return;
    }
}

module.exports = {
    generateTreeEverything,
    generateTree,
};
