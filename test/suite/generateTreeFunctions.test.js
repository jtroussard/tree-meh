const assert = require('assert');
const sinon = require('sinon');
const vscode = require('vscode');
const fs = require('fs');
var proxyquire =  require('proxyquire')

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

    // vscode.Uri
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
    // Mock genreateTreeFunctions and stub dependencies
    treeOutputStub = 'predefined tree output';
    treeStub = function () {  return treeOutputStub };
    // Mock vscode env clipboard
    mockClipboardWriteText = sandbox.stub();
    const mockClipboard = { writeText: mockClipboardWriteText };
    // Use proxyquire - This solved like all my mocking issues
    const genTreeStub = proxyquire(
      '../../src/generateTreeFunctions.js',
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
    console.log(`${JSON.stringify(genTreeStub.vscode)}`);
    assert(showInformationMessageSpy.calledOnce);
    assert(showErrorMessageSpy.notCalled);
    assert(mockClipboardWriteText.calledOnce);
  });

  test('Should generate and copy tree less dependency directories to clipboard for valid resource', async function () {
    // Mock generateTreeLessDependencyDirs and stub dependencies
    treeOutputStub = 'predefined tree output less dependencies';
    // eslint-disable-next-line no-unused-vars
    treeStub = function (_path, _options) {
      //console.log(`Called with path: ${path} and options:`, options);
      return treeOutputStub;
    };
    

    // Mock vscode env clipboard
    mockClipboardWriteText = sandbox.stub();
    const mockClipboard = { writeText: mockClipboardWriteText };

    // Use proxyquire to inject mocks
    const genTreeLessDependencyDirsStub = proxyquire(
        '../../src/generateTreeFunctions.js',
        { 
          'tree-node-cli': treeStub,
          'vscode': {
            'env': {
              'clipboard': mockClipboard
            }
          }
        });

    existsSyncStub.returns(true);

    await genTreeLessDependencyDirsStub.generateTreeLessDependencyDirs(mockedUriResource);
    assert(existsSyncStub.calledWith(mockedUriResource.fsPath));
    assert(showInformationMessageSpy.calledOnceWith('Tree less dependency directories copied to clipboard!'));
    assert(showErrorMessageSpy.notCalled);
    assert(mockClipboardWriteText.calledOnceWith(treeOutputStub));
  });
});
