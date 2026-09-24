import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Commerce shares the core ITCSS layers: `@use 'tools'` resolves to @ambre-ds/ui's src/styles.
        loadPaths: [resolve('../ui/src/styles'), resolve('../tokens/dist/scss')],
      },
    },
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve('src/index.ts'),
        quantity: resolve('src/quantity/register.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'runtime.js',
      },
    },
  },
});
