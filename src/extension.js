const vscode = require('vscode');
const generateTreeFunctions = require('./generateTreeFunctions');

/**
 * Activates the Treematic extension by registering its commands.
 * 
 * @param {vscode.ExtensionContext} context - The context for the extension, containing subscriptions and other information.
 */
function activate(context) {
    console.log('Extension Treematic is now active!');

    // Define the commands to register
    const commands = [
        {
            name: 'treematic.generateTree',
            func: generateTreeFunctions.generateTree
        },
        {
            name: 'treematic.generateTreeEverything',
            func: generateTreeFunctions.generateTreeEverything
        }
    ];

    // Register each command and add to the context's subscriptions
    commands.forEach(({ name, func }) => {
        const command = vscode.commands.registerCommand(name, func);
        context.subscriptions.push(command);
        console.log(`${name} command is registered`);
    });

    // Log the current subscriptions for debugging purposes
    console.log(`Subscriptions ${context.subscriptions.toString()}`);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
