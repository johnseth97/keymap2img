// eslint.config.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import globals from 'globals';
import jsEslint from '@eslint/js';
import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintComments from 'eslint-plugin-eslint-comments';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('eslint').FlatConfig[]} */
export default [
    // Base configuration for JavaScript
    {
        files: ['*.js', '*.jsx'], // Apply to JavaScript files
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            'eslint-comments': eslintComments,
            js: jsEslint,
        },
        rules: {
            // ESLint Comments Rules
            'eslint-comments/no-unused-disable': 'error',
            'eslint-comments/no-restricted-disable': 'off',
            'eslint-comments/no-use': [
                'warn',
                {
                    allow: [
                        'eslint-disable',
                        'eslint-enable',
                        'eslint-disable-line',
                        'eslint-disable-next-line',
                    ],
                },
            ],
            // JavaScript ESLint Recommended Rules
            ...jsEslint.configs.recommended.rules,
            // ESLint Comments Recommended Rules
            ...eslintComments.configs.recommended.rules,
        },
    },
    // Configuration for TypeScript
    {
        files: ['**/*.ts', '**/*.tsx'], // Apply to TypeScript files
        languageOptions: {
            parser: tsParser, // Correctly reference the TypeScript parser object
            parserOptions: {
                project: './tsconfig.json', // Path to your tsconfig.json
                tsconfigRootDir: __dirname, // Ensure the parser can find tsconfig.json
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tsEslint,
            'eslint-comments': eslintComments,
        },
        rules: {
            // TypeScript ESLint Rules
            // Allow Unknown Types

            // ESLint Comments Rules
            'eslint-comments/no-unused-disable': 'error',
            'eslint-comments/no-restricted-disable': 'off',
            'eslint-comments/no-use': [
                'warn',
                {
                    allow: [
                        'eslint-disable',
                        'eslint-enable',
                        'eslint-disable-line',
                        'eslint-disable-next-line',
                    ],
                },
            ],
            // TypeScript ESLint Recommended Rules
            ...tsEslint.configs.recommended.rules,
            // ESLint Comments Recommended Rules
            ...eslintComments.configs.recommended.rules,
        },
    },
];
