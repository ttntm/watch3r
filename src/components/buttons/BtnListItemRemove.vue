<template>
  <button
    @click="handleRemove(mode, id)"
    class="btn btn-muted flex flex-row items-center justify-center"
    v-click-blur
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-minus mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
    Remove
  </button>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'BtnListItemRemove',
  props: {
    id: String,
    mode: String
  },
  setup(props) {
    const store = useStore();

    const recSource = computed(() => store.getters['explore/recSource']);
    const searchActive = computed(() => store.getters['tools/searchActive']);

    const handleRemove = (mode, id) => {
      if (confirm(`Are you sure?`)) {
        // update DB data
        store.dispatch('list/deleteItem', [id, mode]);
        if (searchActive.value) {
          // update displayed data (so search results do not reset)
          store.dispatch('list/deleteFromSearchResults', [id, mode]);
        }
        if (props.mode === 'tracklist' && id === recSource.value.refId) {
          // in case the current recommendations are based on the deleted item
          store.dispatch('explore/initializeExplore');
        }
      }
    }

    return {
      handleRemove
    }
  }
}
</script>