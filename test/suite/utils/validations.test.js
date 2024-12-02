const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const vscode = require('vscode');
const assert = require('assert');
const { validateResource } = require('../../../src/utils/validations.js'); // Adjust the path as needed

suite('validateResource', () => {
    let showErrorMessageStub;

    setup(() => {
        // Stub the showErrorMessage method to prevent actual VS Code error messages
        showErrorMessageStub = sinon.stub(vscode.window, 'showErrorMessage');
    });

    teardown(() => {
        sinon.restore();
    });

    test('should return null and show an error if resource is null', () => {
        const result = validateResource(null);
        assert.strictEqual(result, null, 'Expected result to be null');
        assert.strictEqual(
            showErrorMessageStub.calledOnceWith('Missing resource for generating trees.'),
            true,
            'Expected showErrorMessage to be called with correct message'
        );
    });

    test('should return null and show an error if resource has an invalid path', () => {
        const resource = { fsPath: null };
        const result = validateResource(resource);
        assert.strictEqual(result, null, 'Expected result to be null');
        assert.strictEqual(
            showErrorMessageStub.calledOnceWith('Invalid path data type for generating trees: object'),
            true,
            'Expected showErrorMessage to be called with correct message'
        );
    });

    // See implmentation for context on why I am leaving this commented test in the code base.
    //
    // test('should return null and show an error if resource path length is zero', () => {
    //     const resource = { fsPath: '' };
    //     const result = validateResource(resource);
    //     assert.strictEqual(result, null, 'Expected result to be null');
    //     assert.strictEqual(
    //         showErrorMessageStub.calledOnceWith('Invalid path length for generating trees: 0'),
    //         true,
    //         'Expected showErrorMessage to be called with correct message'
    //     );
    // });

    test('should return null and show an error if resource path does not exist', () => {
        const resource = { fsPath: '/invalid/path' };
        const fsExistsStub = sinon.stub(fs, 'existsSync').returns(false);

        const result = validateResource(resource);
        assert.strictEqual(result, null, 'Expected result to be null');
        assert.strictEqual(fsExistsStub.calledOnceWith('/invalid/path'), true, 'Expected fs.existsSync to be called with correct path');
        assert.strictEqual(
            showErrorMessageStub.calledOnceWith('Invalid path. Path does not exist: /invalid/path'),
            true,
            'Expected showErrorMessage to be called with correct message'
        );
    });

    test('should return normalized path if resource is valid', () => {
        const resource = { fsPath: '/valid/path' };
        const fsExistsStub = sinon.stub(fs, 'existsSync').returns(true);

        const result = validateResource(resource);
        assert.strictEqual(result, path.normalize('/valid/path'), 'Expected result to be the normalized path');
        assert.strictEqual(fsExistsStub.calledOnceWith('/valid/path'), true, 'Expected fs.existsSync to be called with correct path');
        assert.strictEqual(showErrorMessageStub.notCalled, true, 'Expected showErrorMessage not to be called');
    });
});
