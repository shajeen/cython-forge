const vscode = require('vscode');
const PathUtils = require('../utils/pathUtils');

/**
 * Command handler for selecting Cython folder
 */
class SelectFolderCommand {
    constructor(logger, statusBarManager) {
        this.logger = logger;
        this.statusBarManager = statusBarManager;
    }

    /**
     * Execute the select folder command
     * @returns {Promise<void>}
     */
    async execute() {
        try {
            this.logger.info('Select folder command triggered');

            // Show folder selection dialog
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Cython Folder',
                title: 'Select folder containing setup.py'
            });

            if (!folderUri || folderUri.length === 0) {
                this.logger.info('No folder selected by user');
                return;
            }

            const folderPath = folderUri[0].fsPath;
            this.logger.info('User selected folder', { folderPath });

            // Validate path safety
            if (!PathUtils.isSafePath(folderPath)) {
                this.logger.error('Unsafe folder path selected', { folderPath });
                vscode.window.showErrorMessage('Selected path is not safe. Please select a different folder.');
                return;
            }

            // Check for setup.py
            if (!PathUtils.hasSetupPy(folderPath)) {
                const response = await vscode.window.showWarningMessage(
                    'The selected folder does not contain setup.py. This may cause build issues. Do you want to continue?',
                    { modal: true },
                    'Continue',
                    'Cancel'
                );

                if (response !== 'Continue') {
                    this.logger.info('User cancelled folder selection due to missing setup.py');
                    return;
                }
            }

            // Update status bar
            this.statusBarManager.updateSelectedFolder(folderPath);

            vscode.window.showInformationMessage(
                `Selected folder: ${PathUtils.getBasename(folderPath)}`
            );

            this.logger.info('Folder selection completed successfully', { folderPath });
        } catch (error) {
            this.logger.error('Select folder command failed', error);
            vscode.window.showErrorMessage(`Failed to select folder: ${error.message}`);
        }
    }
}

module.exports = SelectFolderCommand;