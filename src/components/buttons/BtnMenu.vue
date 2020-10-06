<template>
  <button
    @click.prevent="toggleMenu()"
    v-click-blur
    class="text-gray-600 hover:text-gray-200 focus:text-gray-200 click-outside-ignore"
    aria-label="Open menu"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="click-outside-ignore icon icon-tabler icon-tabler-menu-2" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  </button>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'BtnMenu',
  setup() {
    const store = useStore();
    const menuOpen = computed(() => store.getters['app/menuOpen']);

    const toggleMenu = () => {
      store.dispatch('list/toggleAddTitleModal', false);
      return menuOpen.value ? store.dispatch('app/toggleMenu', false) : store.dispatch('app/toggleMenu', true);
    }

    return {
      toggleMenu
    }
  }
}
</script>

<style>

</style>