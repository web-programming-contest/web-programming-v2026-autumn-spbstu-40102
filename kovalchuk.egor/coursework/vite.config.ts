import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

const proxy = {'/api': 'http://127.0.0.1:8080'};
export default defineConfig({
  root: 'client',
  plugins: [vue()],
  server: {port: 3000, strictPort: true, proxy},
  preview: {port: 3000, strictPort: true, proxy},
  build: {outDir: '../dist', emptyOutDir: true},
});
