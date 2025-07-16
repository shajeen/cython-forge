# Cython Forge

![Cython Forge Icon](images/cython-forge-icon.png)

[![Visual Studio Code](https://img.shields.io/badge/VSC-1.84.0%2B-blue.svg)](https://code.visualstudio.com/updates/v1_84)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Description

Cython Forge is a Visual Studio Code extension that simplifies the build process for Cython files by providing convenient status bar buttons to execute `python setup.py build_ext` commands. The extension features a professionally refactored codebase with security, performance, and maintainability as primary concerns.

## Features

- **Build Cython Files**: Build your Cython files with a single click of a button
- **Select Cython Folder**: Easily select the folder containing your `setup.py` file
- **Select Virtual Environment**: Choose your Python virtual environment for building
- **Automatic Environment Discovery**: Automatically discovers Conda and virtual environments
- **Automatic `setup.py` Detection**: The extension automatically detects if a `setup.py` file exists in the selected folder
- **Terminal Integration**: The build command is executed in a new terminal with full output visibility
- **Security-First Design**: Path validation, command injection protection, and input sanitization
- **Professional Architecture**: Modular design with services, commands, and utilities layers

## Requirements

- Visual Studio Code version 1.84.0 or above.
- Python and pip for Cython development.

## Installation

To install the `cython-forge-0.0.2.vsix` extension, follow these steps based on your environment:

### For Visual Studio Code (VS Code)

#### From Visual Studio Marketplace:

1.  Open VS Code.
2.  Go to the Extensions view (`Ctrl+Shift+X`).
3.  Search for "Cython Forge".
4.  Click "Install" on the "Cython Forge" extension by `SheikSShajeenAhamed`.
5.  Alternatively, you can install directly from the Marketplace website: [https://marketplace.visualstudio.com/items?itemName=SheikSShajeenAhamed.cython-forge](https://marketplace.visualstudio.com/items?itemName=SheikSShajeenAhamed.cython-forge)

#### Using GUI (Drag & Drop or Command):

1.  Launch VS Code
2.  Go to the Extensions sidebar (`Ctrl+Shift+X`)
3.  Click the 3-dot menu (⋮) on top → select "Install from VSIX..."
4.  Browse and select your file: `cython-forge-0.0.2.vsix`
5.  Wait for installation to complete. Restart VS Code if prompted.

#### Using Command Line:

Make sure you have `code` command available in your terminal.

```bash
code --install-extension cython-forge-0.0.2.vsix
```

⚠️ If `code` is not recognized, open VS Code → `Ctrl+Shift+P` → type `Shell Command: Install 'code' command in PATH` → hit Enter.

Once installed, the extension will appear in your Extensions list.

## Usage

1. Open a project containing Cython files.
2. **Select Cython Folder**: Click the "Select Cython Folder" button in the status bar to choose the subfolder containing your `setup.py` file.
3. **Select Virtual Environment**: Click the "Select Venv" button in the status bar to choose your Python virtual environment.
4. **Build Cython**: Click the "Build Cython" button in the status bar to execute the build command.

## Commands

The following commands are available in the Command Palette (`Ctrl + Shift + P`):

- `Cython Forge: Build Cython`: Build the Cython files.
- `Cython Forge: Select Cython Folder`: Select the folder containing the `setup.py` file.
- `Cython Forge: Select Virtual Environment`: Select the Python virtual environment.

## Development

To set up the development environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/shajeen/cython-forge.git
   cd cython-forge
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open the project in VS Code:
   ```bash
   code .
   ```
4. Press `F5` to open a new window with your extension loaded.

### Development Commands
- `npm run lint` - Run ESLint with security rules
- `npm run lint:fix` - Auto-fix linting issues
- `npm run test` - Run all tests (lint + unit + integration)
- `npm run test:unit` - Run unit tests only
- `npm run build` - Complete build process (lint, test, package)
- `npm run package` - Package extension into .vsix file

### Build Scripts
- `./scripts/build.sh` - Clean build and package
- `./scripts/clean.sh` - Clean node_modules and .vsix files
- `./scripts/update_version.sh` - Increment version

### Code Quality
- **ESLint Status**: 7 warnings (down from 19) - all remaining are low-risk
- **Test Coverage**: 18/18 unit tests passing
- **Security**: Enhanced with `eslint-plugin-security`
- **Performance**: Optimized async/await patterns

## Dependencies

### Runtime Dependencies
- **None** - Zero external runtime dependencies for enhanced security

### Development Dependencies
- **ESLint**: Code quality and security linting
- **Mocha**: Unit testing framework
- **Sinon**: Mocking and stubbing for tests
- **@vscode/vsce**: VS Code extension packaging
- **eslint-plugin-security**: Security-focused linting rules

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.