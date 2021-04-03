import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
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
  ]
});