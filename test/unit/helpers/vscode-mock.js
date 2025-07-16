const sinon = require('sinon');

/**
 * Factory function to create fresh VS Code mock for each test
 */
function createVSCodeMock() {
    return {
        window: {
            createStatusBarItem: sinon.stub(),
            createTerminal: sinon.stub(),
            showErrorMessage: sinon.stub(),
            showInformationMessage: sinon.stub(),
            showWarningMessage: sinon.stub(),
            showOpenDialog: sinon.stub(),
            showQuickPick: sinon.stub(),
            withProgress: sinon.stub(),
            createOutputChannel: sinon.stub()
        },
        commands: {
            registerCommand: sinon.stub(),
            executeCommand: sinon.stub(),
            getCommands: sinon.stub()
        },
        workspace: {
            workspaceFolders: null
        },
        StatusBarAlignment: {
            Left: 1,
            Right: 2
        },
        ProgressLocation: {
            Notification: 15
        },
        extensions: {
            getExtension: sinon.stub()
        },
        Uri: {
            file: sinon.stub()
        }
    };
}

// Create initial mock
const vscodeMock = createVSCodeMock();

// Override require for 'vscode' module in tests
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
    if (id === 'vscode') {
        return vscodeMock;
    }
    return originalRequire.apply(this, arguments);
};

module.exports = vscodeMock;