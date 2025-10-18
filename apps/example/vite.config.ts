import vue from '@vitejs/plugin-vue';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItPrism from 'markdown-it-prism';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import Markdown from 'vite-plugin-md';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      markdownItSetup(md) {
        md.use(markdownItAnchor);
        md.use(markdownItPrism);
      },
      wrapperClasses: 'markdown-body',
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('../../', import.meta.url)),
      '@example': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@example/assets/scss/global.scss' as *;`,
      },
    },
  },
});
