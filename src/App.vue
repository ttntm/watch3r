<template>
  <div id="app-inner" class="flex flex-col min-h-screen">
    <GlobalNav />
    <transition name="slide-fade">
      <GlobalMenu v-if="menuOpen" />
    </transition>
    <div class="container flex flex-col flex-grow flex-shrink-0 px-4 mx-auto">
      <router-view />
    </div>
    <GlobalFooter />
    <ToastMessage />
  </div>
</template>

<script>
import GlobalNav from '@/components/GlobalNav.vue'
import GlobalMenu from '@/components/GlobalMenu.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import ToastMessage from '@/components/ToastMessage.vue'
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
    GlobalNav,
    GlobalMenu,
    GlobalFooter,
    ToastMessage
  },
  setup() {
    const store = useStore();

    return {
      menuOpen: computed(() => store.getters['app/menuOpen']),
    }
  }
}
</script>

<style lang="postcss">
  #app {
    @apply font-sans;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .btn {
    @apply inline-block font-bold rounded-none shadow-md px-6 py-2;
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

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.75s;
  }
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(-200px);
    opacity: 0;
  }
</style>
