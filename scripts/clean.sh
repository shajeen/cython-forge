#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Clean slate
echo "--- Cleaning ---"
rm -rf node_modules *.vsix

echo "--- Done ---"
