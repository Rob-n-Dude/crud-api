import eslintPlugin from '@typescript-eslint/eslint-plugin'
import eslintParser from '@typescript-eslint/parser'

import {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPlugin,
    },
    rules: {
      ...eslintPlugin.configs.recommended.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    ignores: ['webpack.config.ts'],
  },
]
