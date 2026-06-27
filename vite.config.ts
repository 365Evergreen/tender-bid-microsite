/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const repoName = 'tender-bid-microsite';

export default defineConfig({
  // GitHub Pages serves the site under /<repo-name>/.
  // For local dev / non-Pages deploys, set VITE_BASE="/" or omit the env var.
  base: process.env.VITE_BASE || `/${repoName}/`,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    css: false,
  },
});