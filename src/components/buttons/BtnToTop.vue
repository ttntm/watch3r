<script setup>
  // based on: https://github.com/caiofsouza/vue-backtotop/blob/master/src/BackToTop.vue
  import { onMounted, onUnmounted, ref } from 'vue'

  const visible = ref(false)

  onMounted(() => window.addEventListener('scroll', events.onScroll))
  
  onUnmounted(() => window.removeEventListener('scroll', events.onScroll))

  const events = {
    onBackToTop() {
      window.smoothScroll()
    },
    
    onScroll() {
      visible.value = window.pageYOffset > 1024
    }
  }
  
  window.smoothScroll = () => {
    let currentScroll = document.documentElement.scrollTop || document.body.scrollTop
    if (currentScroll > 0) {
      window.requestAnimationFrame(window.smoothScroll)
      window.scrollTo(0, Math.floor(currentScroll - (currentScroll / 5)))
    }
  }
</script>

<template>
  <transition name="btt-fade">
    <button
      v-show="visible"
      v-click-blur
      class="back-to-top mx-2 my-4 lg:m-6"
      title="Back to Top"
      @click="events.onBackToTop"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none icon icon-tabler icon-tabler-chevron-up" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="6 15 12 9 18 15" />
      </svg>
    </button>
  </transition>
</template>

<style lang="postcss" scoped>
  .btt-fade-enter-active,
  .btt-fade-leave-active {
    transition: opacity 0.5s;
  }

  .btt-fade-enter-from,
  .btt-fade-leave-to {
    opacity: 0;
  }

  .back-to-top {
    @apply fixed z-10 bottom-0 right-0 rounded-full bg-gray-700 text-gray-900 shadow-lg p-2;
  }

  .back-to-top:hover {
    @apply bg-gray-900 text-gray-700;
  }
</style>