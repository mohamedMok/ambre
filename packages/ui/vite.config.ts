import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // `@use 'tools'` resolves to src/styles; `@use 'tokens'` to the compiled token variables.
        loadPaths: [resolve('src/styles'), resolve('../tokens/dist/scss')],
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
        badge: resolve('src/badge/register.ts'),
        banner: resolve('src/banner/register.ts'),
        breadcrumbs: resolve('src/breadcrumbs/register.ts'),
        button: resolve('src/button/register.ts'),
        card: resolve('src/card/register.ts'),
        checkbox: resolve('src/checkbox/register.ts'),
        'checkbox-card': resolve('src/checkbox-card/register.ts'),
        'date-picker': resolve('src/date-picker/register.ts'),
        dialog: resolve('src/dialog/register.ts'),
        disclosure: resolve('src/disclosure/register.ts'),
        icon: resolve('src/icon/register.ts'),
        layout: resolve('src/layout/register.ts'),
        link: resolve('src/link/register.ts'),
        menu: resolve('src/menu/register.ts'),
        pagination: resolve('src/pagination/register.ts'),
        progress: resolve('src/progress/register.ts'),
        radio: resolve('src/radio/register.ts'),
        'radio-card': resolve('src/radio-card/register.ts'),
        range: resolve('src/range/register.ts'),
        select: resolve('src/select/register.ts'),
        skeleton: resolve('src/skeleton/register.ts'),
        spinner: resolve('src/spinner/register.ts'),
        'stat-tile': resolve('src/stat-tile/register.ts'),
        tabs: resolve('src/tabs/register.ts'),
        tag: resolve('src/tag/register.ts'),
        'text-area': resolve('src/text-area/register.ts'),
        'text-field': resolve('src/text-field/register.ts'),
        tile: resolve('src/tile/register.ts'),
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
