import prettier from 'eslint-plugin-prettier'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import pluginQuery from '@tanstack/eslint-plugin-query'

import { FlatCompat } from '@eslint/eslintrc'
import { globalIgnores } from 'eslint/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const configs = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...pluginQuery.configs['flat/recommended'],
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    plugins: {
      prettier,
    },

    rules: {
      'prettier/prettier': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  globalIgnores(['.lintstagedrc.js']),
]

export default configs
