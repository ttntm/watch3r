<script setup>
  const props = defineProps({
    modelValue: String
  })

  const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    class="w-full focus:outline-none mb-6"
    type="range"
    min="0"
    max="10"
    step="0.1"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<style lang="postcss" scoped>
  input[type=range] {
    @apply bg-transparent;
    -webkit-appearance: none;
  }

  input[type=range]:focus {
    outline: none;
  }

  input[type=range]::-webkit-slider-runnable-track {
    @apply shadow-md rounded bg-gray-600 cursor-pointer;
    height: 10px;
    animate: 0.2s;
  }

  input[type=range]::-webkit-slider-thumb {
    @apply shadow-md rounded-lg bg-gray-200 cursor-pointer border border-solid border-gray-600;
    height: 30px;
    width: 15px;
    -webkit-appearance: none;
    margin-top: -10px;
  }

  input[type=range]:focus::-webkit-slider-runnable-track {
    @apply bg-blue-700;
  }

  input[type=range]::-moz-range-track {
    @apply shadow-md rounded bg-gray-600 cursor-pointer;
    height: 10px;
    animate: 0.2s;
  }

  input[type=range]::-moz-range-thumb {
    @apply shadow-md rounded-lg bg-gray-200 cursor-pointer border border-solid border-gray-600;
    height: 30px;
    width: 15px;
  }

  input[type=range]:focus::-moz-range-track {
    @apply bg-blue-700;
  }
</style>