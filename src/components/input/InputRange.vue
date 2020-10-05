<template>
  <input
    :value="modelValue"
    :min="range.min"
    :max="range.max"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full focus:outline-none mb-6"
    type="range"
    step="0.1"
  >
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'InputRange',
  props: {
    modelValue: String
  },
  setup() {
    const range = ref({});

    onMounted(() => {
      range.value.min = 0;
      range.value.max = 10;
    })

    return {
      range
    }
  }
}
</script>

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