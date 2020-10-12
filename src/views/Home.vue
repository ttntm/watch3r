<template>
  <div class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="text-center self-center max-w-full md:max-w-sm mx-auto">
      <div class="mb-12">
        <h1 class="text-3xl text-yellow-600">watch3r</h1>
        <h2 class="text-xl">A watchlist and tracking app for your movies and series</h2>
      </div>
      <div v-if="loggedIn" class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <router-link :to="{name: 'watchlist'}" class="btn btn-black mx-auto sm:m-0">
          Watchlist
        </router-link>
        <router-link :to="{name: 'tracker'}" class="btn btn-black mx-auto sm:m-0">
          Tracker
        </router-link>
        <router-link :to="{name: 'profile'}" class="btn btn-black mx-auto sm:m-0">
          Profile
        </router-link>
        <router-link :to="{name: 'support'}" class="btn btn-black mx-auto sm:m-0">
          Support
        </router-link>
      </div>
      <HomeLogin v-else />
      <p v-if="!loggedIn" class="text-sm mt-8">No account? <router-link :to="{name: 'invite'}" class="text-yellow-600 hover:underline">Request an invite</router-link>.</p>
    </div>
  </div>
</template>

<script>
import HomeLogin from '@/components/HomeLogin.vue';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Home',
  components: {
    HomeLogin
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const currentUser = computed(() => store.getters['user/currentUser']);

    watch(currentUser, () => {
      if (currentUser.value) {
        const target = currentUser.value.user_metadata.user_start === 0 ? 'watchlist' : 'tracker'; // store might not be done updating data yet, so better get it right from the user Object
        router.push({ name: target });
      }
    })

    return {
      loggedIn: computed(() => store.getters['user/loggedIn']),
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>