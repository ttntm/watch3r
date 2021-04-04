import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  build: {
    cssCodeSplit: false
  },
  optimizeDeps: {
    include: [
      'body-scroll-lock',
      'core-js',
      'file-saver',
      'gotrue-js',
      'papaparse',
      'secure-ls',
      'vue',
      'vue-router',
      'vuex',
      'vuex-multi-tab-state',
      'vuex-persistedstate',
    ]
  },
  plugins: [
    vue()
  ],
  rollupOptions: {
    // Disabled Hashing as Netlify Does Hashing for us using Etag.
    output: {
      entryFileNames: `assets/[name].js`,
      chunkFileNames: `assets/[name].js`,
      assetFileNames: `assets/[name].[ext]`,
    }
  }
});