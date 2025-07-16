#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Clean slate
echo "--- Cleaning ---"
rm -rf node_modules *.vsix

# Install dependencies
echo "--- Installing dependencies ---"
npm install

# Package the extension
echo "--- Packaging ---"
npx vsce package

echo "--- Done ---"
