const vscode = require('vscode');
const PathUtils = require('../utils/pathUtils');

/**
 * Command handler for selecting virtual environment
 */
class SelectVenvCommand {
    constructor(logger, statusBarManager, environmentService) {
        this.logger = logger;
        this.statusBarManager = statusBarManager;
        this.environmentService = environmentService;
    }

    /**
     * Execute the select virtual environment command
     * @returns {Promise<void>}
     */
    async execute() {
        try {
            this.logger.info('Select virtual environment command triggered');

            // Show progress while discovering environments
            const environments = await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Discovering Python environments...',
                cancellable: false
            }, async (progress) => {
                progress.report({ message: 'Scanning for conda environments...' });
                const envs = await this.environmentService.discoverEnvironments();
                progress.report({ message: 'Discovery complete' });
                return envs;
            });

            if (environments.length === 0) {
                this.logger.info('No environments found, falling back to manual selection');
                await this.handleManualSelection();
                return;
            }

            // Show environment selection
            const selectedEnv = await vscode.window.showQuickPick(environments, {
                placeHolder: 'Select a Python environment',
                title: 'Choose Virtual Environment',
                matchOnDescription: true,
                matchOnDetail: true
            });

            if (!selectedEnv) {
                this.logger.info('No environment selected by user');
                return;
            }

            await this.handleEnvironmentSelection(selectedEnv);
        } catch (error) {
            this.logger.error('Select virtual environment command failed', error);
            vscode.window.showErrorMessage(`Failed to select virtual environment: ${error.message}`);
        }
    }

    /**
     * Handle manual environment selection
     * @returns {Promise<void>}
     */
    async handleManualSelection() {
        try {
            const response = await vscode.window.showInformationMessage(
                'No Python environments found automatically. Would you like to select a folder manually?',
                { modal: true },
                'Select Folder',
                'Cancel'
            );

            if (response !== 'Select Folder') {
                return;
            }

            // Show folder selection dialog
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Virtual Environment Folder',
                title: 'Select Python virtual environment folder'
            });

            if (!folderUri || folderUri.length === 0) {
                return;
            }

            const venvPath = folderUri[0].fsPath;

            // Validate the selection
            if (!PathUtils.isSafePath(venvPath)) {
                vscode.window.showErrorMessage('Selected path is not safe. Please select a different folder.');
                return;
            }

            if (!PathUtils.isValidVirtualEnv(venvPath)) {
                vscode.window.showErrorMessage('Selected folder does not appear to be a valid Python virtual environment.');
                return;
            }

            // Create environment object for manual selection
            const manualEnv = {
                label: `$(folder) ${PathUtils.getBasename(venvPath)}`,
                description: 'Manual Selection',
                path: venvPath,
                type: 'manual'
            };

            await this.handleEnvironmentSelection(manualEnv);
        } catch (error) {
            this.logger.error('Manual environment selection failed', error);
            vscode.window.showErrorMessage(`Manual selection failed: ${error.message}`);
        }
    }

    /**
     * Handle environment selection
     * @param {Object} selectedEnv - Selected environment object
     * @returns {void}
     */
    handleEnvironmentSelection(selectedEnv) {
        try {
            this.logger.info('Processing environment selection', {
                path: selectedEnv.path,
                type: selectedEnv.type
            });

            // Final validation
            if (!this.environmentService.validateEnvironment(selectedEnv.path)) {
                vscode.window.showErrorMessage('Selected environment is not valid. Please choose a different one.');
                return;
            }

            // Update status bar
            this.statusBarManager.updateSelectedVenv(selectedEnv.path);

            vscode.window.showInformationMessage(
                `Selected environment: ${PathUtils.getBasename(selectedEnv.path)}`
            );

            this.logger.info('Virtual environment selection completed successfully', {
                path: selectedEnv.path
            });
        } catch (error) {
            this.logger.error('Environment selection handling failed', error);
            vscode.window.showErrorMessage(`Environment selection failed: ${error.message}`);
        }
    }
}

module.exports = SelectVenvCommand;