<script setup>
  import { useStore } from 'vuex'

  const props = defineProps({
    mode: String
  })

  const store = useStore()

  const onResetClick = () => {
    store.dispatch('tools/resetList', [props.mode, 1])
  }
</script>

<template>
  <p class="text-sm text-center text-gray-500 font-bold mb-0">
    No results for the current filter selection :(<br>
    <a href="#clear" class="text-yellow-600 font-normal hover:underline focus:underline" @click.prevent="onResetClick()">Reset filter selection</a>
  </p>
</template>