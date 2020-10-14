<template>
  <div class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="text-center self-center max-w-full md:max-w-sm mx-auto">
      <div class="mb-12">
        <h1 class="text-3xl text-yellow-600">watch3r</h1>
        <h2 class="text-xl">A watchlist and tracking app for your movies and series</h2>
      </div>
      <div v-if="loggedIn">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
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
        <div class="text-center mt-12">
          <p class="mb-8">If you like it here, please consider supporting the coffee fueled development efforts.</p>
          <a href="https://www.buymeacoffee.com/ttntm" target="_blank" class="inline-block shadow-lg hover:shadow-none hover:opacity-75" title="Thank you!">
            <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" class="mx-auto" style="height: 45px; width: auto" alt="Buy me a coffee">
          </a>
        </div>
      </div>
      <div v-else>
        <HomeLogin />
        <p class="text-sm mt-8">No account? <router-link :to="{name: 'invite'}" class="text-yellow-600 hover:underline">Request an invite</router-link>.</p>
      </div>
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