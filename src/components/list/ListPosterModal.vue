<script setup>
  import { useStore } from 'vuex'
  import { useDelay } from '@/helpers/shared'

  const props = defineProps({
    poster: String,
    title: String
  })

  const store = useStore()

  const { isVisible, toggleDelay } = useDelay()

  const closePoster = () => {
    toggleDelay()
    setTimeout(() => store.dispatch('app/toggleWindow', 0), 100)
  }
</script>

<template>
  <transition name="poster">
    <div v-if="isVisible" id="poster-modal" v-esc="closePoster" v-scroll-lock>
      <img
        v-click-outside="closePoster"
        :src="poster"
        :title="`Poster for &quot;${title}&quot;`"
        :alt="title"
        class="poster"
        width="500"
      />
    </div>
  </transition>
</template>

<style lang="postcss" scoped>
  #poster-modal {
    @apply fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-20;
  }

  .poster {
    @apply block self-center shadow-lg rounded-sm;
    max-height: 75vh;
    max-width: calc(100vw - 4rem);
  }
</style>