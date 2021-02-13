<template>
  <nav class="w-full flex flex-row justify-between sm:justify-start items-center px-4 py-2 mb-8">
    <BtnMenu class="block" />
    <div class="hidden sm:flex flex-row items-center justify-center flex-grow">
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'watchlist'}" class="nav-link" :class="{'active' : currentView === 'watchlist'}">
        Watchlist
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'tracker'}" class="nav-link" :class="{'active' : currentView === 'tracker'}">
        Tracker
      </router-link>
      <router-link v-if="loggedIn" v-click-blur :to="{name: 'explore'}" class="nav-link" :class="{'active' : currentView === 'explore'}">
        Explore
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