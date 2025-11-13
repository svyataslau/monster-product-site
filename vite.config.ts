import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 8080,
    open: true,
  },
  preview: {
    port: 8080,
  }
});

