<template>
  <div class="relative text-gray-700 bg-gray-300 shadow-lg sm:ml-8">
    <select name="sorting" id="sort-list" v-model="selected" class="capitalize">
      <option disabled value="">Sort {{ mode }}...</option>
      <option value="1">A->Z</option>
      <option value="2">Z->A</option>
      <option value="3">New->Old</option>
      <option value="4">Old->New</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg class="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
      </svg>
    </div>
  </div>
</template>

<script>
import {computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ListSort',
  props: {
    mode: String
  },
  setup() {
    const store = useStore();

    const selected = ref('');

    return {
      selected
    }
  }
}
</script>

<style lang="postcss" scoped>
  #sort-list {
    @apply w-full block appearance-none bg-transparent border border-transparent px-3 py-2;
  }

  #sort-list:focus {
    @apply border-yellow-600 shadow-inner;
  }
</style>