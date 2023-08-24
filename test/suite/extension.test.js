const assert = require('assert');
const vscode = require('vscode');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('DevLife4Me.tree-meh'));
  });

  test('Extension should activate', async function() {
    this.timeout(1 * 60 * 1000);
    await vscode.extensions.getExtension('DevLife4Me.tree-meh').activate();
    assert.ok(true);
  });

  test('Extension should have 2 registered commands', async function() {
    this.timeout(1 * 60 * 1000);
    await vscode.extensions.getExtension('DevLife4Me.tree-meh').activate();
    const commands = await vscode.commands.getCommands();
    const extensionCommands = commands.filter((command) => {
      return command.startsWith('tree-meh');
    })
    assert.strictEqual(extensionCommands.length, 2);
  });
});