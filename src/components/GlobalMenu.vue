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
import BtnClose from '@/components/buttons/BtnClose.vue';
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

<style lang="postcss" scoped>
  .app-menu {
    @apply fixed top-0 left-0 z-20 max-w-xs bg-gray-200 rounded-lg shadow-lg overflow-y-auto pb-4 ml-8 my-6;
    width: 80%;
    max-height: calc(100% - 3rem);
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