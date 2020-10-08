import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import detectTokens from '@/helpers/authorize-tokens.js';

import(/* webpackPreload: true */ '@/assets/styles/index.css');

const app = createApp(App);
  app.use(router);
  app.use(store);

store.dispatch("user/initAuth");

detectTokens();

const clickBlurExclude = ['INPUT','SELECT','TEXTAREA'];
let escHandler = null;
let handleClickBlur = null;
let handleOutsideClick = null;

app.directive('click-blur', {
  beforeMount(el, binding, vnode) {
    handleClickBlur = (e) => {
      if(clickBlurExclude.indexOf(e.target.nodeName) === -1) {
        e.target.blur();
      }
    }
    el.addEventListener('click', handleClickBlur);
    el.addEventListener('touchstart', handleClickBlur);
  },
  beforeUnmount(el) {
    el.removeEventListener('click', handleClickBlur);
    el.removeEventListener('touchstart', handleClickBlur);
  }
});

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

app.directive('esc', {
  beforeMount(el, binding, vnode) {
    escHandler = (e) => {
      if ((e.key=='Escape'||e.key=='Esc'||e.keyCode==27)) {
        binding.value();
      }
    }
    document.addEventListener('keydown', escHandler);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', escHandler);
  }
});

app.directive('scroll-lock', {
  // there could be issues with iOS at some point: https://github.com/willmcpo/body-scroll-lock#allowtouchmove
  beforeMount(el, binding, vnode) {
    disableBodyScroll(el); // desirable, but causes body twitch: { reserveScrollBarGap: true }
  },
  beforeUnmount(el) {
    enableBodyScroll(el);
  }
});

app.mount('#app');