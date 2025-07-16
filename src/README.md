# Cython Forge - Source Code Architecture

## Overview

This directory contains the refactored source code for the Cython Forge VS Code extension. The code has been restructured to follow professional software development practices including proper separation of concerns, comprehensive error handling, and security best practices.

## Architecture

### Directory Structure

```
src/
├── commands/           # Command handlers
│   ├── buildCommand.js
│   ├── selectFolderCommand.js
│   └── selectVenvCommand.js
├── services/           # Business logic services
│   ├── buildService.js
│   └── environmentService.js
├── ui/                 # User interface components
│   └── statusBarManager.js
├── utils/              # Utility functions
│   ├── logger.js
│   └── pathUtils.js
└── extension.js        # Main extension entry point
```

### Key Components

#### Services Layer
- **EnvironmentService**: Discovers and validates Python environments (conda, venv)
- **BuildService**: Handles secure execution of Cython build commands

#### UI Layer
- **StatusBarManager**: Manages VS Code status bar items and state

#### Utils Layer
- **Logger**: Centralized logging with output channel integration
- **PathUtils**: Secure path validation and manipulation utilities

#### Commands Layer
- **BuildCommand**: Executes Cython build process
- **SelectFolderCommand**: Handles folder selection with validation
- **SelectVenvCommand**: Manages virtual environment selection

## Security Features

### Path Validation
- Directory traversal protection
- Safe path escaping for shell commands
- Cross-platform path handling

### Command Execution
- Secure process spawning with timeouts
- Input validation and sanitization
- Error handling with proper cleanup

### Environment Discovery
- Safe external command execution
- Timeout protection for long-running operations
- Graceful fallback mechanisms

## Error Handling

### Comprehensive Logging
- Structured logging with timestamps
- Separate log levels (info, warn, error)
- VS Code output channel integration

### User-Friendly Messages
- Clear error messages for end users
- Detailed logging for debugging
- Graceful degradation on failures

### Resource Management
- Proper cleanup of terminals and processes
- Memory leak prevention
- Disposable resource pattern

## Testing Strategy

### Unit Tests
- Comprehensive test coverage for all services
- Mocked dependencies for isolation
- Security-focused test scenarios

### Integration Tests
- VS Code extension API integration
- Command registration verification
- End-to-end workflow testing

## Development Guidelines

### Code Style
- Consistent formatting with ESLint
- Security rules enforcement
- Professional naming conventions

### Documentation
- JSDoc comments for all public methods
- Clear parameter and return type descriptions
- Usage examples where appropriate

### Performance
- Async/await patterns for non-blocking operations
- Efficient environment discovery
- Resource cleanup best practices

## Configuration

The extension supports configuration through VS Code settings:

- `cython-forge.defaultBuildArgs`: Default build arguments
- `cython-forge.showBuildOutput`: Control terminal output visibility
- `cython-forge.autoDiscoverEnvironments`: Enable/disable auto-discovery

## Extension Points

The architecture supports future enhancements:

- Additional Python environment types
- Custom build command configurations
- Integration with other development tools
- Plugin system for custom handlers

## Migration Notes

This refactored version maintains backward compatibility while adding:

- Enhanced security measures
- Better error handling
- Improved code organization
- Comprehensive testing
- Professional documentation

For development setup and contribution guidelines, see the main README.md in the project root.