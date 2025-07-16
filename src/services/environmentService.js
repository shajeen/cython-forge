const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const vscode = require('vscode');
const PathUtils = require('../utils/pathUtils');

/**
 * Service for discovering and managing Python environments
 */
class EnvironmentService {
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Discover all available Python environments
     * @returns {Promise<Array>} - Array of environment objects
     */
    async discoverEnvironments() {
        try {
            this.logger.info('Starting environment discovery');

            const [condaEnvs, venvs] = await Promise.all([
                this.getCondaEnvironments(),
                this.getVirtualEnvironments()
            ]);

            const allEnvs = [...condaEnvs, ...venvs];
            this.logger.info(`Found ${allEnvs.length} environments`, { count: allEnvs.length });

            return allEnvs;
        } catch (error) {
            this.logger.error('Failed to discover environments', error);
            throw new Error(`Environment discovery failed: ${error.message}`);
        }
    }

    /**
     * Get Conda environments safely
     * @returns {Promise<Array>} - Array of conda environment objects
     */
    getCondaEnvironments() {
        return new Promise((resolve) => {
            try {
                const condaProcess = spawn('conda', ['env', 'list', '--json'], {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    timeout: 10000
                });

                let stdout = '';
                let stderr = '';

                condaProcess.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                condaProcess.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                condaProcess.on('close', (code) => {
                    if (code !== 0) {
                        this.logger.warn('Conda command failed', { code, stderr });
                        return resolve([]);
                    }

                    try {
                        const condaData = JSON.parse(stdout);
                        if (!condaData.envs || !Array.isArray(condaData.envs)) {
                            this.logger.warn('Invalid conda environment data');
                            return resolve([]);
                        }

                        const envs = condaData.envs
                            .filter(env => typeof env === 'string' && PathUtils.isSafePath(env))
                            .map(env => ({
                                label: `$(zap) ${path.basename(env)}`,
                                description: 'Conda',
                                path: env,
                                type: 'conda'
                            }))
                            .filter(env => PathUtils.isValidVirtualEnv(env.path));

                        this.logger.info(`Found ${envs.length} conda environments`);
                        resolve(envs);
                    } catch (parseError) {
                        this.logger.error('Failed to parse conda output', parseError);
                        resolve([]);
                    }
                });

                condaProcess.on('error', (error) => {
                    this.logger.warn('Conda not available', error);
                    resolve([]);
                });

            } catch (error) {
                this.logger.error('Error spawning conda process', error);
                resolve([]);
            }
        });
    }

    /**
     * Get virtual environments safely
     * @returns {Promise<Array>} - Array of virtual environment objects
     */
    async getVirtualEnvironments() {
        try {
            const homeDir = os.homedir();
            const workspaceFolders = vscode.workspace.workspaceFolders;
            const searchPaths = [];

            if (workspaceFolders && workspaceFolders.length > 0) {
                searchPaths.push(workspaceFolders[0].uri.fsPath);
            }

            searchPaths.push(
                path.join(homeDir, '.virtualenvs'),
                path.join(homeDir, '.local', 'share', 'virtualenvs'),
                path.join(homeDir, '.pyenv', 'versions')
            );

            const findPromises = searchPaths.map(searchPath =>
                this.findVirtualEnvironmentsInPath(searchPath)
            );

            const results = await Promise.all(findPromises);
            const allVenvs = results.flat();

            this.logger.info(`Found ${allVenvs.length} virtual environments`);
            return allVenvs;
        } catch (error) {
            this.logger.error('Error finding virtual environments', error);
            return [];
        }
    }

    /**
     * Find virtual environments in a specific path
     * @param {string} searchPath - Path to search in
     * @returns {Promise<Array>} - Array of found environments
     */
    findVirtualEnvironmentsInPath(searchPath) {
        return new Promise((resolve) => {
            if (!fs.existsSync(searchPath) || !PathUtils.isSafePath(searchPath)) {
                return resolve([]);
            }

            try {
                const findProcess = spawn('find', [
                    searchPath,
                    '-name', 'pyvenv.cfg',
                    '-type', 'f',
                    '-maxdepth', '3'
                ], {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    timeout: 5000
                });

                let stdout = '';
                let stderr = '';

                findProcess.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                findProcess.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                findProcess.on('close', (code) => {
                    if (code !== 0) {
                        this.logger.warn(`Find command failed for ${searchPath}`, { code, stderr });
                        return resolve([]);
                    }

                    try {
                        const envPaths = stdout.trim()
                            .split('\n')
                            .filter(cfg => cfg && PathUtils.isSafePath(cfg))
                            .map(cfg => path.dirname(cfg))
                            .filter(env => PathUtils.isValidVirtualEnv(env));

                        const envs = envPaths.map(env => ({
                            label: `$(rocket) ${path.basename(env)}`,
                            description: 'Virtual Environment',
                            path: env,
                            type: 'venv'
                        }));

                        resolve(envs);
                    } catch (parseError) {
                        this.logger.error('Error parsing find output', parseError);
                        resolve([]);
                    }
                });

                findProcess.on('error', (error) => {
                    this.logger.warn(`Find command error for ${searchPath}`, error);
                    resolve([]);
                });

            } catch (error) {
                this.logger.error(`Error spawning find process for ${searchPath}`, error);
                resolve([]);
            }
        });
    }

    /**
     * Validate an environment path
     * @param {string} envPath - Path to validate
     * @returns {boolean} - True if valid
     */
    validateEnvironment(envPath) {
        if (!envPath || !PathUtils.isSafePath(envPath)) {
            return false;
        }

        return PathUtils.isValidVirtualEnv(envPath);
    }
}

module.exports = EnvironmentService;