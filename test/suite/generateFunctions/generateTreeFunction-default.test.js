const assert = require('assert');
const sinon = require('sinon');
const vscode = require('vscode');
const fs = require('fs');
var proxyquire = require('proxyquire')

const pathToGenerateFunctions = '../../../src/generateTreeFunctions.js';
suite('generateTree Command Test Suite', function () {
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

    const genTreeStub = proxyquire(
      pathToGenerateFunctions,
      {
        'tree-node-cli': treeStub,
        'vscode': {
          'env': {
            'clipboard': mockClipboard
          }
        }
      });
    existsSyncStub.returns(true);

    await genTreeStub.generateTree(mockedUriResource);
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
        await genTreeStub.generateTree(invalidUriResource);
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

  test('Should show an error message if an exception occurs', async function () {
    const validateResourceStub = sandbox.stub().returns('/valid/path');
    const treeStub = sandbox.stub().throws(new Error('Test exception'));

    const genTreeStub = proxyquire(pathToGenerateFunctions, {
      './utils/validations': { validateResource: validateResourceStub },
      'tree-node-cli': treeStub
    });

    await genTreeStub.generateTree(mockedUriResource);

    assert(showErrorMessageSpy.calledOnce, 'Error message should be shown');
    assert(showErrorMessageSpy.calledWithMatch(/Something went wrong: Test exception/), 'Correct error should be shown');
  });

  test('Should use custom configuration options for tree generation', async function () {
    const treeStub = sandbox.stub().returns('tree with custom config');

    mockClipboardWriteText = sandbox.stub();
    const mockClipboard = { writeText: mockClipboardWriteText };

    const genTreeStub = proxyquire(
      pathToGenerateFunctions,
      {
        'tree-node-cli': treeStub,
        'vscode': {
          'env': {
            'clipboard': mockClipboard
          }
        }
      });
    existsSyncStub.returns(true);

    const mockConfig = {
      get: sandbox.stub().callsFake((key, defaultValue) => {
        const customConfig = {
          allFiles: false,
          maxDepth: 2,
          ascii: false,
        };
        return customConfig[key] ?? defaultValue;
      }),
    };

    sandbox.stub(vscode.workspace, 'getConfiguration').returns(mockConfig);

    await genTreeStub.generateTree(mockedUriResource);

    assert(mockConfig.get.called, 'get() should be called');
    assert(mockConfig.get.calledWith('allFiles', true), 'get() should be called with key "allFiles" and default value true');
    assert(mockConfig.get.calledWith('maxDepth', -1), 'get() should be called with key "maxDepth" and default value -1');
    assert(mockConfig.get.calledWith('ascii', true), 'get() should be called with key "ascii" and default value true');
    assert(
      treeStub.calledWithMatch('/valid/path', {
        allFiles: false,
        maxDepth: 2,
        ascii: false,
      }),
      'Custom config should be used'
    );
  });

  test('Should write generated tree to clipboard', async function () {
    const validateResourceStub = sandbox.stub().returns('/valid/path');
    const treeStub = sandbox.stub().returns('sample tree output');
    const mockClipboard = { writeText: sandbox.stub() };

    const genTreeStub = proxyquire(pathToGenerateFunctions, {
      'tree-node-cli': treeStub,
      './utils/validations': { validateResource: validateResourceStub },
      'vscode': { env: { clipboard: mockClipboard } }
    });

    await genTreeStub.generateTree(mockedUriResource);

    assert(mockClipboard.writeText.calledOnce, 'Clipboard writeText should be called');
    assert(mockClipboard.writeText.calledWith('sample tree output'), 'Correct tree output should be written to clipboard');
  });

  test('Should pass correct default options to tree-node-cli', async function () {
    const validateResourceStub = sandbox.stub().returns('/valid/path');
    const treeStub = sandbox.stub().returns('default tree output');
    const genTreeStub = proxyquire(pathToGenerateFunctions, {
      'tree-node-cli': treeStub,
      './utils/validations': { validateResource: validateResourceStub },
    });

    await genTreeStub.generateTree(mockedUriResource);

    assert(treeStub.calledOnce, 'Tree generation should be called');
    assert(treeStub.calledWithMatch('/valid/path', {
      allFiles: true,
      dirsFirst: false,
      dirsOnly: false,
      sizes: false,
      exclude: sinon.match.array,
      maxDepth: Number.POSITIVE_INFINITY,
      reverse: false,
      trailingSlash: false,
      ascii: false
    }), 'Default options should be passed to tree-node-cli');
  });
});
