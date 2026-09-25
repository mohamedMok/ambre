import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // The AI pack shares the core ITCSS layers: `@use 'tools'` resolves to @ambre-ds/ui's src/styles.
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
        'code-block': resolve('src/code-block/register.ts'),
        'tool-call': resolve('src/tool-call/register.ts'),
        message: resolve('src/message/register.ts'),
        prompt: resolve('src/prompt/register.ts'),
        suggestion: resolve('src/suggestion/register.ts'),
        thinking: resolve('src/thinking/register.ts'),
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
