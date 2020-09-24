<template>
  <nav class="w-full flex flex-row justify-items-start items-center px-4 py-2 mb-8">
    <div class="text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </svg>
    </div>
    <div class="flex-grow text-center">
      <h1 class="text-xl capitalize m-0">
        {{ currentView }}
      </h1>
    </div>
    <div class="text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-logout" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
        <path d="M7 12h14l-3 -3m0 6l3 -3" />
      </svg>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'GlobalNav',
  setup() {
    const route = useRoute();

    return {
      currentView: computed(() => route.name)
    }
  }
}
</script>

<style>

</style>