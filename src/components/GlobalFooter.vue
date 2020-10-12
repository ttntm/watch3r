<template>
  <footer class="text-sm px-4 py-2 sm:py-4 mt-8">
    <div class="footer-nav flex flex-row flex-wrap justify-center items-center">
      <router-link :to="{name: 'home'}" v-click-blur>
        Home
      </router-link>
      <router-link :to="{name: 'about'}" v-click-blur>
        About
      </router-link>
      <router-link :to="{name: 'watchlist'}" v-if="loggedIn" v-click-blur>
        Watchlist
      </router-link>
      <router-link :to="{name: 'tracker'}" v-if="loggedIn" v-click-blur>
        Tracker
      </router-link>
      <router-link :to="{name: 'profile'}" v-if="loggedIn" v-click-blur>
        Profile
      </router-link>
      <router-link :to="{name: 'support'}" v-click-blur>
        Support
      </router-link>
    </div>
    <p class="text-xs text-center mt-2 mb-0">
      watch3r.app,
      &copy; <a href="https://ttntm.me" target="_blank" class="hover:text-yellow-600">ttntm</a> 2020
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