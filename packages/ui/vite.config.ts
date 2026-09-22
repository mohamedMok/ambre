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
        button: resolve('src/button/register.ts'),
        checkbox: resolve('src/checkbox/register.ts'),
        disclosure: resolve('src/disclosure/register.ts'),
        icon: resolve('src/icon/register.ts'),
        link: resolve('src/link/register.ts'),
        radio: resolve('src/radio/register.ts'),
        select: resolve('src/select/register.ts'),
        'text-field': resolve('src/text-field/register.ts'),
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
