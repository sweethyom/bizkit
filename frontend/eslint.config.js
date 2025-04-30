import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.config(
    { ignores: ['dist', 'eslint.config.js'] },
    {
      settings: {
        'import/resolver': {
          typescript: {
            project: './tsconfig.app.json',
          },
        },
      },
    },
    {
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        importPlugin.flatConfigs.recommended,
        importPlugin.flatConfigs.typescript,
        prettier,
      ],
      files: ['src/**/*.{js,jsx,ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        parser: tseslint.parser,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          project: './tsconfig.app.json',
        },
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        '@typescript-eslint': tseslint.plugin,
        prettier: prettierPlugin,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        '@typescript-eslint/no-explicit-any': 'warn',
        'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
      },
    },
  ),
];
