import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The SPA is served by the Cloudflare Worker in production; locally the API runs
// on the Worker dev server (npm run dev:api) and Vite proxies /api to it.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.API_DEV_URL || 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
});
