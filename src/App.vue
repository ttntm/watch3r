<template>
  <div id="app" :class="{ 'overflow-hidden' : menuOpen }" class="flex h-full flex-col">
    <Nav :class="{ 'menu-blur' : menuOpen }" />
    <div :class="{ 'menu-blur' : menuOpen }" class="container flex-grow flex-shrink-0 px-4 mx-auto">
      <router-view msg="Testing router view" />
    </div>
    <Footer />
    <ToastMessage />
  </div>
</template>

<script>
import Nav from './components/GlobalNav.vue'
import Footer from './components/GlobalFooter.vue'
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
    Nav,
    Footer,
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
</style>
