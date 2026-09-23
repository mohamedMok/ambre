import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
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
