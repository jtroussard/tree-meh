const vscode = require('vscode');
const sinon = require('sinon');
const assert = require('assert');
const extension = require('../../src/extension');
const generateTreeFunctions = require('../../src/generateTreeFunctions');

suite('extension.js', () => {
	let contextStub;

	setup(() => {
		contextStub = {
			subscriptions: []
		};
		// Stub the generateTreeFunctions to prevent real execution
		sinon.stub(generateTreeFunctions, 'generateTree').callsFake(() => { });
		sinon.stub(generateTreeFunctions, 'generateTreeEverything').callsFake(() => { });
	});

	teardown(() => {
		sinon.restore();
	});

	test('should activate the extension and register commands', () => {
		const registerCommandStub = sinon.stub(vscode.commands, 'registerCommand');

		extension.activate(contextStub);

		assert.strictEqual(registerCommandStub.callCount, 2, 'Expected two commands to be registered');
		assert.ok(registerCommandStub.calledWith('treematic.generateTree', generateTreeFunctions.generateTree), 'Expected generateTree command to be registered');
		assert.ok(registerCommandStub.calledWith('treematic.generateTreeEverything', generateTreeFunctions.generateTreeEverything), 'Expected generateTreeEverything command to be registered');

		assert.strictEqual(contextStub.subscriptions.length, 2, 'Expected two commands to be added to subscriptions');
	});

	test('should handle deactivation without issues', () => {
		// Ensure deactivate does not throw or perform unwanted operations
		assert.doesNotThrow(() => extension.deactivate(), 'Expected deactivate function to not throw an error');
	});
});
