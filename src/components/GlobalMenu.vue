<template>
  <nav v-click-outside="closeMenu" v-esc="closeMenu" v-scroll-lock class="app-menu">
    <section class="flex flex-row justify-between items-center pr-4 py-2">
      <img src="/img/icon.svg" class="px-4" style="width: 60px;" alt="WATCH3R">
      <BtnClose btn-title="Close Menu" @click="closeMenu" />
    </section>
    <section class="flex flex-col text-gray-800">
      <router-link v-click-blur :to="{name: 'home'}" class="menu-item">
        Home
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'watchlist'}" class="menu-item">
        Watchlist
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'tracker'}" class="menu-item">
        Tracker
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'explore'}" class="menu-item">
        Explore
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'import'}" class="menu-item">
        Import
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'profile'}" class="menu-item">
        Profile
      </router-link>
      <router-link v-click-blur :to="{name: 'about'}" class="menu-item">
        About
      </router-link>
      <router-link v-click-blur :to="{name: 'support'}" class="menu-item">
        Support
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
  setup() {
    const store = useStore();

    const closeMenu = () => {
      store.dispatch('app/toggleWindow', 0);
    }

    return {
      closeMenu,
      loggedIn: computed(() => store.getters['user/loggedIn'])
    }
  },
}
</script>