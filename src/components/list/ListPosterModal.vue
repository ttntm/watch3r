<template>
  <section id="poster-modal" v-esc="closePoster" v-scroll-lock>
    <img :src="poster" class="block self-center max-w-full shadow-lg rounded-sm" :alt="title" :title='`Poster for "${title}"`' v-click-outside="closePoster">
  </section>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'ListPosterModal',
  props: {
    poster: String,
    title: String
  },
  setup() {
    const store = useStore();

    const closePoster = () => {
      store.dispatch('app/toggleWindow', 0);
    }

    return {
      closePoster
    }
  }
}
</script>

<style lang="postcss" scoped>
  #poster-modal {
    @apply fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-20;
  }
</style>