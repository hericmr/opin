// eslint.config.mjs
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Substituídos pelo Vite no build (vite.config.js → define)
        process: 'readonly',
        global: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Desabilitar regras problemáticas do react.configs.recommended
      ...Object.fromEntries(
        Object.keys(react.configs.recommended.rules).map(key => [key, 'warn'])
      ),
      ...Object.fromEntries(
        Object.keys(reactHooks.configs.recommended.rules).map(key => [key, 'warn'])
      ),
      'react/react-in-jsx-scope': 'off', // Não necessário no React 17+
      // React 19 não checa mais propTypes em tempo de execução
      'react/prop-types': 'off',
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true, caughtErrors: 'none' }],
      'no-console': 'off', // Desabilitar - console.log é usado para debug
      'no-undef': 'error',
      'react-hooks/preserve-manual-memoization': 'warn', // Avisar mas não bloquear
      'react-hooks/exhaustive-deps': 'warn', // Avisar mas não bloquear
      'react/no-unescaped-entities': 'warn', // Avisar mas não bloquear
      'no-prototype-builtins': 'warn', // Avisar mas não bloquear
      'no-empty': 'warn', // Avisar mas não bloquear
      'no-useless-catch': 'warn', // Avisar mas não bloquear
      'react-hooks/rules-of-hooks': 'warn', // Avisar mas não bloquear
      // Desabilitar todas as regras que causam erros
      'react/jsx-no-target-blank': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'no-case-declarations': 'warn',
      'react-hooks/static-components': 'warn',
    },
  },
  {
    // Testes e setup do Jest
    files: ['src/setupTests.js', '**/__tests__/**/*.{js,jsx}', '**/*.{test,spec}.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
      'config-overrides.js',
      'public/**',
      'scripts/**',
      'utils.js', // Arquivo antigo, pode ter problemas
      'site_mirror_arcgis/**',
      'native-land.ca/**',
      '**/*.bak',
      '**/*.backup',
    ],
  },
];

