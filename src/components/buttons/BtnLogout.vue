<template>
  <button
    v-click-blur
    class="text-gray-600 hover:text-gray-200 focus:text-gray-200 cursor-pointer"
    aria-label="Logout"
    title="Logout"
    @click.prevent="handleLogout()"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-logout" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M7 12h14l-3 -3m0 6l3 -3" />
    </svg>
  </button>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'BtnLogout',
  setup() {
    const router = useRouter();
    const store = useStore();

    const handleLogout = () => {
      store.dispatch('user/attemptLogout')
        .then(() => {
          router.push({ name: 'home' });
        })
    }

    return {
      handleLogout
    }
  }
}
</script>