<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  const props = defineProps({
    mode: String
  })

  const store = useStore()

  const inputLength = computed(() => store.getters[`list/${props.mode}Cache`].length)
  const resultLength = computed(() => store.getters[`list/${props.mode}`].length)
  const searchStatus = computed(() => {
    return resultLength.value > 0
      ? `Showing ${resultLength.value} of ${inputLength.value} listed titles.`
      : 'No results.'
  })

  const onResetClick = () => {
    store.dispatch('tools/resetList', props.mode)
  }
</script>

<template>
  <p class="text-sm text-center text-gray-500 font-bold mb-0">
    {{ searchStatus }} <a href="#clear" class="text-yellow-600 font-normal hover:underline focus:underline" @click.prevent="onResetClick()">Clear search</a>
  </p>
</template>