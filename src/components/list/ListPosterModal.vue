<template>
  <transition name="poster">
    <section v-if="isVisible" id="poster-modal" v-esc="closePoster" v-scroll-lock>
      <img v-click-outside="closePoster" :src="poster" class="block self-center max-w-full shadow-lg rounded-sm" :alt="title" :title="`Poster for &quot;${title}&quot;`">
    </section>
  </transition>
</template>

<script>
import { useStore } from 'vuex';
import { useDelay } from '../../helpers/shared';

export default {
  name: 'ListPosterModal',
  props: {
    poster: String,
    title: String
  },
  setup() {
    const store = useStore();

    const { isVisible, toggleDelay } = useDelay();

    const closePoster = () => {
      toggleDelay();
      setTimeout(() => store.dispatch('app/toggleWindow', 0), 100);
    }

    return {
      closePoster,
      isVisible
    }
  }
}
</script>

<style lang="postcss" scoped>
  #poster-modal {
    @apply fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-20;
  }
</style>