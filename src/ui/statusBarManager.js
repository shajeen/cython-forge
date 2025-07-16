const vscode = require('vscode');
const PathUtils = require('../utils/pathUtils');

/**
 * Manages status bar items for the Cython Forge extension
 */
class StatusBarManager {
    constructor(logger) {
        this.logger = logger;
        this.buildButton = null;
        this.selectFolderButton = null;
        this.selectVenvButton = null;
        this.selectedFolder = null;
        this.selectedVenv = null;
    }

    /**
     * Initialize all status bar items
     * @param {vscode.ExtensionContext} context - Extension context
     */
    initialize(context) {
        try {
            this.createStatusBarItems();
            this.registerStatusBarItems(context);
            this.logger.info('Status bar items initialized');
        } catch (error) {
            this.logger.error('Failed to initialize status bar items', error);
            throw error;
        }
    }

    /**
     * Create status bar items
     */
    createStatusBarItems() {
        // Build button
        this.buildButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.buildButton.text = '$(tools) Build Cython';
        this.buildButton.tooltip = 'Build Cython files';
        this.buildButton.command = 'cython-forge.buildCython';

        // Select folder button
        this.selectFolderButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            99
        );
        this.selectFolderButton.text = '$(file-directory) Select Cython Folder';
        this.selectFolderButton.tooltip = 'Select folder containing setup.py';
        this.selectFolderButton.command = 'cython-forge.selectFolder';

        // Select virtual environment button
        this.selectVenvButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            98
        );
        this.selectVenvButton.text = '$(rocket) Select Virtual Environment';
        this.selectVenvButton.tooltip = 'Select Python virtual environment';
        this.selectVenvButton.command = 'cython-forge.selectVenv';
    }

    /**
     * Register status bar items with context
     * @param {vscode.ExtensionContext} context - Extension context
     */
    registerStatusBarItems(context) {
        context.subscriptions.push(this.buildButton);
        context.subscriptions.push(this.selectFolderButton);
        context.subscriptions.push(this.selectVenvButton);
    }

    /**
     * Show all status bar items
     */
    showAll() {
        this.buildButton.show();
        this.selectFolderButton.show();
        this.selectVenvButton.show();
    }

    /**
     * Hide all status bar items
     */
    hideAll() {
        this.buildButton.hide();
        this.selectFolderButton.hide();
        this.selectVenvButton.hide();
    }

    /**
     * Update folder selection
     * @param {string} folderPath - Selected folder path
     */
    updateSelectedFolder(folderPath) {
        if (!folderPath || !PathUtils.isSafePath(folderPath)) {
            this.logger.error('Invalid folder path provided', { folderPath });
            return;
        }

        this.selectedFolder = folderPath;
        const folderName = PathUtils.getBasename(folderPath);

        this.selectFolderButton.text = `$(file-directory) ${folderName}`;
        this.selectFolderButton.tooltip = `Selected folder: ${folderName}`;

        this.logger.info('Folder selection updated', { folderPath, folderName });
    }

    /**
     * Update virtual environment selection
     * @param {string} venvPath - Selected virtual environment path
     */
    updateSelectedVenv(venvPath) {
        if (!venvPath || !PathUtils.isSafePath(venvPath)) {
            this.logger.error('Invalid virtual environment path provided', { venvPath });
            return;
        }

        this.selectedVenv = venvPath;
        const venvName = PathUtils.getBasename(venvPath);

        this.selectVenvButton.text = `$(rocket) ${venvName}`;
        this.selectVenvButton.tooltip = `Selected environment: ${venvName}`;

        this.logger.info('Virtual environment selection updated', { venvPath, venvName });
    }

    /**
     * Get currently selected folder
     * @returns {string|null} - Selected folder path
     */
    getSelectedFolder() {
        return this.selectedFolder;
    }

    /**
     * Get currently selected virtual environment
     * @returns {string|null} - Selected virtual environment path
     */
    getSelectedVenv() {
        return this.selectedVenv;
    }

    /**
     * Check if both folder and virtual environment are selected
     * @returns {boolean} - True if both are selected
     */
    isReadyToBuild() {
        return !!(this.selectedFolder && this.selectedVenv);
    }

    /**
     * Reset selections
     */
    reset() {
        this.selectedFolder = null;
        this.selectedVenv = null;

        this.selectFolderButton.text = '$(file-directory) Select Cython Folder';
        this.selectFolderButton.tooltip = 'Select folder containing setup.py';

        this.selectVenvButton.text = '$(rocket) Select Virtual Environment';
        this.selectVenvButton.tooltip = 'Select Python virtual environment';

        this.logger.info('Status bar selections reset');
    }

    /**
     * Dispose of all status bar items
     */
    dispose() {
        if (this.buildButton) {
            this.buildButton.dispose();
        }
        if (this.selectFolderButton) {
            this.selectFolderButton.dispose();
        }
        if (this.selectVenvButton) {
            this.selectVenvButton.dispose();
        }

        this.logger.info('Status bar items disposed');
    }
}

module.exports = StatusBarManager;
