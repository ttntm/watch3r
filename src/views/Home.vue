<script setup>
  import HomeLogin from '@/components/HomeLogin.vue'
  import { computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  const router = useRouter()
  const store = useStore()

  const currentUser = computed(() => store.getters['user/currentUser'])
  const loggedIn = computed(() => store.getters['user/loggedIn'])

  watch(currentUser, () => {
    if (currentUser.value !== null) {
      const target = currentUser.value.user_metadata.user_start === 0 ? 'watchlist' : 'tracker' // store might not be done updating data yet, so better get it right from the user Object
      router.push({ name: target })
    }
  })
</script>

<template>
  <div class="flex flex-grow items-center justify-items-center w-full h-full">
    <div class="text-center self-center max-w-full md:max-w-sm mx-auto">
      <div class="mb-12">
        <h1 class="text-lg text-gray-600">
          Presenting...
        </h1>
        <img src="/img/logo.svg" class="max-w-xs mx-auto my-8" alt="WATCH3R">
        <h2 class="text-lg">
          A watchlist and tracking app for your movies and series
        </h2>
        <p v-if="!loggedIn">
          <router-link :to="{ name: 'about' }" class="text-yellow-600 hover:underline">
            Read more...
          </router-link>
        </p>
      </div>
      <div v-if="loggedIn">
        <nav class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <router-link :to="{ name: 'watchlist' }" class="w-3/4 sm:w-auto btn btn-black mx-auto sm:m-0">
            Watchlist
          </router-link>
          <router-link :to="{ name: 'tracker' }" class="w-3/4 sm:w-auto btn btn-black mx-auto sm:m-0">
            Tracker
          </router-link>
          <router-link :to="{ name: 'explore' }" class="w-3/4 sm:w-auto btn btn-black mx-auto sm:m-0">
            Explore
          </router-link>
          <router-link :to="{ name: 'profile' }" class="w-3/4 sm:w-auto btn btn-black mx-auto sm:m-0">
            Profile
          </router-link>
        </nav>
        <div class="text-center mt-12">
          <p class="mb-0">
            Have fun, we hope you like it here.
          </p>
        </div>
      </div>
      <div v-else>
        <HomeLogin />
        <p class="text-sm mt-8">
          No account? <router-link :to="{ name: 'invite' }" class="text-yellow-600 hover:underline">
            Request an invite
          </router-link>.
        </p>
      </div>
    </div>
  </div>
</template>