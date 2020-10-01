<template>
  <div class="flex flex-row">
    <div class="search flex flex-row items-center flex-1" :class="{ 'input-group': searchInput }">
      <label for="search-input" class="sr-only">Search</label>
      <svg xmlns="http://www.w3.org/2000/svg" class="flex ml-4" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <circle cx="10" cy="10" r="7" />
        <line x1="21" y1="21" x2="15" y2="15" />
      </svg>
      <input v-model.trim="searchInput" @keyup.enter="$emit('do-search', searchInput)" v-focus="autofocus" type="text" class="w-full search-input" id="search-input" :placeholder="pch">
      <div class="input-group-append">
        <button
          v-if="searchInput"
          @click.prevent="clearSearch()"
          class="click-outside-ignore font-bold text-lg px-4 py-0"
          title="Clear search"
          aria-label="Clear search"
        >&times;</button>
      </div>
    </div>
    <button
      @click.prevent="$emit('do-search', searchInput)"
      class="btn btn-black shadow-none"
      aria-label="Search"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-right" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <polyline points="7 7 12 12 7 17" />
        <polyline points="13 7 18 12 13 17" />
      </svg>
    </button>
  </div>
</template>

<script>
import {computed, ref } from 'vue';

export default {
  name: 'InputSearch',
  props: {
    autofocus: Boolean,
    pch: String
  },
  setup(props) {
    const searchInput = ref('');

    const clearSearch = () => {
      searchInput.value = '';
    }

    return {
      clearSearch,
      searchInput
    }
  },
  directives: {
    focus: {
      mounted(el, binding) {
        if (binding.value) {
          el.focus();
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
  .search {
    @apply bg-gray-300 border-b border-transparent;
  }
  .search:focus-within {
    @apply shadow-inner border-yellow-600;
  }
  .search-input {
    @apply bg-transparent px-3 py-2;
    z-index: 3;
  }
  .search-input:focus {
    outline: 0;
    @apply shadow-none;
  }
  .input-group {
    @apply relative flex;
  }
  .input-group-append {
    @apply flex;
  }
  .input-group-append button {
    @apply relative shadow-none;
    z-index: 2;
  }
</style>