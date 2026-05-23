import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Carregar variáveis de ambiente — .env.supabase tem prioridade sobre .env.local
config({ path: '.env.local' });
config({ path: '.env.supabase', override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  // Expor variáveis de ambiente com prefixo REACT_APP_ e VITE_
  envPrefix: ['REACT_APP_', 'VITE_'],
  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: '**/*.{jsx,js}',
    }),
    tailwindcss(), // Tailwind CSS 4 plugin
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  base: '/',
  build: {
    outDir: 'build',
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      // Espelha o proxy reverso do nginx em produção:
      // /rest/v1/* → PostgREST em localhost:3000
      '/rest/v1': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/rest\/v1/, ''),
        changeOrigin: true,
      },
      // /storage/v1/* → Storage API em localhost:5000
      '/storage/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  // Configuração para variáveis de ambiente e compatibilidade com CRA
  define: {
    'process.env.PUBLIC_URL': JSON.stringify(''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis',
  },
});

