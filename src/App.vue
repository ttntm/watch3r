<template>
  <div id="app-inner" class="flex flex-col h-full min-h-screen">
    <GlobalNav />
    <GlobalMenu />
    <div class="container flex flex-col flex-grow flex-shrink-0 px-4 mx-auto">
      <router-view />
    </div>
    <GlobalFooter />
    <ToastMessage />
  </div>
</template>

<script>
import GlobalNav from './components/GlobalNav.vue'
import GlobalMenu from './components/GlobalMenu.vue'
import GlobalFooter from './components/GlobalFooter.vue'
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
    GlobalNav,
    GlobalMenu,
    GlobalFooter,
    'ToastMessage': () => import('@/components/ToastMessage.vue')
  },
  setup() {
    const store = useStore();

    return {
      menuOpen: computed(() => store.getters.menuOpen),
    }
  }
}
</script>

<style lang="postcss">
  #app {
    @apply font-sans text-center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .menu-blur {
    filter: blur(1rem);
  }

  .btn {
    @apply block font-bold rounded-none shadow-md px-6 py-2;
  }

  .btn:hover {
    @apply shadow-none;
  }

  .btn-black {
    @apply bg-gray-900 text-yellow-600 border border-transparent;
  }

  .btn-black:hover,
  .btn-black:focus {
    @apply bg-yellow-600 text-gray-900;
  }
</style>
