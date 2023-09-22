<script setup>
  import { onMounted, ref } from 'vue'
  import { useIntersectionObserver } from '@/helpers/shared.js'

  const shouldRender = ref(false)
  const targetEl = ref()

  onMounted(() => {  
    const { stop } = useIntersectionObserver(
      targetEl,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          shouldRender.value = true
          stop()
        }
      },
      {
        rootMargin: '250px',
        threshold: 0.25
      }
    )
  })
</script>

<template>
  <article class="list-item flex-col sm:flex-row" ref="targetEl">
    <slot v-if="shouldRender" />
  </article>
</template>