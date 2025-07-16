const vscode = require('vscode');

// Import services
const Logger = require('./utils/logger');
const EnvironmentService = require('./services/environmentService');
const BuildService = require('./services/buildService');
const StatusBarManager = require('./ui/statusBarManager');

// Import commands
const BuildCommand = require('./commands/buildCommand');
const SelectFolderCommand = require('./commands/selectFolderCommand');
const SelectVenvCommand = require('./commands/selectVenvCommand');

// Global services
let logger;
let environmentService;
let buildService;
let statusBarManager;

/**
 * Extension activation function
 * @param {vscode.ExtensionContext} context - Extension context
 */
function activate(context) {
    try {
        // Initialize logger first
        logger = new Logger();
        logger.info('Cython Forge extension activating...');

        // Initialize services
        environmentService = new EnvironmentService(logger);
        buildService = new BuildService(logger);
        statusBarManager = new StatusBarManager(logger);

        // Initialize status bar
        statusBarManager.initialize(context);
        statusBarManager.showAll();

        // Initialize commands
        const buildCommand = new BuildCommand(logger, statusBarManager, buildService);
        const selectFolderCommand = new SelectFolderCommand(logger, statusBarManager);
        const selectVenvCommand = new SelectVenvCommand(logger, statusBarManager, environmentService);

        // Register commands
        registerCommands(context, buildCommand, selectFolderCommand, selectVenvCommand);

        // Register cleanup
        context.subscriptions.push({
            dispose: () => {
                logger.info('Cython Forge extension deactivating...');
                cleanup();
            }
        });

        logger.info('Cython Forge extension activated successfully');
    } catch (error) {
        if (logger) {
            logger.error('Extension activation failed', error);
        } else {
            // Fallback logging when logger is not available
            // eslint-disable-next-line no-console
            console.error('Extension activation failed', error);
        }

        vscode.window.showErrorMessage(`Cython Forge activation failed: ${error.message}`);
        throw error;
    }
}

/**
 * Register all commands
 * @param {vscode.ExtensionContext} context - Extension context
 * @param {BuildCommand} buildCommand - Build command handler
 * @param {SelectFolderCommand} selectFolderCommand - Select folder command handler
 * @param {SelectVenvCommand} selectVenvCommand - Select venv command handler
 */
function registerCommands(context, buildCommand, selectFolderCommand, selectVenvCommand) {
    // Register build command
    const buildDisposable = vscode.commands.registerCommand(
        'cython-forge.buildCython',
        () => buildCommand.execute()
    );

    // Register select folder command
    const selectFolderDisposable = vscode.commands.registerCommand(
        'cython-forge.selectFolder',
        () => selectFolderCommand.execute()
    );

    // Register select virtual environment command
    const selectVenvDisposable = vscode.commands.registerCommand(
        'cython-forge.selectVenv',
        () => selectVenvCommand.execute()
    );

    // Add to subscriptions
    context.subscriptions.push(
        buildDisposable,
        selectFolderDisposable,
        selectVenvDisposable
    );

    logger.info('All commands registered successfully');
}

/**
 * Extension deactivation function
 */
function deactivate() {
    cleanup();
}

/**
 * Cleanup resources
 */
function cleanup() {
    try {
        if (buildService) {
            buildService.dispose();
        }

        if (statusBarManager) {
            statusBarManager.dispose();
        }

        if (logger) {
            logger.info('Cython Forge extension cleanup completed');
            logger.dispose();
        }
    } catch (error) {
        // Fallback logging when logger is not available
        // eslint-disable-next-line no-console
        console.error('Extension cleanup failed', error);
    }
}

module.exports = {
    activate,
    deactivate
};