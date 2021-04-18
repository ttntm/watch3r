<template>
  <footer class="text-sm px-4 py-2 sm:py-4 mt-8">
    <nav class="hidden sm:flex footer-nav flex-row flex-wrap justify-center items-center">
      <router-link v-for="item in menuItems" :key="item.name" v-click-blur :to="{name: item.name}">
        {{ item.name }}
      </router-link>
    </nav>
    <BtnMenu :iconSize="24" class="flex sm:hidden flex-row items-center justify-center text-sm font-bold text-yellow-600 hover:text-gray-900 mx-auto">Show Menu</BtnMenu>
    <p class="text-xs text-center mt-2 mb-0">
      watch3r.app, &copy; <a href="https://ttntm.me" target="_blank" class="hover:text-yellow-600">ttntm</a> 2021
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

    return {
      loggedIn: computed(() => store.getters['user/loggedIn']),
    }
  }
}
</script>