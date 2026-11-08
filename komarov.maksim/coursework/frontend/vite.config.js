import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '.sites.local',
      '.chatgpt-team.site',
      '.oaiusercontent.com',
      '.openai.org',
    ],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        // The dev server is the same-origin gateway for the browser.
        headers: {Origin: 'http://localhost:3000'},
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        headers: {Origin: 'http://localhost:3000'},
      },
    },
  },
});
