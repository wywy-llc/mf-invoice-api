import { fileURLToPath } from 'node:url';
import path from 'node:path';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import nPlugin from 'eslint-plugin-n';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier/flat';
import globals from 'globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'dist/**',
      'testing/**',
      'template/**',
    ],
  },

  js.configs.recommended,
  nPlugin.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  prettierConfig,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
      'block-scoped-var': 'error',
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'eol-last': 'error',
      'prefer-arrow-callback': 'error',
      'no-trailing-spaces': 'error',
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'no-restricted-properties': [
        'error',
        { object: 'describe', property: 'only' },
        { object: 'it', property: 'only' },
      ],
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-warning-comments': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-missing-require': 'off',
      'n/hashbang': 'off',
      'no-dupe-class-members': 'off',
      'require-atomic-updates': 'off',
    },
  },

  {
    files: ['test/**/*.ts'],
    rules: {
      // テストコードは npm パッケージとして配布されないため devDependencies の import を許可する
      'n/no-unpublished-import': 'off',
    },
  },
]);
