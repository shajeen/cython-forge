#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Get current version
current_version=$(jq -r '.version' package.json)

# Split version into parts
IFS='.' read -r major minor patch <<< "$current_version"

# Increment patch version
new_patch=$((patch + 1))
new_version="$major.$minor.$new_patch"

# Update package.json
jq ".version = \"$new_version\"" package.json > package.json.tmp && mv package.json.tmp package.json

echo "Version updated from $current_version to $new_version"

