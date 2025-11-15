// eslint.config.mjs
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

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
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        Image: 'readonly',
        IntersectionObserver: 'readonly',
        fetch: 'readonly',
        inserirVideos: 'readonly',
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
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Não necessário no React 17+
      'react/prop-types': 'warn', // Avisar mas não bloquear
      'no-unused-vars': 'off', // Desabilitar - muitos falsos positivos
      'no-console': 'off', // Desabilitar - console.log é usado para debug
      'no-undef': 'warn', // Avisar mas não bloquear
      'react-hooks/preserve-manual-memoization': 'warn', // Avisar mas não bloquear
      'react-hooks/exhaustive-deps': 'warn', // Avisar mas não bloquear
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
      '**/*.test.js',
      '**/*.spec.js',
      'utils.js', // Arquivo antigo, pode ter problemas
    ],
  },
];

