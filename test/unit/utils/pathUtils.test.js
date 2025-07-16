const assert = require('assert');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');
const PathUtils = require('../../../src/utils/pathUtils');

describe('PathUtils', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getPythonInterpreter', () => {
        it('should return null for invalid path', () => {
            const result = PathUtils.getPythonInterpreter(null);
            assert.strictEqual(result, null);
        });

        it('should return null if venv path does not exist', () => {
            sandbox.stub(fs, 'existsSync').returns(false);
            const result = PathUtils.getPythonInterpreter('/fake/path');
            assert.strictEqual(result, null);
        });

        it('should return Windows python path when found', () => {
            const originalPlatform = process.platform;
            Object.defineProperty(process, 'platform', { value: 'win32' });

            const venvPath = 'C:\\venv';
            const expectedPath = path.join(venvPath, 'Scripts', 'python.exe');

            sandbox.stub(fs, 'existsSync')
                .withArgs(venvPath).returns(true)
                .withArgs(expectedPath).returns(true);

            const result = PathUtils.getPythonInterpreter(venvPath);
            assert.strictEqual(result, expectedPath);

            Object.defineProperty(process, 'platform', { value: originalPlatform });
        });

        it('should return Unix python3 path when found', () => {
            const originalPlatform = process.platform;
            Object.defineProperty(process, 'platform', { value: 'linux' });

            const venvPath = '/path/to/venv';
            const expectedPath = path.join(venvPath, 'bin', 'python3');

            sandbox.stub(fs, 'existsSync')
                .withArgs(venvPath).returns(true)
                .withArgs(expectedPath).returns(true);

            const result = PathUtils.getPythonInterpreter(venvPath);
            assert.strictEqual(result, expectedPath);

            Object.defineProperty(process, 'platform', { value: originalPlatform });
        });
    });

    describe('hasSetupPy', () => {
        it('should return false for invalid path', () => {
            const result = PathUtils.hasSetupPy(null);
            assert.strictEqual(result, false);
        });

        it('should return false if folder does not exist', () => {
            sandbox.stub(fs, 'existsSync').returns(false);
            const result = PathUtils.hasSetupPy('/fake/path');
            assert.strictEqual(result, false);
        });

        it('should return true if setup.py exists', () => {
            const folderPath = '/project/path';
            const setupPyPath = path.join(folderPath, 'setup.py');

            sandbox.stub(fs, 'existsSync')
                .withArgs(folderPath).returns(true)
                .withArgs(setupPyPath).returns(true);

            const result = PathUtils.hasSetupPy(folderPath);
            assert.strictEqual(result, true);
        });
    });

    describe('isSafePath', () => {
        it('should return false for null path', () => {
            const result = PathUtils.isSafePath(null);
            assert.strictEqual(result, false);
        });

        it('should return false for paths with directory traversal', () => {
            const dangerousPaths = [
                '../../../etc/passwd',
                '..\\..\\windows\\system32',
                '/path/../../../etc/passwd',
                'C:\\path\\..\\..\\Windows\\System32'
            ];

            dangerousPaths.forEach(path => {
                const result = PathUtils.isSafePath(path);
                assert.strictEqual(result, false, `Path should be unsafe: ${path}`);
            });
        });

        it('should return true for safe paths', () => {
            const safePaths = [
                '/home/user/project',
                'C:\\Users\\user\\project',
                './project',
                'project/subfolder'
            ];

            safePaths.forEach(path => {
                const result = PathUtils.isSafePath(path);
                assert.strictEqual(result, true, `Path should be safe: ${path}`);
            });
        });
    });

    describe('escapePath', () => {
        it('should return empty string for null path', () => {
            const result = PathUtils.escapePath(null);
            assert.strictEqual(result, '');
        });

        it('should escape Windows paths correctly', () => {
            const originalPlatform = process.platform;
            Object.defineProperty(process, 'platform', { value: 'win32' });

            const result = PathUtils.escapePath('C:\\Program Files\\test');
            assert.strictEqual(result, '"C:\\Program Files\\test"');

            Object.defineProperty(process, 'platform', { value: originalPlatform });
        });

        it('should escape Unix paths correctly', () => {
            const originalPlatform = process.platform;
            Object.defineProperty(process, 'platform', { value: 'linux' });

            const result = PathUtils.escapePath('/path with spaces/test');
            assert.strictEqual(result, '/path\\ with\\ spaces/test');

            Object.defineProperty(process, 'platform', { value: originalPlatform });
        });
    });

    describe('getBasename', () => {
        it('should return empty string for null path', () => {
            const result = PathUtils.getBasename(null);
            assert.strictEqual(result, '');
        });

        it('should return correct basename', () => {
            const result = PathUtils.getBasename('/path/to/folder');
            assert.strictEqual(result, 'folder');
        });
    });

    describe('isValidVirtualEnv', () => {
        it('should return false for invalid path', () => {
            const result = PathUtils.isValidVirtualEnv(null);
            assert.strictEqual(result, false);
        });

        it('should return false if path does not exist', () => {
            sandbox.stub(fs, 'existsSync').returns(false);
            const result = PathUtils.isValidVirtualEnv('/fake/path');
            assert.strictEqual(result, false);
        });

        it('should return true for valid virtual environment', () => {
            const venvPath = '/path/to/venv';
            const pythonPath = path.join(venvPath, 'bin', 'python3');
            const pyvenvCfg = path.join(venvPath, 'pyvenv.cfg');

            sandbox.stub(fs, 'existsSync')
                .withArgs(venvPath).returns(true)
                .withArgs(pythonPath).returns(true)
                .withArgs(pyvenvCfg).returns(true);

            const result = PathUtils.isValidVirtualEnv(venvPath);
            assert.strictEqual(result, true);
        });
    });
});
