<template>
  <button
    v-click-blur
    class="click-outside-ignore"
    aria-label="Open menu"
    title="Open Menu"
    @click.prevent="toggleMenu()"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="click-outside-ignore icon icon-tabler icon-tabler-menu-2" :width="iconSize" :height="iconSize" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
    <slot />
  </button>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'BtnMenu',
  props: {
    iconSize: {
      type: Number,
      default: 40
    }
  },
  setup() {
    const store = useStore();
    const menuOpen = computed(() => store.getters['app/windowOpen'] == 1);

    const toggleMenu = () => {
      return menuOpen.value ? store.dispatch('app/toggleWindow', 0) : store.dispatch('app/toggleWindow', 1);
    }

    return {
      toggleMenu
    }
  }
}
</script>