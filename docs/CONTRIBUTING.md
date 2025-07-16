# Contributing to Cython Forge

We welcome contributions to the Cython Forge extension! To ensure a smooth collaboration, please follow these guidelines.

## How to Contribute

1.  **Fork the repository** on GitHub.
2.  **Clone your forked repository** to your local machine.
    ```bash
    git clone https://github.com/your-username/vscode-cython-builder.git
    cd vscode-cython-builder
    ```
3.  **Create a new branch** for your feature or bug fix.
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b bugfix/your-bug-fix
    ```
4.  **Install dependencies**:
    ```bash
    npm install
    ```
5.  **Make your changes**. Ensure your code adheres to the existing style and conventions.
6.  **Run tests** to ensure your changes haven't introduced any regressions.
    ```bash
    npm test
    ```
7.  **Run linting** to check for code style issues.
    ```bash
    npm run lint
    ```
8.  **Commit your changes** with a clear and concise commit message. Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification if possible (e.g., `feat: add new feature`, `fix: resolve bug`).
9.  **Push your branch** to your forked repository.
    ```bash
    git push origin feature/your-feature-name
    ```
10. **Open a Pull Request** to the `main` branch of the original repository. Provide a detailed description of your changes.

## Code Style

-   We use ESLint for code linting. Please ensure your code passes the linting checks (`npm run lint`).
-   Follow the existing coding style and conventions found in the codebase.

## Reporting Bugs

If you find a bug, please open an issue on the [GitHub issue tracker](https://github.com/shajeen/vscode-cython-builder/issues) and provide:

-   A clear and concise description of the bug.
-   Steps to reproduce the behavior.
-   Expected behavior.
-   Screenshots or error messages, if applicable.
-   Your operating system and VS Code version.

## Feature Requests

We welcome new ideas! Please open an issue on the [GitHub issue tracker](https://github.com/shajeen/vscode-cython-builder/issues) and describe:

-   The problem you're trying to solve.
-   How your proposed feature would help.
-   Any alternative solutions you've considered.

## License

By contributing to Cython Forge, you agree that your contributions will be licensed under its MIT License.
