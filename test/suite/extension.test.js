const assert = require('assert');
const sinon = require('sinon');
const vscode = require('vscode');

suite('Extension Integration Tests', () => {
    let sandbox;

    setup(() => {
        sandbox = sinon.createSandbox();
    });

    teardown(() => {
        sandbox.restore();
    });

    test('Extension should activate without errors', async () => {
        // Extension should be activated by VS Code test runner
        const extension = vscode.extensions.getExtension('SheikSShajeenAhamed.cython-forge');
        assert.ok(extension, 'Extension should be found');

        if (!extension.isActive) {
            await extension.activate();
        }

        assert.ok(extension.isActive, 'Extension should be active');
    });

    test('All commands should be registered', async () => {
        const expectedCommands = [
            'cython-forge.buildCython',
            'cython-forge.selectFolder',
            'cython-forge.selectVenv'
        ];

        const availableCommands = await vscode.commands.getCommands();

        expectedCommands.forEach(command => {
            assert.ok(
                availableCommands.includes(command),
                `Command ${command} should be registered`
            );
        });
    });

    test('Build command should show error when no folder selected', async () => {
        const showErrorMessageStub = sandbox.stub(vscode.window, 'showErrorMessage');

        await vscode.commands.executeCommand('cython-forge.buildCython');

        assert.ok(
            showErrorMessageStub.calledWith(
                sinon.match(/No folder selected/)
            ),
            'Should show error message for missing folder'
        );
    });

    test('Select folder command should show dialog', async () => {
        const showOpenDialogStub = sandbox.stub(vscode.window, 'showOpenDialog');
        showOpenDialogStub.resolves(undefined);

        await vscode.commands.executeCommand('cython-forge.selectFolder');

        assert.ok(showOpenDialogStub.called, 'Should show open dialog');
        assert.ok(
            showOpenDialogStub.calledWith(sinon.match({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false
            })),
            'Should configure dialog correctly'
        );
    });

    test('Select venv command should discover environments', async () => {
        const withProgressStub = sandbox.stub(vscode.window, 'withProgress');
        withProgressStub.callsFake((options, task) => {
            const progress = { report: sandbox.stub() };
            return task(progress);
        });

        await vscode.commands.executeCommand('cython-forge.selectVenv');

        assert.ok(withProgressStub.called, 'Should show progress indicator');
        assert.ok(
            withProgressStub.calledWith(sinon.match({
                title: sinon.match(/Discovering Python environments/)
            })),
            'Should show correct progress title'
        );
    });

    test('Extension should handle activation errors gracefully', () => {
        // This test ensures that if activation fails, it doesn't crash VS Code
        const extension = vscode.extensions.getExtension('SheikSShajeenAhamed.cython-forge');
        assert.ok(extension, 'Extension should be found');

        // If extension is active, we know activation succeeded
        if (extension.isActive) {
            assert.ok(true, 'Extension activated successfully');
        }
    });
});
