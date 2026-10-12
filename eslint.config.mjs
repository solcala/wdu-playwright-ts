import { defineConfig } from 'eslint/config';
import playwright from 'eslint-plugin-playwright';

export default defineConfig([
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'blob-report/**',
      'docs/**',
    ],
  },
  {
    files: ['tests/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
  },
]);
