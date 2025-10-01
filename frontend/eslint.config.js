import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import {defineConfig, globalIgnores} from 'eslint/config'
import * as eslint from "typescript-eslint";

export default defineConfig(
    [
        eslint.configs.recommended,
        tseslint.configs.strictTypeChecked,
        globalIgnores(['dist']),
        {
            files: ['**/*.{ts,tsx}'],
            extends: [
                js.configs.recommended,
                tseslint.configs.recommended,
                // reactHooks.configs['recommended-latest'],
                reactRefresh.configs.vite,
            ],
            languageOptions: {
                ecmaVersion: 2020,
                globals: globals.browser,
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir: import.meta.dirname,
                },
            },
            plugins: {
                "react-hooks": reactHooks,
            },
            rules: {
                "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
                "@typescript-eslint/no-non-null-assertion": "warn",
                ... reactHooks.configs.recommended.rules,
            },
        },
    ])
