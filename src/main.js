import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'

import attemptToAuthorizeTokens from './helpers/authorize-tokens';

import(/* webpackPreload: true */ '@/assets/styles/index.css');

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')

store.dispatch("user/initAuth");

attemptToAuthorizeTokens();