<template>
  <nav class="app-menu" v-click-outside="closeMenu" v-esc="closeMenu" v-scroll-lock>
    <section class="flex flex-row justify-between items-center py-2">
      <img src="/img/icon.svg" class="px-4" style="width: 60px;" alt="WATCH3R">
      <button
        @click.prevent="closeMenu()"
        class="font-bold text-gray-800 text-xl opacity-75 cursor-pointer px-4 hover:opacity-100 focus:outline-none"
        title="Close Menu"
      >×</button>
    </section>
    <section class="flex flex-col text-gray-800">
      <router-link :to="{name: 'home'}" class="menu-item" v-click-blur>
        Home
      </router-link>
      <router-link :to="{name: 'watchlist'}" v-if="loggedIn" class="menu-item" v-click-blur>
        Watchlist
      </router-link>
      <router-link :to="{name: 'tracker'}" v-if="loggedIn" class="menu-item" v-click-blur>
        Tracker
      </router-link>
      <router-link :to="{name: 'explore'}" v-if="loggedIn" class="menu-item" v-click-blur>
        Explore
      </router-link>
      <router-link :to="{name: 'import'}" v-if="loggedIn" class="menu-item" v-click-blur>
        Import
      </router-link>
      <router-link :to="{name: 'profile'}" v-if="loggedIn" class="menu-item" v-click-blur>
        Profile
      </router-link>
      <router-link :to="{name: 'about'}" class="menu-item" v-click-blur>
        About
      </router-link>
      <router-link :to="{name: 'support'}" class="menu-item" v-click-blur>
        Support
      </router-link>
    </section>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'GlobalMenu',
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

<style lang="postcss" scoped>
  .app-menu {
    @apply fixed top-0 left-0 z-20 max-w-xs bg-gray-200 rounded-lg shadow-lg pb-4 ml-8 mt-6;
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