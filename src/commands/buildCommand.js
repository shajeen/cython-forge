const vscode = require('vscode');

/**
 * Command handler for building Cython files
 */
class BuildCommand {
    constructor(logger, statusBarManager, buildService) {
        this.logger = logger;
        this.statusBarManager = statusBarManager;
        this.buildService = buildService;
    }

    /**
     * Execute the build command
     * @returns {void}
     */
    execute() {
        try {
            this.logger.info('Build command triggered');

            // Check if selections are ready
            if (!this.statusBarManager.isReadyToBuild()) {
                const selectedFolder = this.statusBarManager.getSelectedFolder();
                const selectedVenv = this.statusBarManager.getSelectedVenv();

                if (!selectedFolder) {
                    vscode.window.showErrorMessage('No folder selected. Please select a folder containing setup.py first.');
                    return;
                }

                if (!selectedVenv) {
                    vscode.window.showErrorMessage('No virtual environment selected. Please select a Python virtual environment first.');
                    return;
                }
            }

            // Get selections
            const folderPath = this.statusBarManager.getSelectedFolder();
            const venvPath = this.statusBarManager.getSelectedVenv();

            // Execute build
            this.buildService.executeBuild(folderPath, venvPath);

            vscode.window.showInformationMessage('Cython build started successfully!');
        } catch (error) {
            this.logger.error('Build command failed', error);
            vscode.window.showErrorMessage(`Build command failed: ${error.message}`);
        }
    }
}

module.exports = BuildCommand;