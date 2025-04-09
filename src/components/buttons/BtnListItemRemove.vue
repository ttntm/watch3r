<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  const props = defineProps({
    display: String,
    id: String,
    mode: String
  })

  const store = useStore()

  const recSource = computed(() => store.getters['explore/recSource'])
  const searchActive = computed(() => store.getters['tools/searchActive'])

  const onBtnClick = (mode, id) => {
    if (confirm(`Are you sure?`)) {
      store.dispatch('list/deleteItem', [id, mode])
      if (searchActive.value) {
        store.dispatch('list/deleteFromSearchResults', [id, mode]) // update displayed data (so search results do not reset)
      }
      if (mode === 'tracklist' && recSource.value) {
        if (id === recSource.value.id) {
          store.dispatch('explore/initializeExplore') // in case the current recommendations are based on the deleted item
        }
      }
      if (store.getters['app/windowOpen'] === 6) {
        store.dispatch('app/toggleWindow', 0) // close mobile list controls modal
      }
    }
  }
</script>

<template>
  <button
    v-click-blur
    :class=" { 'btn btn-muted flex flex-row items-center justify-center' : display !== 'text' }"
    @click="onBtnClick(mode, id)"
  >
    <svg v-if="display !== 'text'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-minus mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
    <span v-else>&times</span>
    Remove
  </button>
</template>