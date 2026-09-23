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
        badge: resolve('src/badge/register.ts'),
        banner: resolve('src/banner/register.ts'),
        breadcrumbs: resolve('src/breadcrumbs/register.ts'),
        button: resolve('src/button/register.ts'),
        checkbox: resolve('src/checkbox/register.ts'),
        dialog: resolve('src/dialog/register.ts'),
        disclosure: resolve('src/disclosure/register.ts'),
        icon: resolve('src/icon/register.ts'),
        link: resolve('src/link/register.ts'),
        menu: resolve('src/menu/register.ts'),
        pagination: resolve('src/pagination/register.ts'),
        progress: resolve('src/progress/register.ts'),
        radio: resolve('src/radio/register.ts'),
        range: resolve('src/range/register.ts'),
        select: resolve('src/select/register.ts'),
        skeleton: resolve('src/skeleton/register.ts'),
        spinner: resolve('src/spinner/register.ts'),
        tabs: resolve('src/tabs/register.ts'),
        tag: resolve('src/tag/register.ts'),
        'text-area': resolve('src/text-area/register.ts'),
        'text-field': resolve('src/text-field/register.ts'),
        toggle: resolve('src/toggle/register.ts'),
        tooltip: resolve('src/tooltip/register.ts'),
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
