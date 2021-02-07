<template>
  <footer class="text-sm px-4 py-2 sm:py-4 mt-8">
    <nav class="footer-nav flex flex-row flex-wrap justify-center items-center">
      <router-link v-click-blur :to="{name: 'home'}">
        Home
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'watchlist'}">
        Watchlist
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'tracker'}">
        Tracker
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'explore'}">
        Explore
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'profile'}">
        Profile
      </router-link>
      <router-link v-click-blur :to="{name: 'about'}">
        About
      </router-link>
      <router-link v-click-blur :to="{name: 'support'}">
        Support
      </router-link>
    </nav>
    <p class="text-xs text-center mt-2 mb-0">
      watch3r.app,
      &copy; <a href="https://ttntm.me" target="_blank" class="hover:text-yellow-600">ttntm</a> 2021
    </p>
  </footer>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'GlobalFooter',
  setup() {
    const store = useStore();

    return {
      loggedIn: computed(() => store.getters['user/loggedIn']),
    }
  },
}
</script>

<style lang="postcss" scoped>
  .footer-nav a {
    @apply text-yellow-600 font-bold px-4 py-2;
  }

  .footer-nav a:hover {
    @apply text-gray-900;
  }

  @media(min-width:640px) {
    .footer-nav a {
      @apply py-0;
    }
  }
</style>