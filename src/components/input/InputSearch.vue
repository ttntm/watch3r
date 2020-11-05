<template>
  <div class="search flex flex-row items-center flex-1" :class="{ 'search-input-group': searchInput }">
    <label for="search-input" class="sr-only">Search</label>
    <svg xmlns="http://www.w3.org/2000/svg" class="flex ml-4" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" />
      <circle cx="10" cy="10" r="7" />
      <line x1="21" y1="21" x2="15" y2="15" />
    </svg>
    <input
      v-model.trim="searchInput"
      @keyup.enter="$emit('do-search', searchInput)"
      v-focus="autofocus"
      type="text"
      class="w-full search-input"
      id="search-input"
      :placeholder="pch"
      ref="input"
    />
    <div class="search-input-group-append">
      <button
        v-if="searchInput"
        @click.prevent="clearSearch()"
        class="click-outside-ignore font-bold text-lg opacity-75 hover:opacity-100 focus:opacity-100 px-2 py-0"
        title="Clear search"
        aria-label="Clear search"
      >&times;</button>
    </div>
    <button
      @click.prevent="$emit('do-search', searchInput)"
      class="btn btn-gray shadow-none hover:shadow-none py-2"
      title="Search"
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
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'InputSearch',
  props: {
    autofocus: Boolean,
    pch: String
  },
  setup(props, { emit }) {
    const store = useStore();

    const input = ref();
    const searchInput = ref('');
    const searchActive = computed(() => store.getters['tools/searchActive']);

    const clearSearch = () => {
      emit('reset-search', true);
      searchInput.value = '';
      input.value.focus();
    }

    watch(searchActive, () => {
      if (!searchActive.value) {
        searchInput.value = '';
      }
    })

    return {
      clearSearch,
      input,
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
  .search-input-group {
    @apply relative flex;
  }
  .search-input-group-append {
    @apply flex;
  }
  .search-input-group-append button {
    @apply relative shadow-none;
    z-index: 2;
  }
</style>