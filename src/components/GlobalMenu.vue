<template>
  <div class="app-menu" v-click-outside="closeMenu" v-esc="closeMenu">
    <div class="flex flex-row justify-between items-center pt-2">
      <p class="text-sm text-gray-600 font-bold px-4 mb-0">watch3r</p>
      <button
        @click.prevent="closeMenu()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer px-4 hover:opacity-100 focus:outline-none"
      >×</button>
    </div>
    <div class="flex flex-col text-gray-800">
      <router-link :to="{name: 'home'}" class="menu-item">
        Home
      </router-link>
      <router-link :to="{name: 'watchlist'}" v-if="loggedIn" class="menu-item">
        Watchlist
      </router-link>
      <router-link :to="{name: 'tracker'}" v-if="loggedIn" class="menu-item">
        Tracker
      </router-link>
      <router-link :to="{name: 'profile'}" v-if="loggedIn" class="menu-item">
        Profile
      </router-link>
      <router-link :to="{name: 'about'}" class="menu-item">
        About
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'GlobalMenu',
  setup() {
    const store = useStore();

    const closeMenu = () => {
      store.dispatch('app/toggleMenu', false);
    }

    return {
      closeMenu,
      loggedIn: computed(() => store.getters['user/loggedIn'])
    }
  },
}
</script>

<style lang="postcss" scoped>
  .app-menu {
    @apply fixed top-0 left-0 z-10 max-w-xs bg-gray-200 rounded-lg shadow-lg pb-4 ml-8 mt-6;
    width: 80%;
  }

  @media(max-width: 767px) {
    .app-menu {
      @apply right-0 mx-auto;
    }
  }

  .menu-item {
    @apply w-full block tracking-wide font-bold text-lg text-center py-3;
  }

  .menu-item:hover {
    @apply bg-gray-400 text-blue-800 shadow-inner;
  }
</style>