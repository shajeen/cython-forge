# Scripts

This directory contains utility scripts for managing the Cython Forge extension.

## `build.sh`

This script automates the process of cleaning, installing dependencies, and packaging the VS Code extension.

**Usage:**
```bash
./scripts/build.sh
```

## `clean.sh`

This script removes generated files and directories, such as `node_modules` and `.vsix` packages, to provide a clean working environment.

**Usage:**
```bash
./scripts/clean.sh
```

## `update_version.sh`

This script automatically updates the patch version of the extension in `package.json`. It reads the current version, increments the patch number, and writes the new version back to the file.

**Usage:**
```bash
./scripts/update_version.sh
```
