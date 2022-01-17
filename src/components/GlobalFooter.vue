<template>
  <footer class="text-sm px-4 py-2 sm:py-4 mt-8">
    <nav class="hidden sm:flex footer-nav flex-row flex-wrap justify-center items-center">
      <router-link v-for="item in menuItems" :key="item.name" v-click-blur :to="{name: item.name}">
        {{ item.name }}
      </router-link>
    </nav>
    <BtnMenu :iconSize="24" class="flex sm:hidden flex-row items-center justify-center text-sm font-bold text-yellow-600 hover:text-gray-900 mx-auto">Show Menu</BtnMenu>
    <p class="text-xs text-center mt-2 mb-0">
      Made with ♥ by <a href="https://ttntm.me" target="_blank" class="hover:text-yellow-600">ttntm</a>, <a href="https://github.com/ttntm/watch3r" target="_blank" rel="noopener" class="hover:text-yellow-600">Code@GitHub (GPL-3.0)</a><br>
      &copy; watch3r.app {{year}}, <a href="https://www.buymeacoffee.com/ttntm" class="text-yellow-600 hover:underline" target="_blank" rel="noopener">&plus;Donate</a>
    </p>
  </footer>
</template>

<script>
import BtnMenu from './buttons/BtnMenu.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'GlobalFooter',
  components: {
    BtnMenu
  },
  props: {
    menuItems: Array
  },
  setup() {
    const store = useStore();

    const date = new Date();
    const year = date.getFullYear();

    return {
      loggedIn: computed(() => store.getters['user/loggedIn']),
      year
    }
  }
}
</script>
