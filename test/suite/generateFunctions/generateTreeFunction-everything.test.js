const assert = require('assert');
const sinon = require('sinon');
const vscode = require('vscode');
const fs = require('fs');
var proxyquire = require('proxyquire')

const pathToGenerateFunctions = '../../../src/generateTreeFunctions.js';
suite('generateTreeEverything Command Test Suite', function () {
    let sandbox;
    let mockedUriResource;
    let showInformationMessageSpy;
    let showErrorMessageSpy;
    let existsSyncStub;
    let treeOutputStub = 'predefined tree output';
    let treeStub = {};
    let mockClipboardWriteText;

    setup(function () {
        sandbox = sinon.createSandbox();
        mockedUriResource = {
            fsPath: '/valid/path',
            options: {}
        };

        showInformationMessageSpy = sandbox.spy(vscode.window, 'showInformationMessage');
        showErrorMessageSpy = sandbox.spy(vscode.window, 'showErrorMessage');
        existsSyncStub = sandbox.stub(fs, 'existsSync');
    });

    teardown(function () {
        sandbox.restore();
    });

    test('Should generate and copy tree to clipboard for valid resource', async function () {
        treeOutputStub = 'predefined tree output';
        treeStub = function () { return treeOutputStub };

        mockClipboardWriteText = sandbox.stub();
        const mockClipboard = { writeText: mockClipboardWriteText };

        const genTreeStub = proxyquire(pathToGenerateFunctions,
            {
                'tree-node-cli': treeStub,
                'vscode': {
                    'env': {
                        'clipboard': mockClipboard
                    }
                }
            });
        existsSyncStub.returns(true);

        await genTreeStub.generateTreeEverything(mockedUriResource);
        assert(showInformationMessageSpy.calledOnce);
        assert(showErrorMessageSpy.notCalled);
        assert(mockClipboardWriteText.calledOnce);
    });

    test('Should throw an error for an invalid resource', async function () {
        const invalidUriResource = { fsPath: '', options: {} };
        const validateResourceStub = sandbox.stub().returns(null);

        mockClipboardWriteText = sandbox.stub();
        const mockClipboard = { writeText: mockClipboardWriteText };

        const genTreeStub = proxyquire(pathToGenerateFunctions, {
            'vscode': {
                'env': {
                    'clipboard': mockClipboard
                }
            }, './utils/validations': { validateResource: validateResourceStub }
        });

        try {
            await genTreeStub.generateTreeEverything(invalidUriResource);
            assert.throws(() => {
                throw new Error('Whoops');
            }, Error, 'Whoops');
        } catch (e) {
            assert.strictEqual(e.message, 'Invalid resource', 'Error message should match "Invalid resource"');
            assert.strictEqual(e.name, 'Error', 'Error name should be "Error"');
        }

        assert(showInformationMessageSpy.notCalled, 'No information message should be shown');
        assert(mockClipboardWriteText.notCalled, 'Clipboard writeText should not be called');
    });


    test('Should use default everything configuration options for tree generation', async function () {
        const treeStub = sandbox.stub().returns('tree with custom config');

        mockClipboardWriteText = sandbox.stub();
        const mockClipboard = { writeText: mockClipboardWriteText };

        const genTreeStub = proxyquire(pathToGenerateFunctions,
            {
                'tree-node-cli': treeStub,
                'vscode': {
                    'env': {
                        'clipboard': mockClipboard
                    }
                }
            });
        existsSyncStub.returns(true);

        await genTreeStub.generateTreeEverything(mockedUriResource);

        assert(
            treeStub.calledWithMatch('/valid/path', {
                allFiles: true,
                dirsFirst: false,
                dirsOnly: false,
                sizes: false,
                exclude: [/.git\//],
                maxDepth: Number.POSITIVE_INFINITY,
                reverse: false,
                trailingSlash: false,
                ascii: false,
            }),
            'Default Everything config should be used'
        );
    });

    test('Should write generated everything tree to clipboard', async function () {
        const validateResourceStub = sandbox.stub().returns('/valid/path');
        const treeStub = sandbox.stub().returns('sample tree output');
        const mockClipboard = { writeText: sandbox.stub() };

        const genTreeStub = proxyquire(pathToGenerateFunctions,
            {
                'tree-node-cli': treeStub,
                './utils/validations': { validateResource: validateResourceStub },
                'vscode': { env: { clipboard: mockClipboard } }
            });

        await genTreeStub.generateTreeEverything(mockedUriResource);

        assert(mockClipboard.writeText.calledOnce, 'Clipboard writeText should be called');
        assert(mockClipboard.writeText.calledWith('sample tree output'), 'Correct tree output should be written to clipboard');
    });
});
