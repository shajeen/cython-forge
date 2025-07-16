const path = require('path');
const fs = require('fs');

/**
 * Utility functions for path handling and validation
 */
class PathUtils {
    /**
     * Get the Python interpreter path for a given virtual environment
     * @param {string} venvPath - Path to the virtual environment
     * @returns {string|null} - Path to Python interpreter or null if not found
     */
    static getPythonInterpreter(venvPath) {
        if (!venvPath || !fs.existsSync(venvPath)) {
            return null;
        }

        const candidates = process.platform === 'win32'
            ? [
                path.join(venvPath, 'Scripts', 'python.exe'),
                path.join(venvPath, 'Scripts', 'python3.exe')
            ]
            : [
                path.join(venvPath, 'bin', 'python3'),
                path.join(venvPath, 'bin', 'python')
            ];

        for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        }

        return null;
    }

    /**
     * Validate if a folder contains setup.py
     * @param {string} folderPath - Path to the folder
     * @returns {boolean} - True if setup.py exists
     */
    static hasSetupPy(folderPath) {
        if (!folderPath || !fs.existsSync(folderPath)) {
            return false;
        }

        const setupPyPath = path.join(folderPath, 'setup.py');
        return fs.existsSync(setupPyPath);
    }

    /**
     * Validate if a path is a valid virtual environment
     * @param {string} venvPath - Path to check
     * @returns {boolean} - True if valid virtual environment
     */
    static isValidVirtualEnv(venvPath) {
        if (!venvPath || !fs.existsSync(venvPath)) {
            return false;
        }

        // Check for Python interpreter
        const pythonPath = this.getPythonInterpreter(venvPath);
        if (!pythonPath) {
            return false;
        }

        // Check for virtual environment markers
        const markers = process.platform === 'win32'
            ? [path.join(venvPath, 'pyvenv.cfg'), path.join(venvPath, 'Scripts')]
            : [path.join(venvPath, 'pyvenv.cfg'), path.join(venvPath, 'bin')];

        return markers.some(marker => fs.existsSync(marker));
    }

    /**
     * Safely escape a path for shell execution
     * @param {string} filePath - Path to escape
     * @returns {string} - Escaped path
     */
    static escapePath(filePath) {
        if (!filePath) {
            return '';
        }

        // For Windows, wrap in quotes and escape existing quotes
        if (process.platform === 'win32') {
            return `"${filePath.replace(/"/g, '""')}"`;
        }

        // For Unix-like systems, escape special characters
        return filePath.replace(/(["\s'$`\\])/g, '\\$1');
    }

    /**
     * Get the basename of a path safely
     * @param {string} filePath - Path to get basename from
     * @returns {string} - Basename or empty string
     */
    static getBasename(filePath) {
        if (!filePath) {
            return '';
        }
        return path.basename(filePath);
    }

    /**
     * Validate that a path is safe (no directory traversal)
     * @param {string} filePath - Path to validate
     * @returns {boolean} - True if path is safe
     */
    static isSafePath(filePath) {
        if (!filePath) {
            return false;
        }

        // Check for directory traversal patterns
        const dangerous = ['../', '..\\'];
        return !dangerous.some(pattern => filePath.includes(pattern));
    }
}

module.exports = PathUtils;