import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Carregar variáveis de ambiente do .env.local
config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: '**/*.{jsx,js}',
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  base: '/opin/',
  build: {
    outDir: 'build',
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  // Configuração para variáveis de ambiente e compatibilidade com CRA
  define: {
    'process.env.PUBLIC_URL': JSON.stringify('/opin'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(process.env.REACT_APP_SUPABASE_URL || ''),
    'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(process.env.REACT_APP_SUPABASE_ANON_KEY || ''),
    'process.env.REACT_APP_ADMIN_PASSWORD': JSON.stringify(process.env.REACT_APP_ADMIN_PASSWORD || ''),
    'process.env.REACT_APP_JWT_SECRET': JSON.stringify(process.env.REACT_APP_JWT_SECRET || ''),
    global: 'globalThis',
  },
});

