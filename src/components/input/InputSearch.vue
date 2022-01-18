<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useStore } from 'vuex'
  
  const props = defineProps({
    autofocus: Boolean,
    pch: String
  })

  const emit = defineEmits(['do-search','reset-search'])

  const store = useStore()

  const input = ref()
  const searchInput = ref('')

  const searchActive = computed(() => store.getters['tools/searchActive'])

  watch(searchActive, () => {
    if (!searchActive.value) {
      searchInput.value = ''
    }
  })

  onMounted(() => {
    if (props.autofocus) input.value.focus()
  })

  const onBtnClearClick = () => {
    emit('reset-search', true)
    searchInput.value = ''
    input.value.focus()
  }
</script>

<template>
  <div class="search flex flex-row items-center flex-1" :class="{ 'search-input-group': searchInput }">
    <label for="search-input" class="sr-only">Search</label>
    <svg xmlns="http://www.w3.org/2000/svg" class="flex ml-4" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" />
      <circle cx="10" cy="10" r="7" />
      <line x1="21" y1="21" x2="15" y2="15" />
    </svg>
    <input
      id="search-input"
      ref="input"
      v-model.trim="searchInput"
      type="text"
      class="w-full search-input"
      :placeholder="pch"
      @keyup.enter="$emit('do-search', searchInput)"
    >
    <div class="search-input-group-append">
      <button
        v-if="searchInput"
        class="btn opacity-75 hover:opacity-100 focus:opacity-100 px-0 py-2 click-outside-ignore"
        title="Clear search"
        aria-label="Clear search"
        @click.prevent="onBtnClearClick()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
    <button
      class="btn btn-gray shadow-none hover:shadow-none py-2"
      title="Search"
      aria-label="Search"
      @click.prevent="$emit('do-search', searchInput)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-right" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="7 7 12 12 7 17" />
        <polyline points="13 7 18 12 13 17" />
      </svg>
    </button>
  </div>
</template>

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