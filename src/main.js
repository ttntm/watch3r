import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'

import detectTokens from '@/helpers/authorize-tokens.js';

import(/* webpackPreload: true */ '@/assets/styles/index.css');

const app = createApp(App);
  app.use(router);
  app.use(store);

store.dispatch("user/initAuth");

detectTokens();

let handleClickBlur = null;
let handleOutsideClick = null;

app.directive('click-outside', {
  beforeMount(el, binding, vnode) {
    handleOutsideClick = (e) => {
      e.stopPropagation();
      if(!el.contains(e.target) && !e.target.classList.contains('click-outside-ignore')) {
        binding.value();
      }
    }
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('touchstart', handleOutsideClick);
  }
});

app.directive('click-blur', {
  beforeMount(el, binding, vnode) {
    handleClickBlur = (e) => {
      if(e.target.nodeName !== 'INPUT') {
        e.target.blur();
      }
    }
    document.addEventListener('click', handleClickBlur);
    document.addEventListener('touchstart', handleClickBlur);
  },
  beforeUnmount() {
    document.removeEventListener('click', handleClickBlur);
    document.removeEventListener('touchstart', handleClickBlur);
  }
});

app.mount('#app');