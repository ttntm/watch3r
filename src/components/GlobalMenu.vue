<template>
  <nav v-click-outside="closeMenu" v-esc="closeMenu" v-scroll-lock class="app-menu">
    <section class="flex flex-row justify-between items-center pr-4 py-2">
      <img src="/img/icon.svg" class="px-4" style="width: 60px;" alt="WATCH3R">
      <BtnClose btn-title="Close Menu" @click="closeMenu" />
    </section>
    <section class="flex flex-col text-gray-800">
      <router-link v-for="item in menuItems" :key="item.name" v-click-blur :to="{name: item.name}" class="menu-item">
        {{ item.name }}
      </router-link>
    </section>
  </nav>
</template>

<script>
import BtnClose from './buttons/BtnClose.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'GlobalMenu',
  components: {
    BtnClose
  },
  props: {
    menuItems: Array
  },
  setup() {
    const store = useStore();

    const closeMenu = () => {
      store.dispatch('app/toggleWindow', 0);
    }

    return {
      closeMenu,
      loggedIn: computed(() => store.getters['user/loggedIn'])
    }
  }
}
</script>