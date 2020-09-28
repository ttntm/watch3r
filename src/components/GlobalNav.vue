<template>
  <nav class="w-full flex flex-row justify-between sm:justify-start items-center px-4 py-2 mb-8">
    <BtnMenu class="block" />
    <div class="hidden sm:flex flex-row items-center justify-center flex-grow">
      <router-link :to="{name: 'home'}" v-if="loggedIn" v-click-blur class="nav-link" :class="{'active' : currentView === 'home'}">
        Home
      </router-link>
      <router-link :to="{name: 'watchlist'}" v-if="loggedIn" v-click-blur class="nav-link" :class="{'active' : currentView === 'watchlist'}">
        Watchlist
      </router-link>
      <router-link :to="{name: 'tracker'}" v-if="loggedIn" v-click-blur class="nav-link" :class="{'active' : currentView === 'tracker'}">
        Tracker
      </router-link>
      <router-link :to="{name: 'about'}" v-if="loggedIn" v-click-blur class="nav-link" :class="{'active' : currentView === 'about'}">
        About
      </router-link>
    </div>
    <BtnLogout v-if="loggedIn" class="block" />
  </nav>
</template>

<script>
import BtnLogout from '@/components/buttons/BtnLogout.vue';
import BtnMenu from '@/components/buttons/BtnMenu.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'GlobalNav',
  components: {
    BtnLogout,
    BtnMenu
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    return {
      currentView: computed(() => route.name),
      loggedIn: computed(() => store.getters['user/loggedIn']),
    }
  }
}
</script>

<style lang="postcss" scoped>
  .nav-link {
    @apply relative text-gray-600 font-bold text-lg px-2 pb-1 mx-2;
  }
  .nav-link:hover {
    @apply text-gray-400;
  }
  .nav-link::after {
    content: "";
    @apply absolute left-0 bottom-0 bg-transparent w-full opacity-0;
    height: 2px;
    transform: translateY(7px);
  }
  .active,
  .nav-link.active:hover {
    @apply text-gray-400;
  }
  .active::after {
    content: "";
    @apply absolute left-0 bottom-0 bg-gray-500 w-full opacity-100;
    height: 2px;
    transform: translateY(0);
    transition: opacity 0.5s, transform 0.5s ease;
  }
</style>