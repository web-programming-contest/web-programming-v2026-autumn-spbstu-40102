import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath, URL} from 'node:url';

const API_URL = 'http://127.0.0.1:8080';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {'@': fileURLToPath(new URL('./src', import.meta.url))},
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': API_URL,
      '/images': API_URL,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use '@/styles/abstracts/variables' as *;\n`,
      },
    },
  },
});
