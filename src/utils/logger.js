const vscode = require('vscode');

/**
 * Logger utility for the Cython Forge extension
 */
class Logger {
    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Cython Forge');
    }

    /**
     * Log an info message
     * @param {string} message - The message to log
     * @param {any} data - Additional data to log
     */
    info(message, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] INFO: ${message}`;

        this.outputChannel.appendLine(logMessage);
        if (data) {
            this.outputChannel.appendLine(`Data: ${JSON.stringify(data, null, 2)}`);
        }

        // eslint-disable-next-line no-console
        console.log(logMessage, data);
    }

    /**
     * Log an error message
     * @param {string} message - The error message
     * @param {Error} error - The error object
     */
    error(message, error = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ERROR: ${message}`;

        this.outputChannel.appendLine(logMessage);
        if (error) {
            this.outputChannel.appendLine(`Error: ${error.message}`);
            this.outputChannel.appendLine(`Stack: ${error.stack}`);
        }

        // eslint-disable-next-line no-console
        console.error(logMessage, error);
    }

    /**
     * Log a warning message
     * @param {string} message - The warning message
     * @param {any} data - Additional data to log
     */
    warn(message, data = null) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] WARN: ${message}`;

        this.outputChannel.appendLine(logMessage);
        if (data) {
            this.outputChannel.appendLine(`Data: ${JSON.stringify(data, null, 2)}`);
        }

        // eslint-disable-next-line no-console
        console.warn(logMessage, data);
    }

    /**
     * Show the output channel
     */
    show() {
        this.outputChannel.show();
    }

    /**
     * Dispose of the logger
     */
    dispose() {
        this.outputChannel.dispose();
    }
}

module.exports = Logger;