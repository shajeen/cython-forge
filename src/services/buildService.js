const vscode = require('vscode');
const PathUtils = require('../utils/pathUtils');

/**
 * Service for handling Cython build operations
 */
class BuildService {
    constructor(logger) {
        this.logger = logger;
        this.activeTerminal = null;
    }

    /**
     * Execute Cython build command safely
     * @param {string} folderPath - Path to the folder containing setup.py
     * @param {string} venvPath - Path to the virtual environment
     * @returns {void}
     */
    executeBuild(folderPath, venvPath) {
        try {
            this.logger.info('Starting Cython build', { folderPath, venvPath });

            // Validate inputs
            if (!this.validateBuildInputs(folderPath, venvPath)) {
                throw new Error('Invalid build inputs');
            }

            // Get Python interpreter
            const pythonInterpreter = PathUtils.getPythonInterpreter(venvPath);
            if (!pythonInterpreter) {
                throw new Error('Python interpreter not found in virtual environment');
            }

            // Create and show terminal
            this.createBuildTerminal();

            // Execute build command
            this.executeBuildCommand(folderPath, pythonInterpreter);

            this.logger.info('Build command executed successfully');
        } catch (error) {
            this.logger.error('Build execution failed', error);
            vscode.window.showErrorMessage(`Build failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Validate build inputs
     * @param {string} folderPath - Folder path to validate
     * @param {string} venvPath - Virtual environment path to validate
     * @returns {boolean} - True if inputs are valid
     */
    validateBuildInputs(folderPath, venvPath) {
        if (!folderPath || !PathUtils.isSafePath(folderPath)) {
            this.logger.error('Invalid folder path', { folderPath });
            vscode.window.showErrorMessage('Invalid folder path selected');
            return false;
        }

        if (!venvPath || !PathUtils.isSafePath(venvPath)) {
            this.logger.error('Invalid virtual environment path', { venvPath });
            vscode.window.showErrorMessage('Invalid virtual environment path');
            return false;
        }

        if (!PathUtils.hasSetupPy(folderPath)) {
            this.logger.error('setup.py not found in folder', { folderPath });
            vscode.window.showErrorMessage('Selected folder does not contain setup.py file');
            return false;
        }

        if (!PathUtils.isValidVirtualEnv(venvPath)) {
            this.logger.error('Invalid virtual environment', { venvPath });
            vscode.window.showErrorMessage('Selected path is not a valid virtual environment');
            return false;
        }

        return true;
    }

    /**
     * Create and configure build terminal
     * @returns {Promise<void>}
     */
    createBuildTerminal() {
        try {
            // Close existing terminal if it exists
            if (this.activeTerminal) {
                this.activeTerminal.dispose();
                this.activeTerminal = null;
            }

            // Create new terminal
            this.activeTerminal = vscode.window.createTerminal({
                name: 'Cython Build',
                hideFromUser: false
            });

            this.activeTerminal.show();
            this.logger.info('Build terminal created');
        } catch (error) {
            this.logger.error('Failed to create build terminal', error);
            throw new Error('Failed to create build terminal');
        }
    }

    /**
     * Execute the build command in the terminal
     * @param {string} folderPath - Working directory
     * @param {string} pythonInterpreter - Python interpreter path
     * @returns {Promise<void>}
     */
    executeBuildCommand(folderPath, pythonInterpreter) {
        try {
            // Build command safely
            const workingDir = PathUtils.escapePath(folderPath);
            const pythonCmd = PathUtils.escapePath(pythonInterpreter);

            // Use a more secure command construction
            const commands = [
                `cd ${workingDir}`,
                `${pythonCmd} setup.py ${vscode.workspace.getConfiguration('cython-forge').get('defaultBuildArgs', 'build_ext --inplace')}`
            ];

            // Send commands to terminal
            this.activeTerminal.sendText(commands.join(' && '));

            this.logger.info('Build commands sent to terminal');
        } catch (error) {
            this.logger.error('Failed to execute build command', error);
            throw new Error('Failed to execute build command');
        }
    }

    /**
     * Dispose of the build service
     */
    dispose() {
        if (this.activeTerminal) {
            this.activeTerminal.dispose();
            this.activeTerminal = null;
        }
    }
}

module.exports = BuildService;