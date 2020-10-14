<template>
  <div id="app-inner" class="flex flex-col min-h-screen">
    <GlobalNav />
    <transition name="fade">
      <div id="app-menu-container" class="bg-gray-900 sm:bg-transparent" v-if="menuOpen" />
    </transition>
    <transition name="slide-fade">
      <GlobalMenu v-if="menuOpen" />
    </transition>
    <div class="container flex flex-col flex-grow flex-shrink-0 px-4 mx-auto">
      <router-view :key="routeFull" />
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
import { useRoute } from 'vue-router';
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
    const route = useRoute();
    const store = useStore();

    return {
      routeFull: computed(() => route.fullPath),
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

  #app-menu-container {
    @apply fixed top-0 left-0 w-screen h-screen z-10;
    opacity: 0.9;
  }

  .fade-enter-active,
  .fade-leave-active
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.75s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(-200px);
    opacity: 0;
  }
</style>