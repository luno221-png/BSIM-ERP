import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: false, // Désactive le scan CSS lent (déjà géré proprement)
    minify: 'esbuild',
  },
});