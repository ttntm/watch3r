<template>
  <transition name="overlay">
    <div v-if="modalOpen && modalOpen !== 1" class="overlay" />
  </transition>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ModalBackdrop',
  setup() {
    const store = useStore();

    return {
      modalOpen: computed(() => store.getters['app/windowOpen'])
    }
  }
}
</script>

<style lang="postcss" scoped>
  .overlay {
    @apply z-10 fixed bg-gray-900 top-0 bottom-0 left-0 right-0 w-full h-full;
    opacity: 0.9;
  }

  .overlay-enter-active,
  .overlay-leave-active {
    transition: opacity 0.35s;
  }

  .overlay-enter-from,
  .overlay-leave-to {
    opacity: 0;
  }
</style>