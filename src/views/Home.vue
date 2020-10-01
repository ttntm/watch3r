<template>
  <div class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="text-center self-center max-w-full md:max-w-sm mx-auto">
      <div class="mb-16">
        <h1 class="text-3xl text-yellow-600">watch3r</h1>
        <h2 class="text-xl">A watchlist and tracking app for your movies and series</h2>
      </div>
      <div v-if="loggedIn" class="flex flex-col items-center">
        <router-link :to="{name: 'watchlist'}" class="btn btn-black mb-4">
          Watchlist
        </router-link>
        <router-link :to="{name: 'tracker'}" class="btn btn-black mb-4">
          Tracker
        </router-link>
        <router-link :to="{name: 'about'}" class="btn btn-black mb-4">
          About
        </router-link>
      </div>
      <HomeLogin v-else />
      <p v-if="!loggedIn" class="text-sm mt-8">No account? <a href="mailto:x@z.y" class="text-yellow-600 hover:text-gray-900">Contact us</a> and ask for an invite (no guarantees or promises).</p>
    </div>
  </div>
</template>

<script>
import HomeLogin from '@/components/HomeLogin.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Home',
  components: {
    HomeLogin
  },
  setup() {
    const store = useStore();

    const loggedIn = computed(() => store.getters['user/loggedIn']);

    return {
      loggedIn
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>