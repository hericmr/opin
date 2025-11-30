import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Carregar variáveis de ambiente do .env.local
config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Plugin para corrigir caminhos duplicados no HTML durante desenvolvimento
const fixManifestPathPlugin = () => {
  return {
    name: 'fix-manifest-path',
    transformIndexHtml(html) {
      // Corrigir caminhos duplicados do manifest e outros recursos
      return html
        .replace(/href="\/opin\/opin\//g, 'href="/opin/')
        .replace(/src="\/opin\/opin\//g, 'src="/opin/');
    },
  };
};


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
    fixManifestPathPlugin(), // Plugin para corrigir caminhos duplicados
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
  base: '/opin/',
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
    port: 3000,
    open: false,
  },
  // Configuração para variáveis de ambiente e compatibilidade com CRA
  define: {
    'process.env.PUBLIC_URL': JSON.stringify('/opin'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    global: 'globalThis',
  },
});

