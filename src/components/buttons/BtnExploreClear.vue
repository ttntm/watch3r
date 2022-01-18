<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  const store = useStore()
  
  const active = computed(() => store.getters['explore/recSource'])

  const onClearBtnClick = () => {
    store.dispatch('explore/initializeExplore')
  }
</script>

<template>
  <button
    v-click-blur
    class="btn btn-muted flex flex-row items-center justify-center"
    :disabled="!active"
    @click="onClearBtnClick()"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-minus mr-1" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
    Clear
  </button>
</template>