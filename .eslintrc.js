module.exports = {
    env: {
        browser: false,
        commonjs: true,
        es2020: true,
        node: true,
        mocha: true
    },
    extends: [
        'eslint:recommended',
        'plugin:security/recommended'
    ],
    plugins: [
        'security'
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        // Error prevention
        'no-const-assign': 'error',
        'no-this-before-super': 'error',
        'no-undef': 'error',
        'no-unreachable': 'error',
        'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
        'constructor-super': 'error',
        'valid-typeof': 'error',

        // Security rules
        'security/detect-child-process': 'warn',
        'security/detect-eval-with-expression': 'error',
        'security/detect-non-literal-fs-filename': 'warn',
        'security/detect-non-literal-regexp': 'warn',
        'security/detect-object-injection': 'warn',
        'security/detect-possible-timing-attacks': 'warn',
        'security/detect-pseudoRandomBytes': 'error',
        'security/detect-unsafe-regex': 'error',

        // Code quality
        'prefer-const': 'error',
        'no-var': 'error',
        'no-console': 'warn',
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        'brace-style': ['error', '1tbs'],
        'comma-dangle': ['error', 'never'],
        'indent': ['error', 4],
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'semi': ['error', 'always'],
        'no-trailing-spaces': 'error',
        'no-multiple-empty-lines': ['error', { 'max': 2 }],

        // Async/await patterns
        'require-await': 'warn',
        'no-async-promise-executor': 'error',
        'no-await-in-loop': 'warn',
        'no-return-await': 'error',

        // Error handling
        'no-throw-literal': 'error',
        'prefer-promise-reject-errors': 'error',

        // Best practices
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-proto': 'error',
        'no-script-url': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unused-expressions': 'error',
        'no-useless-call': 'error',
        'no-useless-concat': 'error',
        'no-useless-return': 'error',
        'no-void': 'error',
        'no-with': 'error',
        'radix': 'error',
        'wrap-iife': ['error', 'any'],
        'yoda': 'error'
    },
    overrides: [
        {
            files: ['test/**/*.js'],
            rules: {
                'no-console': 'off',
                'security/detect-non-literal-fs-filename': 'off'
            }
        }
    ]
};