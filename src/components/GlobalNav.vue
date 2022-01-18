<script setup>
  import BtnLogout from '@/components/buttons/BtnLogout.vue'
  import BtnMenu from '@/components/buttons/BtnMenu.vue'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'

  const route = useRoute()
  const store = useStore()

  const currentView = computed(() => route.name)
  const loggedIn = computed(() => store.getters['user/loggedIn'])
</script>

<template>
  <nav class="w-full flex flex-row justify-between sm:justify-start items-center px-4 py-2 mb-8">
    <BtnMenu class="block text-gray-600 hover:text-gray-200 focus:text-gray-200" />
    <div v-if="loggedIn" class="hidden sm:flex flex-row items-center justify-center flex-grow">
      <router-link v-click-blur :to="{ name: 'watchlist' }" class="nav-link" :class="{ 'active' : currentView === 'watchlist' }">
        Watchlist
      </router-link>
      <router-link v-click-blur :to="{ name: 'tracker' }" class="nav-link" :class="{ 'active' : currentView === 'tracker' }">
        Tracker
      </router-link>
      <router-link v-click-blur :to="{ name: 'explore' }" class="nav-link" :class="{ 'active' : currentView === 'explore' }">
        Explore
      </router-link>
    </div>
    <BtnLogout v-if="loggedIn" class="block" />
  </nav>
</template>